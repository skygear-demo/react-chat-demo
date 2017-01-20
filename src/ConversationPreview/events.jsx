import skygear from 'skygear';
import skygearChat from 'skygear-chat';

export function getInitialState() {
  return {
    unreadCount:  '',   // conversation unread message count (or '' for unknown)
    name:         '',   // conversation name
    imageURL:     '',   // conversation image URL
    lastMessage:  '',   // last message in conversation
  };
}

export function fetchConversationImage() {

}

export function fetchUnreadCount() {

}

export function fetchLastMessage() {

}

