import skygear from 'skygear';
import skygearChat from 'skygear-chat/dist';

export function getInitialState() {
  return {
    unreadCount:          '',
    currentModal:         null,
    currentConversation:  null,
    conversationList:     [],
  };
}
