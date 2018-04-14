webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _container = __webpack_require__(69);

var _container2 = _interopRequireDefault(_container);

var _utils = __webpack_require__(118);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_container2.default.utils = utils;

module.exports = _container2.default;

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserLoader = {
  _userPromiseCache: {},
  get: function get(userID) {
    if (this._userPromiseCache.hasOwnProperty(userID)) {
      return this._userPromiseCache[userID];
    } else {
      var userPromise = _skygear2.default.publicDB.query(new _skygear2.default.Query(_skygear2.default.UserRecord).equalTo('_id', userID)).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            user = _ref2[0];

        return user || Promise.reject('User ID not found: ' + userID);
      });
      this._userPromiseCache[userID] = userPromise;
      return userPromise;
    }
  },

  getUsersByUsernames: function getUsersByUsernames(usernames) {
    return _skygear2.default.publicDB.query(new _skygear2.default.Query(_skygear2.default.UserRecord).contains('username', usernames));
  }
};

exports.default = UserLoader;

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkygearChatContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _underscore = __webpack_require__(70);

var _underscore2 = _interopRequireDefault(_underscore);

var _pubsub = __webpack_require__(117);

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Conversation = _skygear2.default.Record.extend('conversation');
var Message = _skygear2.default.Record.extend('message');
var Receipt = _skygear2.default.Record.extend('receipt');
var UserConversation = _skygear2.default.Record.extend('user_conversation');
/**
 * SkygearChatContainer provide API access to the chat plugin.
 */

var SkygearChatContainer = exports.SkygearChatContainer = function () {
  function SkygearChatContainer() {
    _classCallCheck(this, SkygearChatContainer);
  }

  _createClass(SkygearChatContainer, [{
    key: 'createConversation',

    /**
     * createConversation create an conversation with provided participants and
     * title.
     *
     * Duplicate call of createConversation with same list of participants will
     * return the different conversation, unless `distinctByParticipants` in
     * options is set to true. By default `distinctByParticipants` is false.
     *
     * Adding or removing participants from a distinct conversation (see below)
     * makes it non-distinct.
     *
     * For application specific attributes, you are suggested to put them as
     * meta.
     *
     * All participant will be admin unless specific in options.admins
     *
     * @example
     * const skygearChat = require('skygear-chat');
     *
     * skygearChat.createConversation([userBen], 'Greeting')
     *   .then(function (conversation) {
     *     console.log('Conversation created!', conversation);
     *   }, function (err) {
     *     console.log('Conversation created fails');
     *   });
     *
     * @param {[]User} participants - array of Skygear Users
     * @param {string} title - string for describing the conversation topic
     * @param {object} meta - attributes for application specific purpose
     * @param {object} [options] - options for the conversation, avaliable options `distinctByParticipants` and `admins`
     * @param {boolean} [options.distinctByParticipants] - create conversation distinct by participants
     * @param {[]string|[]User} [options.admins] - admin IDs of the conversation
     *
     * @return {Promise<Conversation>} - Promise of the new Conversation Record
     */
    value: function createConversation(participants) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (_underscore2.default.isArray(options.admins)) {
        options.adminIDs = options.admins.map(function (admin) {
          return admin._id || admin;
        });
        delete options.admins;
      }

      return _skygear2.default.lambda('chat:create_conversation', [participants, title, meta, options]).then(function (result) {
        return new Conversation(result.conversation);
      });
    }

    /**
     * createDirectConversation is a helper function will create conversation
     * with distinctByParticipants set to true
     *
     * @example
     * const skygearChat = require('skygear-chat');
     *
     * skygearChat.createDirectConversation(userBen, 'Greeting')
     *   .then(function (conversation) {
     *     console.log('Conversation created!', conversation);
     *   }, function (err) {
     *     console.log('Conversation created fails');
     *   });
     *
     * @param {User} user - Skygear Users
     * @param {string} title - string for describing the conversation topic
     * @param {object} meta - attributes for application specific purpose
     * @param {object} [options] - options for the conversation, avaliable options `admins`
     * @param {[]string|[]User} [options.admins] - admin IDs of the conversation
     *
     * @return {Promise<Conversation>} - Promise of the new Conversation Record
     */

  }, {
    key: 'createDirectConversation',
    value: function createDirectConversation(user) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      options.distinctByParticipants = true;
      return this.createConversation([user], title, meta, options);
    }

    /**
     * getConversation query a Conversation Record from Skygear
     *
     * @param {string} conversationID - ConversationID
     * @param {boolean} [includeLastMessage=true] - message is fetched and assigned to each conversation object.
     * @return {Promise<Conversation>}  A promise to array of Conversation
     */

  }, {
    key: 'getConversation',
    value: function getConversation(conversationID) {
      var includeLastMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return _skygear2.default.lambda('chat:get_conversation', [conversationID, includeLastMessage]).then(function (data) {
        if (data.conversation === null) {
          throw new Error('no conversation found');
        }
        return new Conversation(data.conversation);
      });
    }

    /**
     * getConversations query a list of Conversation Records from Skygear which
     * are readable to the current user
     *
     * @param {number} [page=1] - Which page to display, default to the 1. The
     * first page
     * @param {number} [pageSize=50] - How many item pre page, default to 50.
     * @param {boolean} [includeLastMessage=true] - message is fetched and assigned to each conversation object.
     * @return {Promise<[]Conversation>} A promise to array of Conversation.
     */

  }, {
    key: 'getConversations',
    value: function getConversations() {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var includeLastMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return _skygear2.default.lambda('chat:get_conversations', [page, pageSize, includeLastMessage]).then(function (data) {
        return data.conversations.map(function (record) {
          return new Conversation(record);
        });
      });
    }

    /**
     * _getUserConversation query a UserConversation record of current logged
     * in user by conversation.id
     *
     * @param {Conversation} conversation - Conversation
     * @return {Promise<UserConversation>} - A promise to UserConversation Recrod
     * @private
     */

  }, {
    key: '_getUserConversation',
    value: function _getUserConversation(conversation) {
      var query = new _skygear2.default.Query(UserConversation);
      query.equalTo('user', new _skygear2.default.Reference(_skygear2.default.auth.currentUser.id));
      query.equalTo('conversation', new _skygear2.default.Reference(conversation.id));
      return _skygear2.default.publicDB.query(query).then(function (records) {
        if (records.length > 0) {
          return records[0];
        }
        throw new Error('no conversation found');
      });
    }

    /**
     * updateConversation is a helper method for updating a conversation with
     * the provied title and meta.
     *
     * @param {Conversation} conversation - Conversation to update
     * @param {string} title - new title for describing the conversation topic
     * @param {object} meta - new attributes for application specific purpose
     * @return {Promise<Conversation>} - A promise to save result
     */

  }, {
    key: 'updateConversation',
    value: function updateConversation(conversation, title, meta) {
      var newConversation = new Conversation();
      newConversation._id = conversation._id;
      if (title) {
        newConversation.title = title;
      }
      if (meta) {
        newConversation.meta = meta;
      }
      return _skygear2.default.publicDB.save(newConversation);
    }

    /**
     * Leave a conversation.
     *
     * @param {Conversation} conversation - Conversation to leave
     * @return {Promise<boolean>} - Promise of result
     */

  }, {
    key: 'leaveConversation',
    value: function leaveConversation(conversation) {
      return _skygear2.default.lambda('chat:leave_conversation', [conversation._id]).then(function () {
        return true;
      });
    }

    /**
     * Delete a conversation.
     *
     * @param {Conversation} conversation - Conversation to be deleted
     * @return {Promise<boolean>} - Promise of result
     */

  }, {
    key: 'deleteConversation',
    value: function deleteConversation(conversation) {
      return _skygear2.default.lambda('chat:delete_conversation', [conversation._id]).then(function () {
        return true;
      });
    }

    /**
     * addParticipants allow adding participants to a conversation.
     *
     * @param {Conversation} conversation - Conversation to update
     * @param {[]User} participants - array of Skygear User
     * @return {Promise<Conversation>} - A promise to save result
     */

  }, {
    key: 'addParticipants',
    value: function addParticipants(conversation, participants) {
      var conversation_id = _skygear2.default.Record.parseID(conversation.id)[1];
      var participant_ids = _underscore2.default.map(participants, function (user) {
        return user._id;
      });

      return _skygear2.default.lambda('chat:add_participants', [conversation_id, participant_ids]).then(function (data) {
        return new Conversation(data.conversation);
      });
    }

    /**
     * removeParticipants allow removal of participants from a conversation.
     *
     * Remove an user from participants of a conversation will also remove it
     * from admins.
     * @param {Conversation} conversation - Conversation to update
     * @param {[]User} participants - array of Skygear User
     * @return {Promise<COnversation>} - A promise to save result
     */

  }, {
    key: 'removeParticipants',
    value: function removeParticipants(conversation, participants) {
      var conversation_id = _skygear2.default.Record.parseID(conversation.id)[1];
      var participant_ids = _underscore2.default.map(participants, function (user) {
        return user._id;
      });
      return _skygear2.default.lambda('chat:remove_participants', [conversation_id, participant_ids]).then(function (data) {
        return new Conversation(data.conversation);
      });
    }

    /**
     * addAdmins allow adding admins to a conversation.
     *
     * The use will also add as participants of the conversation if he is not
     * already a participants of the conversation.
     * @param {Conversation} conversation - Conversation to update
     * @param {[]User} admins - array of Skygear User
     * @return {Promise<Conversation>} - A promise to save result
     */

  }, {
    key: 'addAdmins',
    value: function addAdmins(conversation, admins) {
      var conversation_id = _skygear2.default.Record.parseID(conversation.id)[1];
      var admin_ids = _underscore2.default.map(admins, function (user) {
        return user._id;
      });
      return _skygear2.default.lambda('chat:add_admins', [conversation_id, admin_ids]).then(function (data) {
        return new Conversation(data.conversation);
      });
    }

    /**
     * removeAdmins allow removal of admins from a conversation.
     *
     * The removed user will still as the participants of the conversation.
     * @param {Conversation} conversation - Conversation to update
     * @param {[]User} admins - array of Skygear User
     * @return {Promise<Conversation>} - A promise to save result
     */

  }, {
    key: 'removeAdmins',
    value: function removeAdmins(conversation, admins) {
      var conversation_id = _skygear2.default.Record.parseID(conversation.id)[1];
      var admin_ids = _underscore2.default.map(admins, function (user) {
        return user._id;
      });
      return _skygear2.default.lambda('chat:remove_admins', [conversation_id, admin_ids]).then(function (data) {
        return new Conversation(data.conversation);
      });
    }

    /**
     * createMessage create a message in a conversation.
     *
     * A message can be just a text message, or a message with image, audio or
     * video attachment. Application developer can also save metadata to a
     * message, so the message can be display as important notice. The metadata
     * provide flexibility to application to control how to display the message,
     * like font and color.
     *
     * @example
     * const skygearChat = require('skygear-chat');
     *
     * skygearChat.createMessage(
     *   conversation,
     *   'Red in color, with attachment',
     *   {'color': 'red', },
     *   $('message-asset').files[0],
     * ).then(function (result) {
     *   console.log('Save success', result);
     * });
     *
     * @param {Conversation} conversation - create the message in this conversation
     * @param {string} body - body text of the message
     * @param {object} metadata - application specific meta data for display
     * purpose
     * @param {File|skygear.Asset} asset - Browser file object to be saves as
     * attachment of this message, also accept skygear.Asset instance
     * @return {Promise<Message>} - A promise to save result
     */

  }, {
    key: 'createMessage',
    value: function createMessage(conversation, body, metadata, asset) {
      var message = new Message();

      message.conversation = new _skygear2.default.Reference(conversation.id);
      message.body = body;

      if (metadata === undefined || metadata === null) {
        message.metadata = {};
      } else {
        message.metadata = metadata;
      }
      if (asset) {
        if (asset instanceof _skygear2.default.Asset) {
          message.attachment = asset;
        } else {
          var skyAsset = new _skygear2.default.Asset({
            file: asset,
            name: asset.name
          });
          message.attachment = skyAsset;
        }
      }

      return _skygear2.default.publicDB.save(message);
    }

    /**
     * editMessage edit the body, meta and asset of an existing message
     *
     * @example
     * const skygearChat = require('skygear-chat');
     * skygearChat.editMessage(
     *   message,
     *    'new message Body',
     * ).then(function(result) {
     *   console.log('Save success', result);
     * });
     *
     * @param {Message} message - The message object to be edited
     * @param {string} body - New message body
     * @param {object} metadata - New application specific meta data for display
     * purpose, omitting thie parameter will keep the old meta
     * @param {File} asset - New file object to be saves as attachment of this
     * message, omitting thie parameter will keep the old asset
     * @return {Promise<Mesage>} A promise to save result
     */

  }, {
    key: 'editMessage',
    value: function editMessage(message) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var asset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (body) {
        message.body = body;
      }
      if (metadata) {
        message.metadata = metadata;
      }
      if (asset) {
        var skyAsset = new _skygear2.default.Asset({
          file: asset,
          name: asset.name
        });
        message.attachment = skyAsset;
      }
      return _skygear2.default.publicDB.save(message);
    }

    /**
     * deleteMessage delete an existing message
     *
     * @example
     * const skygearChat = require('skygear-chat');
     * skygearChat.deleteMessage(
     *    message
     * ).then(function(result) {
     *    console.log('Deletion success', result);
     * });
     *
     * @param {Message} message - The message object to be deleted
     * @return {Promise<Message>} A promise to deleted message
     */

  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message) {
      return _skygear2.default.lambda('chat:delete_message', [message._id]).then(function (data) {
        return new Message(data);
      });
    }

    /**
     * getUnreadCount return following unread count;
     *
     * 1. The total unread message count of current user.
     * 2. The total number of conversation have one or more unread message.
     *
     * Format is as follow:
     * ```
     * {
     *   'conversation': 3,
     *   'message': 23
     * }
     * ```
     *
     * @example
     * const skygearChat = require('skygear-chat');¬
     *
     * skygearChat.getUnreadCount().then(function (count) {
     *   console.log('Total message unread count: ', count.message);
     *   console.log(
     *     'Total converation have unread message: ',
     *     count.conversation);
     * }, function (err) {
     *   console.log('Error: ', err);
     * });
     *
     * @return {Promise<object>} - A promise to total count object
     */

  }, {
    key: 'getUnreadCount',
    value: function getUnreadCount() {
      return _skygear2.default.lambda('chat:total_unread');
    }

    /**
     * getMessages returns an array of message in a conversation. The way of
     * query is to provide `limit` and `beforeTime`. The expected way is to
     * query from the latest message first. And use the message `createdAt` to
     * query the next pages via setting `beforeTime` when user scroll.
     *
     * Once you query specific messages, the SDK will automatically mark the
     * message as delivery on the server.
     *
     * @example
     * const skygearChat = require('skygear-chat');¬
     *
     * const ulNode = document.createElement('UL');
     * const currentTime = new Date();
     * skygearChat.getMessages(conversation, 10, currentTime)
     *   .then(function (messages) {
     *     let lastMsgTime;
     *     message.forEach(function (m) {
     *       const liNode = document.createElement('LI');
     *       liNode.appendChild(document.createTextNode(m.content));
     *       ulNode.appendChild(liNode);
     *       lastMsgTime = m.createAt;
     *     });
     *     // Querying next page
     *     skygearChat.getMessages(conversation, 10, lastMsgTime).then(...);
     *   }, function (err) {
     *     console.log('Error: ', err);
     *   });
     *
     * @param {Conversation} conversation - conversation to query
     * @param {number} [limit=50] - limit the result set, if it is set to too large, may
     * result in timeout.
     * @param {Date} beforeTime - specific from which time
     * @param {string} order - order of the message, 'edited_at' or '_created_at'
     * @return {Promise<[]Message>} - array of Message records
     */

  }, {
    key: 'getMessages',
    value: function getMessages(conversation) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var beforeTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var conversationID = conversation._id;
      var params = {
        conversation_id: conversationID,
        limit: limit
      };
      if (beforeTime) {
        params.before_time = beforeTime;
      }
      if (order) {
        params.order = order;
      }

      return _skygear2.default.lambda('chat:get_messages', params).then(function (data) {
        data.results = data.results.map(function (message_data) {
          return new Message(message_data);
        });
        this.markAsDelivered(data.results);
        return data.results;
      }.bind(this));
    }

    /**
     * getMessageReceipts returns an array of receipts of a message.
     * @param {Message} message - the message
     * @return {Promise<[]Receipt>} - array of Receipt records
     */

  }, {
    key: 'getMessageReceipts',
    value: function getMessageReceipts(message) {
      var messageID = message._id;
      return _skygear2.default.lambda('chat:get_receipt', [messageID]).then(function (data) {
        data.receipts = data.receipts.map(function (record) {
          return new Receipt(record);
        });
        return data.receipts;
      });
    }

    /**
     * markAsDelivered mark all messages as delivered
     *
     * @param {[]Message} messages - an array of message to mark as delivery
     * @return {Promise<boolean>}  A promise to result
     */

  }, {
    key: 'markAsDelivered',
    value: function markAsDelivered(messages) {
      var message_ids = _underscore2.default.map(messages, function (m) {
        return m._id;
      });
      return _skygear2.default.lambda('chat:mark_as_delivered', [message_ids]);
    }

    /**
     * markAsRead mark all messages as read
     *
     * @param {[]Message} messages - an array of message to mark as read
     * @return {Promise<boolean>} - A promise to result
     */

  }, {
    key: 'markAsRead',
    value: function markAsRead(messages) {
      var message_ids = _underscore2.default.map(messages, function (m) {
        return m._id;
      });
      return _skygear2.default.lambda('chat:mark_as_read', [message_ids]);
    }

    /**
     * markAsLastMessageRead mark the message as last read message.
     * Once you mark a message as last read, the system will update the unread
     * count at UserConversation.
     *
     * @param {Conversation} conversation - conversation the message belong to
     * @param {Message} message - message to be mark as last read
     * @return {Promise<number>} - A promise to result
     */

  }, {
    key: 'markAsLastMessageRead',
    value: function markAsLastMessageRead(conversation, message) {
      return this._getUserConversation(conversation).then(function (uc) {
        uc.last_read_message = new _skygear2.default.Reference(message.id);
        _skygear2.default.publicDB.save(uc);
        conversation.last_read_message_ref = uc.last_read_message;
        conversation.last_read_message = message;
        return conversation;
      });
    }

    /**
     * getUnreadMessageCount query a unread count of a conversation
     * @param {Conversation} conversation - conversation to be query
     * @return {Promise<number>} - A promise to result
     * @deprecated Use conversation.unread_count instead
     */

  }, {
    key: 'getUnreadMessageCount',
    value: function getUnreadMessageCount(conversation) {
      return conversation.unread_count;
    }
  }, {
    key: 'sendTypingIndicator',


    /**
     * sendTypingIndicaton send typing indicator to the specified conversation.
     * The event can be `begin`, `pause` and `finished`.
     *
     * @param {Conversation} conversation - conversation to be query
     * @param {string} event - the event to send
     * @return {Promise<number>} - A promise to result
     */
    value: function sendTypingIndicator(conversation, event) {
      this.pubsub.sendTyping(conversation, event);
    }

    /**
     * Subscribe to typing indicator events in a conversation.
     *
     * You are required to specify a conversation where typing indicator
     * events apply. You may subscribe to multiple conversation at the same time.
     * To get typing indicator event, call this method with a handler that
     * accepts following parameters.
     *
     * ```
     * {
     *   "user/id": {
     *     "event": "begin",
     *     "at": "20161116T78:44:00Z"
     *   },
     *   "user/id2": {
     *     "event": "begin",
     *     "at": "20161116T78:44:00Z"
     *   }
     * }
     * ```
     *
     * @param {Conversation} conversation - conversation to be query
     * @param {function} callback - function be be invoke when there is someone
     * typing in the specificed conversation
     */

  }, {
    key: 'subscribeTypingIndicator',
    value: function subscribeTypingIndicator(conversation, callback) {
      this.pubsub.subscribeTyping(conversation, callback);
    }

    /**
     * Subscribe to typing indicator events in all conversation.
     *
     * If you application want to dispatch the typing other than
     * per-conversation manner. You can use this method in stead of
     * `subscribeTypingIndicator`.
     *
     * The format of payload is similiar with conversation id as key to separate
     * users' typing event.
     * To get typing indicator event, call this method with a handler that
     * accepts following parameters.
     *
     * ```
     * {
     *   "conversation/id1": {
     *     "user/id": {
     *       "event": "begin",
     *       "at": "20161116T78:44:00Z"
     *     },
     *     "user/id2": {
     *       "event": "begin",
     *       "at": "20161116T78:44:00Z"
     *     }
     *   }
     * }
     * ```
     *
     * @param {function} callback - function be be invoke when there is someone
     * typing in conversation you have access to.
     */

  }, {
    key: 'subscribeAllTypingIndicator',
    value: function subscribeAllTypingIndicator(callback) {
      this.pubsub.subscribeAllTyping(callback);
    }

    /**
     * unsubscribe one or all typing indicator handler(s) from a conversation.
     *
     * @param {Conversation} conversation - conversation to be unsubscribe
     * @param {function?} handler - Which handler to remove,
     * if absent, all handlers are removed.
     */

  }, {
    key: 'unsubscribeTypingIndicator',
    value: function unsubscribeTypingIndicator(conversation, handler) {
      this.pubsub.unsubscribeTyping(conversation, handler);
    }

    /**
     * subscribe all message changes event from the system.
     *
     * The server will push all messsage change events via UserChannel that
     * concerning the current user. i.e. all message belongs to a conversation
     * that the current user have access to.
     *
     * The handler will receive following object as parameters
     *
     * ```
     * {
     *   "record_type": "message",
     *   "event_type": "create",
     *   "record": recordObj,
     *   "original_record": nulll
     * }
     * ```
     *
     * - `event_type` can be `update`, `create` and `delete`.
     * - `recordObj` is `skygear.Record` instance.
     *
     * Common use-case on the event_type:
     * `create` - other user send a message to the conversation and insert it in
     * the conversation view.
     * `updated` - when a message is received by other, the message delivery
     * status is changed. For example, from `delivered` to `some_read`. You can
     * check the `message_status` fields to see the new delivery status.
     *
     * @param {function} handler - function to be invoke when a notification arrive
     */

  }, {
    key: 'subscribe',
    value: function subscribe(handler) {
      this.pubsub.subscribeMessage(handler);
    }
    /**
     * Unsubscribe one or all typing message handler(s)
     *
     * @param {function?} handler - Which handler to remove,
     * if absent, all handlers are removed.
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(handler) {
      this.pubsub.unsubscribeMessage(handler);
    }
  }, {
    key: 'pubsub',
    get: function get() {
      if (!this._pubsub) {
        this._pubsub = new _pubsub2.default(_skygear2.default);
      }
      return this._pubsub;
    }
  }]);

  return SkygearChatContainer;
}();

var chatContainer = new SkygearChatContainer();
exports.default = chatContainer;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ }),
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _ManagedConversationList = __webpack_require__(142);

var _ManagedConversationList2 = _interopRequireDefault(_ManagedConversationList);

var _Conversation = __webpack_require__(123);

var _Conversation2 = _interopRequireDefault(_Conversation);

var _ConversationPreview = __webpack_require__(124);

var _ConversationPreview2 = _interopRequireDefault(_ConversationPreview);

var _CreateChatModal = __webpack_require__(125);

var _CreateChatModal2 = _interopRequireDefault(_CreateChatModal);

var _CreateGroupModal = __webpack_require__(126);

var _CreateGroupModal2 = _interopRequireDefault(_CreateGroupModal);

var _SettingsModal = __webpack_require__(129);

var _SettingsModal2 = _interopRequireDefault(_SettingsModal);

var _DetailsModal = __webpack_require__(127);

var _DetailsModal2 = _interopRequireDefault(_DetailsModal);

var _App = __webpack_require__(133);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function AddButton(_ref) {
  var text = _ref.text,
      onClick = _ref.onClick;

  return _react2.default.createElement(
    'button',
    {
      onClick: onClick,
      style: _App2.default.addButton },
    '+ ',
    text
  );
}

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      unreadCount: 0, // user's total unread message count (int)
      currentModal: null, // currently displayed modal dialog name (or null)
      activeID: null // currently selected UserConversion ID (or null)
    };
    _this.ConversationList = new _ManagedConversationList2.default();
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // subscribe conversation change
      this.ConversationList.subscribe(function () {
        _this2.forceUpdate();
        _this2.updateUnreadCount();
      });
      this.updateUnreadCount();
    }
  }, {
    key: 'updateUnreadCount',
    value: function updateUnreadCount() {
      var _this3 = this;

      _skygearChat2.default.getUnreadCount().then(function (result) {
        _this3.setState({ unreadCount: result.message });
      });
    }
  }, {
    key: 'selectConversation',
    value: function selectConversation(conversation) {
      this.setState({
        activeID: conversation._id,
        unreadCount: this.state.unreadCount - conversation.unread_count
      });
      conversation.unread_count = 0;
      this.updateUnreadCount();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state = this.state,
          unreadCount = _state.unreadCount,
          currentModal = _state.currentModal,
          activeID = _state.activeID,
          ConversationList = this.ConversationList;

      var activeConversation = ConversationList.get(activeID);

      return _react2.default.createElement(
        'div',
        {
          style: _App2.default.root },
        _react2.default.createElement(
          'div',
          {
            style: _App2.default.leftPanel },
          _react2.default.createElement(
            'div',
            {
              style: _App2.default.settingPanel },
            _react2.default.createElement(
              'span',
              null,
              unreadCount > 0 ? '(' + unreadCount + ')' : ''
            ),
            _react2.default.createElement(
              'h1',
              null,
              'Chats'
            ),
            _react2.default.createElement('img', {
              src: 'img/gear.svg',
              style: _App2.default.settingImg,
              onClick: function onClick() {
                return _this4.setState({ currentModal: 'settings' });
              } })
          ),
          _react2.default.createElement(
            'div',
            {
              style: _App2.default.creationPanel },
            _react2.default.createElement(AddButton, {
              text: 'Direct Chat',
              onClick: function onClick() {
                return _this4.setState({ currentModal: 'createChat' });
              } }),
            _react2.default.createElement(AddButton, {
              text: 'Group',
              onClick: function onClick() {
                return _this4.setState({ currentModal: 'createGroup' });
              } })
          ),
          _react2.default.createElement(
            'div',
            { style: _App2.default.conversationContainer },
            ConversationList.map(function (c) {
              return _react2.default.createElement(_ConversationPreview2.default, {
                key: 'ConversationPreview-' + c.id + c.updatedAt,
                selected: c.id === activeID,
                conversation: c,
                onClick: function onClick() {
                  return _this4.selectConversation(c);
                } });
            })
          )
        ),
        activeID && _react2.default.createElement(_Conversation2.default, {
          key: 'Conversation-' + activeID,
          conversation: activeConversation,
          showDetails: function showDetails() {
            return _this4.setState({ currentModal: 'details' });
          } }),
        function (modal) {
          switch (modal) {
            case 'createGroup':
              return _react2.default.createElement(_CreateGroupModal2.default, {
                addConversationDelegate: function addConversationDelegate(c) {
                  return ConversationList.addConversation(c);
                },
                onClose: function onClose() {
                  return _this4.setState({ currentModal: null });
                } });
            case 'createChat':
              return _react2.default.createElement(_CreateChatModal2.default, {
                addConversationDelegate: function addConversationDelegate(c) {
                  return ConversationList.addConversation(c);
                },
                onClose: function onClose() {
                  return _this4.setState({ currentModal: null });
                } });
            case 'settings':
              return _react2.default.createElement(_SettingsModal2.default, {
                onClose: function onClose() {
                  return _this4.setState({ currentModal: null });
                } });
            case 'details':
              return _react2.default.createElement(_DetailsModal2.default, {
                key: 'DetailsModal-' + activeID.id,
                conversation: activeConversation,
                updateConversationDelegate: function updateConversationDelegate(c) {
                  return ConversationList.updateConversation(c);
                },
                removeConversationDelegate: function removeConversationDelegate(c) {
                  return ConversationList.removeConversation(c);
                },
                onClose: function onClose() {
                  return _this4.setState({ currentModal: null });
                } });
            default:
              return null;
          }
        }(currentModal)
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _uuid = __webpack_require__(119);

var _uuid2 = _interopRequireDefault(_uuid);

var _underscore = __webpack_require__(70);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserChannel = _skygear2.default.Record.extend('user_channel');

/**
 * SkygearChatPubsub is a class for dsipatching the message from user_channel
 * to the coorrect handler according to the event type and registeration
 */

var SkygearChatPubsub = function () {
  function SkygearChatPubsub(container) {
    _classCallCheck(this, SkygearChatPubsub);

    this.pubsub = container.pubsub;
    this.userChannel = null;
    this.dispatch = this.dispatch.bind(this);
    this.getUserChannel().then(this.subscribeDispatch.bind(this));
    this.typingHandler = {};
    this.allTypingHandler = [];
    this.messageHandler = [];
  }

  _createClass(SkygearChatPubsub, [{
    key: 'subscribeDispatch',
    value: function subscribeDispatch(channel) {
      this.pubsub.on(channel.name, this.dispatch);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(payload) {
      if (payload.event === 'typing') {
        this.dispatchTyping(payload.data);
      } else {
        this.dispatchUpdate(payload.data);
      }
    }
  }, {
    key: 'dispatchUpdate',
    value: function dispatchUpdate(data) {
      var obj = {
        record_type: data.record_type,
        event_type: data.event_type
      };
      obj.record = new _skygear2.default.Record(data.record_type, data.record);
      if (data.original_record) {
        obj.original_record = new _skygear2.default.Record(data.record_type, data.original_record);
      }
      _underscore2.default.forEach(this.messageHandler, function (handler) {
        handler(obj);
      });
    }
  }, {
    key: 'dispatchTyping',
    value: function dispatchTyping(data) {
      _underscore2.default.forEach(this.allTypingHandler, function (ah) {
        ah(data);
      });
      _underscore2.default.forEach(data, function (t, conversationID) {
        var handlers = this.typingHandler[conversationID];
        _underscore2.default.forEach(handlers, function (h) {
          h(t);
        });
      }.bind(this));
    }
  }, {
    key: 'sendTyping',
    value: function sendTyping(conversation, state) {
      _skygear2.default.lambda('chat:typing', [conversation._id, state, new Date()]);
    }
  }, {
    key: 'subscribeAllTyping',
    value: function subscribeAllTyping(handler) {
      this.allTypingHandler.push(handler);
    }
  }, {
    key: 'subscribeTyping',
    value: function subscribeTyping(conversation, handler) {
      if (!this.typingHandler[conversation.id]) {
        this.typingHandler[conversation.id] = [];
      }
      this.typingHandler[conversation.id].push(handler);
    }
  }, {
    key: 'unsubscribeTyping',
    value: function unsubscribeTyping(conversation, handler) {
      var conversationHandler = this.typingHandler[conversation.id];
      if (!conversationHandler) {
        return;
      }
      var index = conversationHandler.indexOf(handler);
      if (!handler || index === -1) {
        this.typingHandler[conversation.id] = [];
      } else {
        conversationHandler.splice(index, 1);
      }
    }
  }, {
    key: 'subscribeMessage',
    value: function subscribeMessage(handler) {
      this.messageHandler.push(handler);
    }
  }, {
    key: 'unsubscribeMessage',
    value: function unsubscribeMessage(handler) {
      var index = this.messageHandler.indexOf(handler);
      if (!handler || index === -1) {
        this.messageHandler = [];
      } else {
        this.messageHandler.splice(index, 1);
      }
    }
  }, {
    key: 'getUserChannel',
    value: function getUserChannel() {
      if (this.userChannel) {
        return Promise.resolve(this.userChannel);
      }
      var query = new _skygear2.default.Query(UserChannel);
      return _skygear2.default.privateDB.query(query).then(function (records) {
        if (records.length > 0) {
          this.userChannel = records[0];
          return this.userChannel;
        }
        return null;
      }.bind(this)).then(function (record) {
        if (record === null) {
          var channel = new UserChannel();
          channel.name = _uuid2.default.v4();
          return _skygear2.default.privateDB.save(channel);
        }
        this.userChannel = record;
        return this.userChannel;
      }.bind(this));
    }
  }]);

  return SkygearChatPubsub;
}();

exports.default = SkygearChatPubsub;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypingDetector = createTypingDetector;

var _container = __webpack_require__(69);

var _container2 = _interopRequireDefault(_container);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detects whether the user is typing in an input field and send typing events to the server.
 *
 * @example
 * <script>
 *  var typing = createTypingDetector(conversation);
 * </script>
 * <input type=text oninput="typing()" />
 *
 * @param {Conversation} conversation - send typing events to this conversation.
 * @param {Object} [options]
 * @param {number} [options.debounceTime = 3000] - interger of miliseconds to debounce calls
 * @return {function}
 */
function createTypingDetector(conversation) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$debounceTime = _ref.debounceTime,
      debounceTime = _ref$debounceTime === undefined ? 3000 : _ref$debounceTime;

  if (!(conversation instanceof _skygear2.default.Record && conversation.recordType === 'conversation')) {
    throw new Error('TypingDetector expects Conversation, instead got ' + conversation + '.');
  }
  var debounceTimer = null;
  function stopTyping() {
    _container2.default.sendTypingIndicator(conversation, 'finished');
    debounceTimer = null;
  }
  function startTyping() {
    _container2.default.sendTypingIndicator(conversation, 'begin');
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  function resetTimer() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  return function () {
    if (debounceTimer) {
      resetTimer();
    } else {
      startTyping();
    }
  };
}

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(120);
var v4 = __webpack_require__(121);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var rng = __webpack_require__(72);
var bytesToUuid = __webpack_require__(71);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(72);
var bytesToUuid = __webpack_require__(71);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 122 */,
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _TypingDetector = __webpack_require__(144);

var _TypingDetector2 = _interopRequireDefault(_TypingDetector);

var _ManagedMessageList = __webpack_require__(143);

var _ManagedMessageList2 = _interopRequireDefault(_ManagedMessageList);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _Message = __webpack_require__(128);

var _Message2 = _interopRequireDefault(_Message);

var _Conversation = __webpack_require__(134);

var _Conversation2 = _interopRequireDefault(_Conversation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Conversation = function (_React$Component) {
  _inherits(Conversation, _React$Component);

  function Conversation(props) {
    _classCallCheck(this, Conversation);

    var _this = _possibleConstructorReturn(this, (Conversation.__proto__ || Object.getPrototypeOf(Conversation)).call(this, props));

    var title = props.conversation.title;

    _this.state = {
      title: title || 'loading...', // conversation title (either group name or participant names)
      users: [], // array of users in this conversation
      typing: {} // map of userID => typing status (boolean)
    };
    _this.detectTyping = new _TypingDetector2.default(props.conversation);
    _this.messageList = new _ManagedMessageList2.default(props.conversation);
    return _this;
  }

  _createClass(Conversation, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // subscribe message change
      this.messageList.subscribe(function () {
        _this2.forceUpdate();
      });
      // subscribe to typing events
      _skygearChat2.default.subscribeTypingIndicator(this.props.conversation, this.typingEventHandler.bind(this));
      this.scrollToBottom();
      this.fetchUsers();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.scrollToBottom();
      if (this.props.conversation.updatedAt > prevProps.conversation.updatedAt) {
        this.fetchUsers();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.messageList.destroy();
      _skygearChat2.default.unsubscribeTypingIndicator(this.props.conversation);
    }
  }, {
    key: 'scrollToBottom',
    value: function scrollToBottom() {
      // wait for changes to propergate to real DOM
      setTimeout(function () {
        var messageView = document.getElementById('message-view');
        if (messageView) {
          messageView.scrollTop = messageView.scrollHeight;
        }
      }, 100);
    }
  }, {
    key: 'fetchUsers',
    value: function fetchUsers() {
      var _this3 = this;

      var _props$conversation = this.props.conversation,
          title = _props$conversation.title,
          participant_ids = _props$conversation.participant_ids;

      Promise.all(participant_ids.map(function (userID) {
        return _UserLoader2.default.get(userID);
      })).then(function (results) {
        var names = results.filter(function (u) {
          return u._id !== _skygear2.default.auth.currentUser.id;
        }).map(function (u) {
          return u.displayName;
        }).join(', ');
        if (names.length > 30) {
          names = names.substring(0, 27) + '...';
        }
        var typing = {};
        results.forEach(function (user) {
          typing[user._id] = false;
        });
        _this3.setState({
          title: title || names,
          users: results,
          typing: typing
        });
      });
    }
  }, {
    key: 'typingEventHandler',
    value: function typingEventHandler(event) {
      console.log('[typing event]', event);
      var typing = this.state.typing;

      for (var userID in event) {
        var _id = userID.split('/')[1];
        switch (event[userID].event) {
          case 'begin':
            typing[_id] = true;
            break;
          case 'finished':
            typing[_id] = false;
            break;
        }
      }
      this.setState({ typing: typing });
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(messageBody) {
      if (messageBody.length > 0) {
        var conversation = this.props.conversation;

        var message = new _skygear2.default.Record('message', {
          body: messageBody,
          metadata: {},
          conversation: new _skygear2.default.Reference(conversation.id),
          createdAt: new Date(),
          createdBy: _skygear2.default.auth.currentUser.id
        });
        this.messageList.add(message);
        _skygear2.default.publicDB.save(message).then(function () {
          // force update the conversation on new message to trigger pubsub event
          _skygearChat2.default.markAsRead([message]);
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          showDetails = _props.showDetails,
          participant_ids = _props.conversation.participant_ids,
          _state = this.state,
          title = _state.title,
          users = _state.users,
          typing = _state.typing,
          messageList = this.messageList;

      var currentUserID = _skygear2.default.auth.currentUser && _skygear2.default.auth.currentUser.id;

      return _react2.default.createElement(
        'div',
        {
          style: _Conversation2.default.container },
        _react2.default.createElement(
          'div',
          {
            style: _Conversation2.default.topPanel },
          _react2.default.createElement(
            'div',
            {
              style: _Conversation2.default.panelContent },
            _react2.default.createElement('span', null),
            _react2.default.createElement(
              'div',
              {
                style: _Conversation2.default.title },
              _react2.default.createElement(
                'strong',
                null,
                title
              ),
              ' (' + participant_ids.length + ' people)',
              ' ',
              _react2.default.createElement('br', null),
              _react2.default.createElement(
                'span',
                { style: { fontSize: '1rem' } },
                function () {
                  // FIXME: if the user have no displayname, it should
                  // appear someone is typing
                  var names = users.filter(function (u) {
                    return u._id !== currentUserID;
                  }).filter(function (u) {
                    return typing[u._id];
                  }).map(function (u) {
                    return u.displayName;
                  }).join(', ');
                  return names === '' ? '' : names + ' is typing...';
                }()
              )
            ),
            _react2.default.createElement('img', {
              style: _Conversation2.default.infoImg,
              onClick: showDetails,
              src: 'img/info.svg' })
          )
        ),
        _react2.default.createElement(
          'div',
          {
            id: 'message-view',
            style: _Conversation2.default.messageList },
          messageList.map(function (m) {
            return _react2.default.createElement(_Message2.default, {
              key: m.id + m.updatedAt,
              message: m });
          })
        ),
        _react2.default.createElement(
          'div',
          {
            style: _Conversation2.default.messageBox },
          _react2.default.createElement(
            'form',
            {
              style: _Conversation2.default.messageForm,
              onSubmit: function onSubmit(e) {
                e.preventDefault();
                _this4.sendMessage(e.target[0].value);
                e.target[0].value = '';
              } },
            _react2.default.createElement('input', {
              style: _Conversation2.default.messageInput,
              onChange: function onChange() {
                return _this4.detectTyping();
              },
              type: 'text' }),
            _react2.default.createElement('input', {
              style: _Conversation2.default.messageSubmit,
              value: 'Send',
              type: 'submit' })
          )
        )
      );
    }
  }]);

  return Conversation;
}(_react2.default.Component);

exports.default = Conversation;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _ConversationPreview = __webpack_require__(135);

var _ConversationPreview2 = _interopRequireDefault(_ConversationPreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConversationPreview = function (_React$Component) {
  _inherits(ConversationPreview, _React$Component);

  function ConversationPreview(props) {
    _classCallCheck(this, ConversationPreview);

    var _this = _possibleConstructorReturn(this, (ConversationPreview.__proto__ || Object.getPrototypeOf(ConversationPreview)).call(this, props));

    var title = props.conversation.title;

    _this.state = {
      title: title || 'loading...', // conversation title (either group name or participant names)
      imageURL: 'img/loading.svg' // conversation image URL
    };
    return _this;
  }

  _createClass(ConversationPreview, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props$conversation = this.props.conversation,
          title = _props$conversation.title,
          participant_ids = _props$conversation.participant_ids;
      // fetch users

      Promise.all(participant_ids.map(function (userID) {
        return _UserLoader2.default.get(userID);
      })).then(function (users) {
        if (users.length > 1) {
          users = users.filter(function (u) {
            return u._id !== _skygear2.default.auth.currentUser.id;
          });
        }
        var names = users.map(function (u) {
          return u.displayName;
        }).join(', ');
        if (names.length > 30) {
          names = names.substring(0, 27) + '...';
        }
        var avatar = 'img/avatar.svg';
        if (users[0]) {
          avatar = users[0].avatar ? users[0].avatar.url : 'img/avatar.svg';
        }
        _this2.setState({
          title: title || names,
          imageURL: avatar
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          selected = _props.selected,
          onClick = _props.onClick;
      var unread_count = this.props.conversation.unread_count;
      var _state = this.state,
          title = _state.title,
          imageURL = _state.imageURL;

      var lastMessage = this.props.conversation.$transient.last_message;

      return _react2.default.createElement(
        'div',
        {
          onClick: onClick,
          style: Object.assign({}, _ConversationPreview2.default.container, {
            backgroundColor: selected ? '#EEE' : '#FFF'
          }) },
        _react2.default.createElement('div', {
          style: Object.assign({}, _ConversationPreview2.default.conversationImg, {
            backgroundImage: 'url(' + imageURL + ')'
          }) }),
        _react2.default.createElement(
          'div',
          {
            style: _ConversationPreview2.default.conversationTitle },
          _react2.default.createElement(
            'h2',
            { style: _ConversationPreview2.default.title },
            title
          ),
          lastMessage && _react2.default.createElement(
            'span',
            {
              style: _ConversationPreview2.default.lastMessage },
            lastMessage.body.length > 23 ? lastMessage.body.substring(0, 20) + '...' : lastMessage.body
          )
        ),
        _react2.default.createElement(
          'span',
          null,
          unread_count > 0 ? '(' + unread_count + ')' : ''
        )
      );
    }
  }]);

  return ConversationPreview;
}(_react2.default.Component);

exports.default = ConversationPreview;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _Modal = __webpack_require__(20);

var _Modal2 = _interopRequireDefault(_Modal);

var _CreateChatModal = __webpack_require__(136);

var _CreateChatModal2 = _interopRequireDefault(_CreateChatModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateChatModal = function (_React$Component) {
  _inherits(CreateChatModal, _React$Component);

  function CreateChatModal(props) {
    _classCallCheck(this, CreateChatModal);

    var _this = _possibleConstructorReturn(this, (CreateChatModal.__proto__ || Object.getPrototypeOf(CreateChatModal)).call(this, props));

    _this.state = {
      loading: false,
      errorMessage: ''
    };
    return _this;
  }

  _createClass(CreateChatModal, [{
    key: 'discoverUserAndCreateChat',
    value: function discoverUserAndCreateChat(username) {
      var _this2 = this;

      this.setState({ loading: true });
      _UserLoader2.default.getUsersByUsernames([username]).then(function (users) {
        if (users.length <= 0) {
          return Promise.reject({ message: 'user "' + username + '" not found' });
        }
        return _skygearChat2.default.createDirectConversation(users[0], null);
      }).then(function (conversation) {
        // close modal after creation
        _this2.props.onClose();
        _this2.props.addConversationDelegate(conversation);
      }).catch(function (err) {
        _this2.setState({
          loading: false,
          errorMessage: 'Error: ' + err.message
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var onClose = this.props.onClose,
          _state = this.state,
          loading = _state.loading,
          errorMessage = _state.errorMessage;

      return _react2.default.createElement(
        _Modal2.default,
        {
          header: 'Create Direct Chat',
          onClose: onClose },
        _react2.default.createElement(
          'form',
          {
            onSubmit: function onSubmit(e) {
              e.preventDefault();
              _this3.discoverUserAndCreateChat(e.target[0].value);
            },
            style: _CreateChatModal2.default.formContainer },
          _react2.default.createElement(
            'label',
            null,
            'Username'
          ),
          _react2.default.createElement('input', {
            disabled: loading,
            type: 'text' }),
          _react2.default.createElement(
            'p',
            null,
            errorMessage
          ),
          _react2.default.createElement(
            'div',
            { style: _CreateChatModal2.default.buttonContainer },
            _react2.default.createElement('input', {
              style: _CreateChatModal2.default.startButton,
              disabled: loading,
              type: 'submit',
              value: 'Start' })
          )
        )
      );
    }
  }]);

  return CreateChatModal;
}(_react2.default.Component);

exports.default = CreateChatModal;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _Modal = __webpack_require__(20);

var _Modal2 = _interopRequireDefault(_Modal);

var _CreateGroupModal = __webpack_require__(137);

var _CreateGroupModal2 = _interopRequireDefault(_CreateGroupModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateGroupModal = function (_React$Component) {
  _inherits(CreateGroupModal, _React$Component);

  function CreateGroupModal(props) {
    _classCallCheck(this, CreateGroupModal);

    var _this = _possibleConstructorReturn(this, (CreateGroupModal.__proto__ || Object.getPrototypeOf(CreateGroupModal)).call(this, props));

    _this.state = {
      loading: false, // modal loading state (boolean)
      errorMessage: '', // error message to display (or '')
      members: [], // list of members (users) to add to the new group
      groupName: '' // group name input text
    };
    return _this;
  }

  _createClass(CreateGroupModal, [{
    key: 'discoverUser',
    value: function discoverUser(username) {
      var _this2 = this;

      this.setState({ loading: true });
      _UserLoader2.default.getUsersByUsernames([username]).then(function (users) {
        if (users.length <= 0) {
          return Promise.reject({ message: 'user "' + username + '" not found' });
        }
        var members = _this2.state.members;

        if (members.filter(function (u) {
          return u.id === users[0].id;
        }).length > 0) {
          return Promise.reject({
            message: 'Error: user "' + username + '" already added'
          });
        }
        members.push(users[0]);
        _this2.setState({
          loading: false,
          errorMessage: '',
          members: members
        });
      }).catch(function (err) {
        _this2.setState({
          loading: false,
          errorMessage: 'Error: ' + err.message
        });
      });
    }
  }, {
    key: 'createGroup',
    value: function createGroup() {
      var _this3 = this;

      var _state = this.state,
          members = _state.members,
          groupName = _state.groupName;

      if (groupName === '') {
        this.setState({ errorMessage: 'Error: missing group name' });
        return;
      }
      if (members.length < 2) {
        this.setState({
          errorMessage: 'Error: groups must have 3 or more participants'
        });
        return;
      }
      this.setState({ loading: true });
      _skygearChat2.default.createConversation(members, groupName).then(function (conversation) {
        // close modal after creation
        _this3.props.onClose();
        _this3.props.addConversationDelegate(conversation);
      }).catch(function (err) {
        _this3.setState({
          loading: false,
          errorMessage: 'Error: ' + err.message
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var onClose = this.props.onClose,
          _state2 = this.state,
          loading = _state2.loading,
          errorMessage = _state2.errorMessage,
          groupName = _state2.groupName,
          members = _state2.members;


      return _react2.default.createElement(
        _Modal2.default,
        {
          header: 'Create Group Chat',
          onClose: onClose },
        _react2.default.createElement(
          'div',
          {
            style: _CreateGroupModal2.default.container },
          _react2.default.createElement(
            'strong',
            { style: _CreateGroupModal2.default.label },
            'Name:'
          ),
          _react2.default.createElement('input', {
            type: 'text',
            disabled: loading,
            value: groupName,
            onChange: function onChange(e) {
              return _this4.setState({ groupName: e.target.value });
            } }),
          _react2.default.createElement(
            'strong',
            { style: _CreateGroupModal2.default.label },
            'Participants:'
          ),
          members.map(function (user) {
            return _react2.default.createElement(
              'div',
              {
                key: user.id,
                style: _CreateGroupModal2.default.member },
              _react2.default.createElement('div', {
                style: Object.assign({}, _CreateGroupModal2.default.avatar, {
                  backgroundImage: 'url(' + (user.avatar ? user.avatar.url : 'img/avatar.svg') + ')'
                }) }),
              _react2.default.createElement(
                'span',
                null,
                user.displayName
              )
            );
          }),
          _react2.default.createElement(
            'form',
            {
              onSubmit: function onSubmit(e) {
                e.preventDefault();
                _this4.discoverUser(e.target[1].value);
              },
              style: _CreateGroupModal2.default.formContainer },
            _react2.default.createElement('input', {
              type: 'submit',
              value: '+',
              disabled: loading,
              style: _CreateGroupModal2.default.addButton
            }),
            _react2.default.createElement('input', {
              type: 'text',
              disabled: loading,
              style: _CreateGroupModal2.default.usernameInput
            })
          ),
          _react2.default.createElement(
            'p',
            null,
            errorMessage
          ),
          _react2.default.createElement(
            'div',
            {
              style: _CreateGroupModal2.default.buttonContainer },
            _react2.default.createElement(
              'button',
              {
                style: _CreateGroupModal2.default.createButton,
                disabled: loading,
                onClick: function onClick() {
                  return _this4.createGroup();
                } },
              'Create Group'
            )
          )
        )
      );
    }
  }]);

  return CreateGroupModal;
}(_react2.default.Component);

exports.default = CreateGroupModal;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _Modal = __webpack_require__(20);

var _Modal2 = _interopRequireDefault(_Modal);

var _DetailsModal = __webpack_require__(138);

var _DetailsModal2 = _interopRequireDefault(_DetailsModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailsModal = function (_React$Component) {
  _inherits(DetailsModal, _React$Component);

  function DetailsModal(props) {
    _classCallCheck(this, DetailsModal);

    var _this = _possibleConstructorReturn(this, (DetailsModal.__proto__ || Object.getPrototypeOf(DetailsModal)).call(this, props));

    _this.state = {
      loading: false, // modal loading state (boolean)
      editingTitle: false, // conversation name editing state (boolean)
      newConversationTitle: '', // new conversation title (text input value)
      errorMessage: '', // error message to display
      users: [] // conversation users
    };
    return _this;
  }

  _createClass(DetailsModal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchUsers();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.conversation.updatedAt > prevProps.conversation.updatedAt) {
        this.fetchUsers();
      }
    }
  }, {
    key: 'fetchUsers',
    value: function fetchUsers() {
      var _this2 = this;

      var conversation = this.props.conversation;

      this.setState({ loading: true });
      Promise.all(conversation.participant_ids.map(function (userID) {
        return _UserLoader2.default.get(userID);
      })).then(function (users) {
        _this2.setState({
          users: users,
          loading: false
        });
      });
    }
  }, {
    key: 'editTitle',
    value: function editTitle() {
      var title = this.props.conversation.title;

      this.setState({
        newConversationTitle: title,
        editingTitle: true
      });
    }
  }, {
    key: 'changeTitle',
    value: function changeTitle() {
      var _this3 = this;

      var _props = this.props,
          conversation = _props.conversation,
          updateConversationDelegate = _props.updateConversationDelegate,
          newConversationTitle = this.state.newConversationTitle;

      this.setState({ loading: true });
      _skygearChat2.default.updateConversation(conversation, newConversationTitle).then(function (newConversation) {
        _this3.setState({
          loading: false,
          editingTitle: false
        });
        updateConversationDelegate(newConversation);
      });
    }
  }, {
    key: 'leaveConversation',
    value: function leaveConversation() {
      var _props2 = this.props,
          onClose = _props2.onClose,
          conversation = _props2.conversation,
          removeConversationDelegate = _props2.removeConversationDelegate;

      this.setState({ loading: true });
      _skygearChat2.default.leaveConversation(conversation).then(function () {
        // close modal after leaving
        onClose();
        removeConversationDelegate(conversation);
      });
    }
  }, {
    key: 'discoverAndAddUser',
    value: function discoverAndAddUser(username) {
      var _this4 = this;

      var _props3 = this.props,
          conversation = _props3.conversation,
          updateConversationDelegate = _props3.updateConversationDelegate,
          users = this.state.users;

      this.setState({ loading: true });
      _UserLoader2.default.getUsersByUsernames([username]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            newUser = _ref2[0];

        if (!newUser) {
          return Promise.reject({ message: 'user "' + username + '" not found' });
        }
        if (users.filter(function (u) {
          return u.id === newUser.id;
        }).length > 0) {
          return Promise.reject({ message: 'user "' + username + '" already added' });
        }
        return _skygearChat2.default.addParticipants(conversation, [newUser]).then(function () {
          return _skygearChat2.default.addAdmins(conversation, [newUser]);
        });
      }).then(function (newConversation) {
        _this4.setState({ loading: false });
        updateConversationDelegate(newConversation);
      }).catch(function (err) {
        _this4.setState({
          loading: false,
          errorMessage: 'Error: ' + err.message
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props4 = this.props,
          _props4$conversation = _props4.conversation,
          conversationTitle = _props4$conversation.title,
          directChat = _props4$conversation.distinct_by_participants,
          onClose = _props4.onClose,
          _state = this.state,
          loading = _state.loading,
          editingTitle = _state.editingTitle,
          newConversationTitle = _state.newConversationTitle,
          errorMessage = _state.errorMessage,
          users = _state.users;


      return _react2.default.createElement(
        _Modal2.default,
        {
          header: 'Details',
          onClose: onClose },
        _react2.default.createElement(
          'div',
          {
            style: _DetailsModal2.default.container },
          _react2.default.createElement(
            'strong',
            { style: _DetailsModal2.default.conversationName },
            'Conversation Name:'
          ),
          editingTitle ? _react2.default.createElement(
            'div',
            {
              style: _DetailsModal2.default.conversationTitle },
            _react2.default.createElement('input', {
              type: 'text',
              disabled: loading,
              value: newConversationTitle,
              onChange: function onChange(e) {
                _this5.setState({ newConversationTitle: e.target.value });
              } }),
            _react2.default.createElement(
              'span',
              {
                style: _DetailsModal2.default.editCancel,
                onClick: function onClick() {
                  return _this5.setState({ editingTitle: false });
                } },
              '\u2715'
            ),
            _react2.default.createElement(
              'span',
              {
                style: _DetailsModal2.default.editConfirm,
                onClick: function onClick() {
                  return _this5.changeTitle();
                } },
              '\u2713'
            )
          ) : _react2.default.createElement(
            'div',
            {
              style: _DetailsModal2.default.conversationTitle },
            _react2.default.createElement(
              'span',
              null,
              conversationTitle || 'Not set.'
            ),
            _react2.default.createElement('img', {
              src: 'img/edit.svg',
              style: _DetailsModal2.default.editStart,
              onClick: function onClick() {
                return _this5.editTitle();
              } })
          ),
          _react2.default.createElement(
            'strong',
            { style: { margin: '2rem 0 0.5rem' } },
            'Participants:'
          ),
          loading && _react2.default.createElement(
            'p',
            null,
            'loading...'
          ),
          users.map(function (u) {
            return _react2.default.createElement(
              'div',
              {
                key: u.id,
                style: _DetailsModal2.default.participant },
              _react2.default.createElement('div', {
                style: Object.assign({}, _DetailsModal2.default.participantImage, { backgroundImage: 'url(' + (u.avatar ? u.avatar.url : 'img/avatar.svg') + ')' }) }),
              _react2.default.createElement(
                'span',
                { style: _DetailsModal2.default.participantName },
                u.displayName
              )
            );
          }),
          !directChat && _react2.default.createElement(
            'form',
            {
              onSubmit: function onSubmit(e) {
                e.preventDefault();
                _this5.discoverAndAddUser(e.target[1].value);
              },
              style: _DetailsModal2.default.participant },
            _react2.default.createElement('input', {
              type: 'submit',
              value: '+',
              disabled: loading,
              style: _DetailsModal2.default.addParticipant }),
            _react2.default.createElement('input', {
              type: 'text',
              disabled: loading,
              style: _DetailsModal2.default.addParticipantname })
          ),
          _react2.default.createElement(
            'p',
            null,
            errorMessage
          ),
          !directChat && _react2.default.createElement(
            'div',
            {
              style: _DetailsModal2.default.leaveConversation },
            _react2.default.createElement(
              'button',
              {
                style: _DetailsModal2.default.leaveButton,
                disabled: loading,
                onClick: function onClick() {
                  return _this5.leaveConversation();
                } },
              'Leave Chat'
            )
          )
        )
      );
    }
  }]);

  return DetailsModal;
}(_react2.default.Component);

exports.default = DetailsModal;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _UserLoader = __webpack_require__(21);

var _UserLoader2 = _interopRequireDefault(_UserLoader);

var _Message = __webpack_require__(139);

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message(props) {
    _classCallCheck(this, Message);

    var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, props));

    _this.state = {
      user: null // the user this message belongs to
    };
    return _this;
  }

  _createClass(Message, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      _UserLoader2.default.get(this.props.message.createdBy).then(function (user) {
        _this2.setState({ user: user });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var message = this.props.message,
          user = this.state.user;

      var currentUserID = _skygear2.default.currentUser && _skygear2.default.currentUser.id;

      if (!user) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        {
          style: Object.assign({}, _Message2.default.container, { justifyContent: user._id === currentUserID ? 'flex-end' : 'flex-start' }) },
        _react2.default.createElement('div', {
          style: Object.assign({}, _Message2.default.avatar, { backgroundImage: 'url(' + (user.avatar ? user.avatar.url : 'img/avatar.svg') + ')' }) }),
        _react2.default.createElement(
          'div',
          {
            style: _Message2.default.messageBody },
          message.body
        )
      );
    }
  }]);

  return Message;
}(_react2.default.Component);

exports.default = Message;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _Modal = __webpack_require__(20);

var _Modal2 = _interopRequireDefault(_Modal);

var _SettingsModal = __webpack_require__(141);

var _SettingsModal2 = _interopRequireDefault(_SettingsModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsModal = function (_React$Component) {
  _inherits(SettingsModal, _React$Component);

  function SettingsModal(props) {
    _classCallCheck(this, SettingsModal);

    var _this = _possibleConstructorReturn(this, (SettingsModal.__proto__ || Object.getPrototypeOf(SettingsModal)).call(this, props));

    _this.state = {
      displayName: '', // user display name
      newDisplayName: '', // new user display name (text input value)
      avatarURL: '', // user avatar URL
      editingName: false, // display name editing state
      loading: true // modal loading state
    };
    return _this;
  }

  _createClass(SettingsModal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // fetch user profile
      _skygear2.default.publicDB.query(new _skygear2.default.Query(_skygear2.default.UserRecord).equalTo('_id', _skygear2.default.auth.currentUser.id)).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            user = _ref2[0];

        _this2.setState({
          loading: false,
          displayName: user.displayName,
          avatarURL: user.avatar ? user.avatar.url : 'img/avatar.svg'
        });
      });
    }
  }, {
    key: 'changeAvatar',
    value: function changeAvatar(imageFile) {
      var _this3 = this;

      this.setState({ loading: true });
      _skygear2.default.publicDB.save(new _skygear2.default.UserRecord({
        _id: 'user/' + _skygear2.default.auth.currentUser.id,
        avatar: new _skygear2.default.Asset({
          name: imageFile.name,
          file: imageFile
        })
      })).then(function (_ref3) {
        var avatar = _ref3.avatar;

        _this3.setState({
          loading: false,
          avatarURL: avatar.url
        });
      });
    }
  }, {
    key: 'changeName',
    value: function changeName() {
      var _this4 = this;

      var newDisplayName = this.state.newDisplayName;

      this.setState({ loading: true });
      _skygear2.default.publicDB.save(new _skygear2.default.UserRecord({
        _id: 'user/' + _skygear2.default.auth.currentUser.id,
        displayName: newDisplayName
      })).then(function () {
        _this4.setState({
          loading: false,
          displayName: newDisplayName,
          editingName: false
        });
      });
    }
  }, {
    key: 'editName',
    value: function editName() {
      var displayName = this.state.displayName;

      this.setState({
        newDisplayName: displayName,
        editingName: true
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this5 = this;

      this.setState({ loading: true });
      _skygear2.default.auth.logout().then(function () {
        _this5.setState({ loading: false });
        window.location.href = 'login.html';
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var onClose = this.props.onClose,
          _state = this.state,
          avatarURL = _state.avatarURL,
          displayName = _state.displayName,
          newDisplayName = _state.newDisplayName,
          editingName = _state.editingName,
          loading = _state.loading;


      var currentUsername = _skygear2.default.auth.currentUser && _skygear2.default.auth.currentUser.username;

      return _react2.default.createElement(
        _Modal2.default,
        {
          header: 'Settings',
          onClose: onClose },
        _react2.default.createElement(
          'div',
          {
            style: _SettingsModal2.default.container },
          _react2.default.createElement(
            'label',
            {
              style: {} },
            _react2.default.createElement('input', {
              type: 'file',
              accept: 'image/jpeg,image/png',
              disabled: loading,
              onChange: function onChange(e) {
                return _this6.changeAvatar(e.target.files[0]);
              },
              style: { display: 'none' } }),
            _react2.default.createElement('div', {
              style: Object.assign({}, _SettingsModal2.default.avatarImg, {
                backgroundImage: 'url(' + (loading ? 'img/loading.svg' : avatarURL) + ')'
              }) }),
            _react2.default.createElement(
              'span',
              {
                style: _SettingsModal2.default.avatarEdit },
              'edit'
            )
          ),
          _react2.default.createElement(
            'div',
            {
              style: _SettingsModal2.default.centerAlign },
            _react2.default.createElement(
              'strong',
              null,
              'Username: '
            ),
            _react2.default.createElement(
              'span',
              null,
              currentUsername
            )
          ),
          editingName ? _react2.default.createElement(
            'div',
            {
              style: _SettingsModal2.default.centerAlign },
            _react2.default.createElement('input', {
              type: 'text',
              disabled: loading,
              value: newDisplayName,
              onChange: function onChange(e) {
                _this6.setState({ newDisplayName: e.target.value });
              } }),
            _react2.default.createElement(
              'span',
              {
                style: _SettingsModal2.default.editCancel,
                onClick: function onClick() {
                  return _this6.setState({ editingName: false });
                } },
              '\u2715'
            ),
            _react2.default.createElement(
              'span',
              {
                style: _SettingsModal2.default.editConfirm,
                onClick: function onClick() {
                  return _this6.changeName();
                } },
              '\u2713'
            )
          ) : _react2.default.createElement(
            'div',
            {
              style: _SettingsModal2.default.centerAlign },
            _react2.default.createElement(
              'strong',
              null,
              'Name: '
            ),
            _react2.default.createElement(
              'span',
              null,
              displayName
            ),
            _react2.default.createElement('img', {
              src: 'img/edit.svg',
              style: _SettingsModal2.default.editStart,
              onClick: function onClick() {
                return _this6.editName();
              } })
          )
        ),
        _react2.default.createElement(
          'div',
          {
            style: _SettingsModal2.default.logoutContainer },
          _react2.default.createElement(
            'button',
            {
              style: _SettingsModal2.default.logoutButton,
              onClick: function onClick() {
                return _this6.logout();
              } },
            'Logout'
          )
        )
      );
    }
  }]);

  return SettingsModal;
}(_react2.default.Component);

exports.default = SettingsModal;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28);

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(27);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _config = __webpack_require__(26);

var _config2 = _interopRequireDefault(_config);

var _App = __webpack_require__(116);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_skygear2.default.config(_config2.default.skygearConfig).then(function () {
  // redirect to login page if not logged-in
  if (!_skygear2.default.auth.currentUser) {
    window.location.href = 'login.html';
  } else {
    var root = document.createElement('div');
    document.body.appendChild(root);
    _reactDom2.default.render(_react2.default.createElement(_App2.default, null), root);
  }
});

/***/ }),
/* 131 */,
/* 132 */,
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowX: 'scroll'
  },

  leftPanel: {
    height: '100%',
    width: '25%',
    minWidth: '400px',
    borderRight: '1px solid #888',
    display: 'flex',
    flexDirection: 'column'
  },

  settingPanel: {
    height: '2rem',
    minHeight: '2rem',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #888'
  },

  settingImg: {
    cursor: 'pointer',
    height: '2rem'
  },

  creationPanel: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #888',
    height: '4rem',
    minHeight: '4rem'
  },

  conversationContainer: {
    overflowY: 'scroll'
  },

  addButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  }

};

exports.default = Styles;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '75%',
    height: '100%'
  },

  topPanel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '6rem',
    borderBottom: '1px solid #000'
  },

  title: {
    textAlign: 'center',
    fontSize: '1.5rem'
  },

  panelContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },

  infoImg: {
    height: '2rem',
    cursor: 'pointer',
    marginRight: '2rem'
  },

  messageList: {
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll'
  },

  messageBox: {
    width: '100%',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #000'
  },

  messageForm: {
    width: '100%',
    margin: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  messageInput: {
    padding: '0.25rem',
    fontSize: '1rem',
    width: '100%'
  },

  messageSubmit: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '0.5rem 1rem',
    marginLeft: '1rem'
  }

};

exports.default = Styles;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #DDD',
    cursor: 'pointer'
  },

  conversationImg: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '3rem',
    height: '3rem'
  },

  conversationTitle: {
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    width: '70%'
  },

  title: {
    margin: '0'
  },

  lastMessage: {
    marginTop: '0.5rem',
    color: '#AAA'
  }
};

exports.default = Styles;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '21rem',
    padding: '3rem 3rem 1rem'
  },

  buttonContainer: {
    alignSelf: 'flex-end'
  },

  startButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '0.5rem 1rem'
  }
};

exports.default = Styles;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '25rem',
    padding: '1rem'
  },

  label: {
    margin: '2rem 0 0.5rem'
  },

  member: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5rem 0'
  },

  avatar: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '3rem',
    height: '3rem',
    marginRight: '1rem'
  },

  formContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5rem 0'
  },

  addButton: {
    border: '1px solid #000',
    borderRadius: '100%',
    minWidth: '3rem',
    width: '3rem',
    height: '3rem',
    fontSize: '2rem',
    backgroundColor: '#FFF',
    cursor: 'pointer'
  },

  usernameInput: {
    marginLeft: '1rem',
    width: '100%'
  },

  buttonContainer: {
    alignSelf: 'center',
    marginTop: '2rem'
  },

  createButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  }

};

exports.default = Styles;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '21rem',
    padding: '1rem'
  },

  conversationName: {
    margin: '2rem 0 0.5rem'
  },

  conversationTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem'
  },

  editStart: {
    marginLeft: '1rem',
    height: '1rem',
    cursor: 'pointer'
  },

  editCancel: {
    cursor: 'pointer',
    fontSize: '1.3rem'
  },

  editConfirm: {
    cursor: 'pointer',
    fontSize: '1.5rem'
  },

  participant: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5rem 0'
  },

  participantImage: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '3rem',
    height: '3rem'
  },

  participantName: {
    marginLeft: '1rem'
  },

  addParticipant: {
    border: '1px solid #000',
    borderRadius: '100%',
    minWidth: '3rem',
    width: '3rem',
    height: '3rem',
    fontSize: '2rem',
    backgroundColor: '#FFF',
    cursor: 'pointer'
  },

  addParticipantName: {
    marginLeft: '1rem',
    width: '100%'
  },

  leaveConversation: {
    alignSelf: 'center',
    marginTop: '2rem'
  },

  leaveButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  }

};

exports.default = Styles;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  avatar: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '2rem',
    height: '2rem',
    marginLeft: '1rem'
  },

  messageBody: {
    margin: '1rem',
    padding: '0.5rem',
    border: '1px solid #000',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  }
};
exports.default = Styles;

/***/ }),
/* 140 */,
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem 0',
    width: '18rem'
  },

  avatarLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  avatarImg: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    width: '5rem',
    height: '5rem'
  },

  avatarEdit: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },

  centerAlign: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem'
  },

  editStart: {
    marginLeft: '1rem',
    height: '1rem',
    cursor: 'pointer'
  },

  editCancel: {
    cursor: 'pointer',
    fontSize: '1.3rem'
  },

  editConfirm: {
    cursor: 'pointer',
    fontSize: '1.5rem'
  },

  logoutContainer: {
    width: '100%',
    textAlign: 'center'
  },

  logoutButton: {
    background: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem'
  }
};

exports.default = Styles;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConversationSorting = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Convenience class to create Conversation compare functions for sorting.
 * It's just a regular compare function that expects 2 Conversation records.
 *
 * @example
 * new ConversationSorting('title','ascending')
 * => function(a,b) { ... }
 */
var ConversationSorting =
/**
 * @param {string} attribute
 * The attribute to sort by, currently supports: 'title', 'last update',
 * 'create time' and 'participant count'.
 * @param {string} order
 * Sorting order, expects either 'ascending' or 'descending'.
 */
exports.ConversationSorting = function ConversationSorting(attribute, order) {
  _classCallCheck(this, ConversationSorting);

  var attributeMap = {
    title: function title(c) {
      return c.title || '';
    },
    'last update': function lastUpdate(c) {
      return c.updatedAt;
    },
    'create time': function createTime(c) {
      return c.createdAt;
    },
    'participant count': function participantCount(c) {
      return c.participant_count;
    }
  };
  var orderMap = {
    ascending: true,
    descending: false
  };
  if (!(attributeMap.hasOwnProperty(attribute) && orderMap.hasOwnProperty(order))) {
    throw new Error('invalid conversation sorting parameters: ' + attribute + ' ' + order);
  }
  return function (a, b) {
    var aValue = attributeMap[attribute](a);
    var bValue = attributeMap[attribute](b);
    var sortAscending = orderMap[order];
    if (aValue > bValue) {
      return sortAscending ? 1 : -1;
    }
    if (aValue < bValue) {
      return sortAscending ? -1 : 1;
    }
    return 0;
  };
};

/**
 * A managed list of conversations for the current user.
 * Note: You must be logged in at skygear to use this.
 */


var ManagedConversationList = function () {
  /**
   * @param {object} [options={}]
   * @param {boolean} [options.initialFetch=true]
   * Automatically fetch list of conversations on creation.
   * @param {boolean} [options.pubsubSync=true]
   * Keep list synchronized with server using PubSub.
   * @param {function} [options.sortBy=new ConversationSorting('last update',descending')]
   * How the list is sorted, you can use ConversationSorting wrapper
   * to create one or provide your own.
   */
  function ManagedConversationList() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$initialFetch = _ref.initialFetch,
        initialFetch = _ref$initialFetch === undefined ? true : _ref$initialFetch,
        _ref$pubsubSync = _ref.pubsubSync,
        pubsubSync = _ref$pubsubSync === undefined ? true : _ref$pubsubSync,
        _ref$sortBy = _ref.sortBy,
        sortBy = _ref$sortBy === undefined ? new ConversationSorting('last update', 'descending') : _ref$sortBy;

    _classCallCheck(this, ManagedConversationList);

    // conversation compare fn (for sorting)
    this._compare = sortBy;
    // conversation IDs in order (without type prefix)
    this._orderedIDs = [];
    // map of conversaton ID => conversation object
    this._conversations = {};
    // map of subscription ID => event handler
    this._updateHandlers = {};

    if (initialFetch) {
      this.fetch();
    }
    if (pubsubSync) {
      _skygearChat2.default.subscribe(this._eventHandler.bind(this));
    }
  }
  /**
   * If you used pubsubSync, you must call this function when the list
   * is no longer needed to prevent a memory leak.
   */


  _createClass(ManagedConversationList, [{
    key: 'destroy',
    value: function destroy() {
      _skygearChat2.default.unsubscribe(this._eventHandler);
    }
    /**
     * @private
     */

  }, {
    key: '_eventHandler',
    value: function _eventHandler(event) {
      if (event.record_type === 'conversation') {
        console.log('[conversation event]', event);
        switch (event.event_type) {
          case 'create':
            this.addConversation(event.record);
            break;
          case 'update':
            this.updateConversation(event.record);
            break;
          case 'delete':
            this.removeConversation(event.record);
            break;
        }
      }
    }
    /**
     * @private
     */

  }, {
    key: '_conversationsUpdated',
    value: function _conversationsUpdated() {
      var _this = this;

      var _conversations = this._conversations,
          _compare = this._compare,
          _updateHandlers = this._updateHandlers;

      this._orderedIDs = Object.keys(_conversations).map(function (id) {
        return _conversations[id];
      }).sort(_compare).map(function (conversation) {
        return conversation._id;
      });
      Object.keys(_updateHandlers).map(function (key) {
        return _updateHandlers[key];
      }).forEach(function (handler) {
        return handler(_this);
      });
    }
    /**
     * Fetches list of conversations from the server.
     * @return {Promise<ManagedConversationList>}
     * Promise of this object, resolves if the fetch is successful.
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      return _skygearChat2.default.getConversations().then(function (results) {
        console.log('[fetched conversations]', results);
        results.forEach(function (c) {
          _this2._conversations[c._id] = c;
        });
        _this2._conversationsUpdated();
        return _this2;
      });
    }
    /**
     * Update conversations from the server by providing a conversation
     * @param {Conversation} conversation
     * @return {ManagedConversationList}
     */

  }, {
    key: 'updateOne',
    value: function updateOne(conversation) {
      var _this3 = this;

      var _conversations = this._conversations;

      _skygearChat2.default.getConversation(conversation._id).then(function (c) {
        _conversations[c._id] = c;
        _this3._conversationsUpdated();
      });
      return this;
    }
    /**
     * List length (like the array length property)
     * @type {number}
     */

  }, {
    key: 'get',

    /**
     * Get a Conversation
     * @param {number|string} indexOrID
     * Either the list index (number) or conversation ID (string) without type prefix.
     * @return {Conversation}
     */
    value: function get(indexOrID) {
      var _conversations = this._conversations,
          _orderedIDs = this._orderedIDs;

      if (typeof indexOrID === 'number') {
        return _conversations[_orderedIDs[indexOrID]];
      } else {
        return _conversations[indexOrID];
      }
    }
    /**
     * List mapping method (like the array map method)
     * @param {function} mappingFunction
     * @return {Array}
     */

  }, {
    key: 'map',
    value: function map(mappingFunction) {
      var _this4 = this;

      return this._orderedIDs.map(function (id) {
        return _this4._conversations[id];
      }).map(mappingFunction);
    }
    /**
     * List filter method (like the array filter method)
     * @param {function} predicate
     * @return {Array}
     */

  }, {
    key: 'filter',
    value: function filter(predicate) {
      var _this5 = this;

      return this._orderedIDs.map(function (id) {
        return _this5._conversations[id];
      }).filter(predicate);
    }
    /**
     * Add a conversation, no-op if the conversation already exists.
     * @param {Conversation} conversation
     * @return {ManagedConversationList}
     */

  }, {
    key: 'addConversation',
    value: function addConversation(conversation) {
      var _conversations = this._conversations;

      if (_conversations.hasOwnProperty(conversation._id)) {
        return this;
      }
      return this.updateOne(conversation);
    }
    /**
     * Update a conversation, no-op if the conversation updatedAt date is older than existing.
     * Conversation will be added if it's not in the list.
     * @param {Conversation} conversation
     * @return {ManagedConversationList}
     */

  }, {
    key: 'updateConversation',
    value: function updateConversation(conversation) {
      var _conversations = this._conversations;

      if (_conversations.hasOwnProperty(conversation._id)) {
        return this.updateOne(conversation);
      } else {
        this.addConversation(conversation);
      }
      return this;
    }
    /**
     * Remove a conversation, no-op if the conversation doesn't exist.
     * @param {conversation} conversation Conversation without type prefix.
     * @return {ManagedConversationList}
     */

  }, {
    key: 'removeConversation',
    value: function removeConversation(conversation) {
      var _conversations = this._conversations;

      delete _conversations[conversation._id];
      this._conversationsUpdated();
      return this;
    }
    /**
     * Subscribe to list updates, handler will be called with one argument: this object.
     * @param {function} handler
     * @return {number} Subscription ID
     */

  }, {
    key: 'subscribe',
    value: function subscribe(handler) {
      var _updateHandlers = this._updateHandlers;

      var subID = Object.keys(_updateHandlers).length;
      _updateHandlers[subID] = handler;
      return subID;
    }
    /**
     * Cancel a subscription.
     * @param {number} subID The subscription ID returned by the subscribe function.
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(subID) {
      delete this._updateHandlers[subID];
    }
  }, {
    key: 'length',
    get: function get() {
      return this._orderedIDs.length;
    }
  }]);

  return ManagedConversationList;
}();

exports.default = ManagedConversationList;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A managed list of messages for the specified conversation.
 */
var ManagedMessageList = function () {
  /**
   * @param {Conversation} conversation
   * @param {object} [options={}]
   * @param {number|boolean} [options.initialFetch=50]
   * Fetch messages on creation, provide limit of messages to fetch or false to disable.
   * @param {boolean} [options.pubsubSync=true]
   * Keep list synchronized with server using PubSub.
   * @param {boolean} [options.autoRead=true]
   * Automatically mark all recieved messages as read.
   */
  function ManagedMessageList(conversation) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$initialFetch = _ref.initialFetch,
        initialFetch = _ref$initialFetch === undefined ? 50 : _ref$initialFetch,
        _ref$pubsubSync = _ref.pubsubSync,
        pubsubSync = _ref$pubsubSync === undefined ? true : _ref$pubsubSync,
        _ref$autoRead = _ref.autoRead,
        autoRead = _ref$autoRead === undefined ? true : _ref$autoRead;

    _classCallCheck(this, ManagedMessageList);

    this._conversation = conversation;
    this._autoRead = autoRead;
    // message IDs in order (without type prefix)
    this._orderedIDs = [];
    // map of message ID => message object
    this._messages = {};
    // map of subscription ID => event handler
    this._updateHandlers = {};

    if (initialFetch) {
      this.fetch(initialFetch);
    }
    if (pubsubSync) {
      _skygearChat2.default.subscribe(this._eventHandler.bind(this));
    }
  }
  /**
   * If you used pubsubSync, you must call this function when the list
   * is no longer needed to prevent a memory leak.
   */


  _createClass(ManagedMessageList, [{
    key: 'destroy',
    value: function destroy() {
      _skygearChat2.default.unsubscribe(this._eventHandler);
    }
    /**
     * @private
     */

  }, {
    key: '_eventHandler',
    value: function _eventHandler(event) {
      if (event.record_type === 'message' && event.record.conversation.id === this._conversation.id) {
        console.log('[message event]', event);
        switch (event.event_type) {
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
    /**
     * @private
     */

  }, {
    key: '_messagesUpdated',
    value: function _messagesUpdated() {
      var _this = this;

      var _messages = this._messages,
          _updateHandlers = this._updateHandlers;

      this._orderedIDs = Object.keys(_messages).map(function (id) {
        return _messages[id];
      }).sort(function (a, b) {
        return a.createdAt - b.createdAt;
      }).map(function (message) {
        return message._id;
      });
      Object.keys(_updateHandlers).map(function (key) {
        return _updateHandlers[key];
      }).forEach(function (handler) {
        return handler(_this);
      });
    }
    /**
     * Fetches list of conversations from the server.
     * @param {number} [resultLimit=50]
     * Limit of the number of messages to fetch.
     * @return {Promise<ManagedMessageList>}
     * Promise of this object, resolves if the fetch is successful.
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      var resultLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

      return _skygearChat2.default.getMessages(this._conversation, resultLimit).then(function (results) {
        console.log('[fetched messages]', results);
        results.forEach(function (message) {
          _this2._messages[message._id] = message;
        });
        if (_this2._autoRead && results && results.length > 0) {
          _skygearChat2.default.markAsRead([results[0]]);
        }
        _this2._messagesUpdated();
        return _this2;
      });
    }
    /**
     * List length (like the array length property)
     * @type {number}
     */

  }, {
    key: 'get',

    /**
     * Get a Message
     * @param {number|string} indexOrID
     * Either the list index (number) or message ID (string) without type prefix.
     * @return {Message}
     */
    value: function get(indexOrID) {
      var _messages = this._messages,
          _orderedIDs = this._orderedIDs;

      if (typeof indexOrID === 'number') {
        return _messages[_orderedIDs[indexOrID]];
      } else {
        return _messages[indexOrID];
      }
    }
    /**
     * List mapping method (like the array map method)
     * @param {function} mappingFunction
     * @return {Array}
     */

  }, {
    key: 'map',
    value: function map(mappingFunction) {
      var _this3 = this;

      return this._orderedIDs.map(function (id) {
        return _this3._messages[id];
      }).map(mappingFunction);
    }
    /**
     * List filter method (like the array filter method)
     * @param {function} predicate
     * @return {Array}
     */

  }, {
    key: 'filter',
    value: function filter(predicate) {
      var _this4 = this;

      return this._orderedIDs.map(function (id) {
        return _this4._messages[id];
      }).filter(predicate);
    }
    /**
     * Add a message, no-op if the message already exists.
     * Will mark the message as read if the autoRead option is true.
     * @param {Message} message
     * @return {ManagedMessageList}
     */

  }, {
    key: 'add',
    value: function add(message) {
      var _messages = this._messages;

      if (!_messages.hasOwnProperty(message._id)) {
        _messages[message._id] = message;
        this._messagesUpdated();
        if (this._autoRead) {
          _skygearChat2.default.markAsRead([message]);
        }
      }
      return this;
    }
    /**
     * Update a message, no-op if the message updatedAt date is older than existing.
     * Message will be added if it's not in the list.
     * @param {Message} message
     * @return {ManagedMessageList}
     */

  }, {
    key: 'update',
    value: function update(message) {
      var _messages = this._messages;

      if (_messages.hasOwnProperty(message._id) && message.updatedAt >= _messages[message._id].updatedAt) {
        _messages[message._id] = message;
        this._messagesUpdated();
      } else {
        this.add(message);
      }
      return this;
    }
    /**
     * Remove a message, no-op if the message doesn't exist.
     * @param {string} messageID Message ID without type prefix.
     * @return {ManagedMessageList}
     */

  }, {
    key: 'remove',
    value: function remove(messageID) {
      var _messages = this._messages;

      if (_messages.hasOwnProperty(messageID)) {
        delete _messages[messageID];
        this._messagesUpdated();
      }
      return this;
    }
    /**
     * Subscribe to list updates, handler will be called with one argument: this object.
     * @param {function} handler
     * @return {number} Subscription ID
     */

  }, {
    key: 'subscribe',
    value: function subscribe(handler) {
      var _updateHandlers = this._updateHandlers;

      var subID = Object.keys(_updateHandlers).length;
      _updateHandlers[subID] = handler;
      return subID;
    }
    /**
     * Cancel a subscription.
     * @param {number} subID The subscription ID returned by the subscribe function.
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(subID) {
      delete this._updateHandlers[subID];
    }
  }, {
    key: 'length',
    get: function get() {
      return this._orderedIDs.length;
    }
  }]);

  return ManagedMessageList;
}();

exports.default = ManagedMessageList;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TypingDetector;

var _skygearChat = __webpack_require__(16);

var _skygearChat2 = _interopRequireDefault(_skygearChat);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detects whether the user is typing in an input field and send typing events to the server.
 *
 * @example
 * var typing = TypingDetector(conversation); // NOTE: this is not a class, don't use 'new'.
 * <input type=text oninput="typing()" />
 *
 * @param {Conversation} conversation - send typing events to this conversation.
 * @param {Object} [options]
 * @param {number} [options.debounceTime = 3000] - interger of miliseconds to debounce calls
 */
function TypingDetector(conversation) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$debounceTime = _ref.debounceTime,
      debounceTime = _ref$debounceTime === undefined ? 3000 : _ref$debounceTime;

  if (!(conversation instanceof _skygear2.default.Record && conversation.recordType === 'conversation')) {
    throw new Error('TypingDetector expects Conversation, instead got ' + conversation + '.');
  }
  var debounceTimer = null;
  function stopTyping() {
    _skygearChat2.default.sendTypingIndicator(conversation, 'finished');
    debounceTimer = null;
  }
  function startTyping() {
    _skygearChat2.default.sendTypingIndicator(conversation, 'begin');
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  function resetTimer() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  return function () {
    if (debounceTimer) {
      resetTimer();
    } else {
      startTyping();
    }
  };
}

/***/ })
],[130]);