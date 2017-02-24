import skygearChat from 'skygear-chat';

export function createSort(attribute, order) {
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
    throw new Error('invalid conversation sort parameters: '+attribute+' '+order);
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

export function createConversationList({
  sortBy = createSort('last update','descending')
}) {
  const self = {
    // conversation compare fn (for sorting)
    _compare: sortBy,
    // conversation IDs in order (without type prefix)
    _listOrder: [],
    // map of conversaton ID => conversation object
    _conversations: {},
    // map of subscription ID => event handler
    _updateHandlers: {},
  };

  function getConversation(key) {
    const {_conversations,_listOrder} = self;
    if (typeof key === 'number') {
      return _conversations[_listOrder[key]]
    } else {
      return _conversations[key]
    }
  }

  function runUpdateHandlers() {
    const {_updateHandlers} = self;
    Object.keys(_updateHandlers)
      .map(key => _updateHandlers[key])
      .forEach(handler => handler(self));
  }

  self.subscribeUpdate = function(handler) {
    const {_updateHandlers} = self;
    const subID = Object.keys(_updateHandlers).length;
    _updateHandlers[subID] = handler;
    return subID;
  }
  
  self.unsubscribeUpdate = function(subID) {
    const {_updateHandlers} = self;
    delete _updateHandlers[subID];
  }

  self.addConversation(conversation) {
    const {_conversations,_compare} = self;
    if(!_conversations.hasOwnProperty(conversation._id)) {
      _conversations[conversation._id] = conversation;
      self._listOrder = Object.keys(_conversations).sort(_compare);
      runUpdateHandlers();
    }
  }

  self.updateConversation(conversation) {
    const {_conversations,_compare} = self;
    if(
      _conversations.hasOwnProperty(conversation._id) &&
      conversation.updatedAt > _conversations[conversation._id].updatedAt
    ) {
      _conversations[conversation._id] = conversation;
      self._listOrder = Object.keys(_conversations).sort(_compare);
      runUpdateHandlers();
    }
  }

  self.removeConversation(id) {
    const {_conversations,_compare} = self;
    if(_conversations.hasOwnProperty(id)) {
      delete _conversations[id];
      self._listOrder = Object.keys(_conversations).sort(_compare);
      runUpdateHandlers();
    }
  }

  // fetch conversations
  skygearChat.getConversations().then(results => {
    const {_conversations,_compare} = self;
    results.forEach(conversation => {
      _conversations[conversation._id] = conversation;
    });
    self.listOrder = Object.keys(_conversations).sort(_compare);
    runUpdateHandlers();
  });

  // subscribe to server events
  self._eventHandler = function(event) {
    if(event.record_type === 'conversation') {
      switch(event.event_type) {
        case 'create':
          self.addConversation(event.record);
          break;
        case 'update':
          self.updateConversation(event.record);
          break;
        case 'delete':
          self.removeConversation(event.record._id);
          break;
      }
    }
  }
  skygearChat.subscribe(self._eventHandler);

  // provide array-like interface
  const selfProxy = new Proxy(self, {
    get: (_,key) => getConversation(key);
  });
  selfProxy.map = Array.prototype.map;
  selfProxy.filter = Array.prototype.filter;
  selfProxy.reduce = Array.prototype.reduce;
  selfProxy.forEach = Array.prototype.forEach;

  return selfProxy;
}

export function destroyConversationList(conversationList) {
  skygearChat.unsubscribe(conversationList._eventHandler);
}

