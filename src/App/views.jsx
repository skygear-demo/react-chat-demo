import React from 'react';

import Modal from '../Modal';
import Conversation from '../Conversation';
import ConversationPreview from '../ConversationPreview';
import SettingsModal from '../SettingsModal';
import DetailsModal from '../DetailsModal';

function CreateGroupModal(
  createGroup
) {

}

function CreateChatModal(
  createChat
) {

}

function AddButton({
  text, onClick
}) {
  return (
    <button
      onClick={onClick}
      style={{
      }}>
      <span
        style={{
        }}>
        +
      </span>
      {text}
    </button>
  );
}

export function render() {
  const {
    unreadCount,
    currentModal,
    currentConversation,
    conversationList,
  } = this.state;

  return (
    <div>
      <div>
        <div>
          <span>{unreadCount}</span>
          <h1>Chats</h1>
          <img
            src="img/gear.svg"
            style={{cursor: 'pointer'}}
            onClick={this.showSettings}/>
        </div>
        <div>
          <AddButton
            text="Direct Chat"
            onClick={this.showCreateChat}/>
          <AddButton
            text="Group"
            onClick={this.showCreateGroup}/>
        </div>
        {
          conversationList.map((c) => {
            return <ConversationPreview conversation={c}/>;
          })
        }
      </div>
      <Conversation
        conversation={currentConversation}
        showDetails={this.showDetails}/>
      {
        {
          createGroup: (
            <CreateGroupModal
              onClose={this.closeModal}/>)
            ,
          createChat: (
            <CreateChatModal
              onClose={this.closeModal}/>)
            ,
          settings: (
            <SettingsModal
              onClose={this.closeModal}/>)
            ,
          details: (
            <DetailsModal
              onClose={this.closeModal}
              conversation={currentConversation}/>)
            ,
        }[currentModal] || null
      }
    </div>
  );
}
