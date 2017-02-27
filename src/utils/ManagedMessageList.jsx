import skygearChat from 'skygear-chat';

export default class ManagedMessageList {
  constructor(conversation, {
    initialFetch = 50,  // fetch messages on creation (int limit of messages or false)
    pubsubSync = true,  // automatically sync list with server using pubsub
    autoRead = true,    // automatically mark all recieved messages as read
  } = {}) {
    this._conversation = conversation;
    this._autoRead = autoRead;
    // message IDs in order (without type prefix)
    this._orderedIDs = [];
    // map of message ID => message object
    this._messages = {};
    // map of subscription ID => event handler
    this._updateHandlers = {};

    if(initialFetch) {
      this.fetch(initialFetch);
    }
    if(pubsubSync) {
      skygearChat.subscribe(this._eventHandler.bind(this));
    }
  }
  destroy() {
    skygearChat.unsubscribe(this._eventHandler);
  }
  _eventHandler(event) {
    if(
      event.record_type === 'message' &&
      event.record.conversation_id.id === this._conversation.id
    ) {
      console.log(`[message event]`, event);
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
  _messagesUpdated() {
    const {_messages, _updateHandlers} = this;
    this._orderedIDs = Object.keys(_messages)
      .map(id => _messages[id])
      .sort((a,b) => a.createdAt - b.createdAt)
      .map(message => message._id);
    Object.keys(_updateHandlers)
      .map(key => _updateHandlers[key])
      .forEach(handler => handler(this));
  }
  fetch(resultLimit) {
    return skygearChat
      .getMessages(
        this._conversation,
        resultLimit
      ).then(results => {
        console.log('[fetched messages]', results);
        results.forEach(message => {
          this._messages[message._id] = message;
        });
        if(this._autoRead) {
          skygearChat.markAsRead(results);
        }
        this._messagesUpdated();
        return this;
      });
  }
  get length() {
    return this._orderedIDs.length;
  }
  get(indexOrID) {
    const {_messages, _orderedIDs} = this;
    if (typeof indexOrID === 'number') {
      return _messages[_orderedIDs[indexOrID]]
    } else {
      return _messages[indexOrID]
    }
  }
  map(mappingFunction) {
    return this._orderedIDs
      .map(id => this._messages[id])
      .map(mappingFunction);
  }
  add(message) {
    const {_messages} = this;
    if(!_messages.hasOwnProperty(message._id)) {
      _messages[message._id] = message;
      this._messagesUpdated();
      if(this._autoRead) {
        skygearChat.markAsRead(results);
      }
    }
  }
  update(message) {
    const {_messages} = this;
    if(
      _messages.hasOwnProperty(message._id) &&
      message.updatedAt > _messages[message._id].updatedAt
    ) {
      _messages[message._id] = message;
      this._messagesUpdated();
    } else {
      this.add(message);
    }
  }
  remove(messageID) {
    const {_messages} = this;
    if(_messages.hasOwnProperty(messageID)) {
      delete _messages[messageID];
      this._messagesUpdated();
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
