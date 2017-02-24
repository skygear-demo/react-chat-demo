import skygearChat from 'skygear-chat';

export class ConversationSorting {
  constructor(attribute, order) {
    const attributeMap = {
      'title'             : (c) => c.title || "",
      'last update'       : (c) => c.updatedAt,
      'create time'       : (c) => c.createdAt,
      'participant count' : (c) => c.participant_count,
    };
    const orderMap = {
      'ascending'         : true,
      'descending'        : false,
    };
    if(!(
      attributeMap.hasOwnProperty(attribute) &&
      orderMap.hasOwnProperty(order)
    )) {
      throw new Error('invalid conversation sorting parameters: '+attribute+' '+order);
    }
    return function(a,b) {
      const aValue = attributeMap[attribute](a);
      const bValue = attributeMap[attribute](b);
      const sortAscending = orderMap[order];
      if(aValue > bValue) return sortAscending? -1 :  1;
      if(aValue < bValue) return sortAscending?  1 : -1;
      return 0;
    };
  }
}

export class ManagedConversationList {
  constructor({
    initialFetch = true,
    pubsubSync = true,
    sortBy = new ConversationSorting('last update','descending'),
  }) {
    // conversation compare fn (for sorting)
    this._compare = sortBy;
    // conversation IDs in order (without type prefix)
    this._orderedIDs = [];
    // map of conversaton ID => conversation object
    this._conversations = {};
    // map of subscription ID => event handler
    this._updateHandlers = {};

    if(initialFetch) {
      this.fetch();
    }

    if(pubsubSync) {
      skygearChat.subscribe(this._eventHandler);
    }
  }
  destroy() {
    skygearChat.unsubscribe(this._eventHandler);
  }
  _eventHandler(event) {
    if(event.record_type === 'conversation') {
      switch(event.event_type) {
        case 'create':
          this.add(event.record);
          break;
        case 'update':
          this.update(event.record);
          break;
        case 'delete':
          this.remove(event.record._id);
          break;
      }
    }
  }
  _conversationsUpdated() {
    const {_conversations, _compare, _updateHandlers} = this;
    this._orderedIDs = Object.keys(_conversations)
      .map(id => _conversations[id])
      .sort(_compare)
      .map(conversation => conversation._id);
    Object.keys(_updateHandlers)
      .map(key => _updateHandlers[key])
      .forEach(handler => handler(this));
  }
  fetch() {
    return skygearChat
      .getConversations()
      .then(results => {
        results.forEach(conversation => {
          this._conversations[conversation._id] = conversation;
        });
        this._conversationsUpdated();
      })
      .then(_ => this);
  }
  get length() {
    return this._orderedIDs.length;
  }
  get(indexOrID) {
    const {_conversations, _orderedIDs} = this;
    if (typeof indexOrID === 'number') {
      return _conversations[_orderedIDs[indexOrID]]
    } else {
      return _conversations[indexOrID]
    }
  }
  map(mappingFunction) {
    return this._orderedIDs
      .map(id => this._conversations[id])
      .map(mappingFunction);
  }
  add(conversation) {
    const {_conversations} = this;
    if(!_conversations.hasOwnProperty(conversation._id)) {
      _conversations[conversation._id] = conversation;
      this._conversationsUpdated();
    }
  }
  update(conversation) {
    const {_conversations} = this;
    if(
      _conversations.hasOwnProperty(conversation._id) &&
      conversation.updatedAt > _conversations[conversation._id].updatedAt
    ) {
      _conversations[conversation._id] = conversation;
      this._conversationsUpdated();
    }
  }
  remove(conversationID) {
    const {_conversations} = this;
    if(_conversations.hasOwnProperty(conversationID)) {
      delete _conversations[id];
      this._conversationsUpdated();
    }
  }
  subscribe(handler) {
    const {_updateHandlers} = this;
    const subID = Object.keys(_updateHandlers).length;
    _updateHandlers[subID] = handler;
    return subID;
  }
  unsubscribe(subID) {
    delete this._updateHandlers[subID];
  }
}
