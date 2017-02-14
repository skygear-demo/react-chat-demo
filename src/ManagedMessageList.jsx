
import skygearChat from 'skygear-chat';
import skygear from 'skygear';

/**
 * A managed list of messages for the specified conversation.
 * Automatically handles the initial fetch and keeping the list in sync using pubsub.
 *
 * @example
 * var messages = ManagedMessageList(conversation); // NOTE: new is not used
 * messages[0] // => Message
 *
 *
 * @param {Conversation} conversation - manage messages for this conversation.
 * @param {Object} [options]
 * @param {number} [options.initialFetch = 50] - integer number of messages to fetch initially
 * @param {boolean} [options.messageSubscription = true] - receive messages in real-time using pubsub
 * @param {boolean} [options.syncOnReconnect = true] - (NOT IMPLEMENTED) synchronize message list when internet connection is restored
 * @param {boolean} [options.offlineMessageCache = true] - (NOT IMPLEMENTED) cache messages that are added when offline, send them when connection is restored
 */
export default function ManagedMessageList(
  conversation,
  {
    initialFetch = 50,
    messageSubscription = true,
    syncOnReconnect = true,
    offlineMessageCache = true,
  } = {}
) {
  if(!(
    conversation instanceof skygear.Record &&
    conversation.recordType === 'conversation'
  )) {
    throw new Error(`ManagedMessageList expects Conversation, instead got ${conversation}.`);
  }

  // TODO: implement this component

}
