import React from 'react';

import Conversation from '../Conversation';
import ConversationPreview from '../ConversationPreview';
import CreateChatModal from '../CreateChatModal';
import CreateGroupModal from '../CreateGroupModal';
import SettingsModal from '../SettingsModal';
import DetailsModal from '../DetailsModal';


function AddButton({
  text, onClick
}) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#FFF',
        border: '1px solid #000',
        padding: '1rem 2rem',
        cursor: 'pointer',
      }}>
      + {text}
    </button>
  );
}

export function render() {
  const {
    loading,
    displayName,
    avatarURL,
    unreadCount,
    currentModal,
    currentConversation,
    conversationList,
  } = this.state;

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
      }}>
      <div
        style={{
          height: '100%',
          width: '25%',
          minWidth: '400px',
          borderRight: '1px solid #888'
        }}>
        <div
          style={{
            width: '100%,',
            height: '4rem',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #888',
          }}>
          <span>{unreadCount}</span>
          <h1>Chats</h1>
          <img
            src="img/gear.svg"
            style={{
              cursor: 'pointer',
              height: '2rem',
            }}
            onClick={this.showSettings}/>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #888',
          }}>
          <AddButton
            text="Direct Chat"
            onClick={this.showCreateChat}/>
          <AddButton
            text="Group"
            onClick={this.showCreateGroup}/>
        </div>
        {
          conversationList.map((c) => {
            return (
              <ConversationPreview
                conversation={c}
                onClick={_ => this.switchConversation(c)}/>);
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
              createGroup={this.createGroup}
              onClose={this.closeModal}/>)
            ,
          createChat: (
            <CreateChatModal
              createChat={this.createChat}
              onClose={this.closeModal}/>)
            ,
          settings: (
            <SettingsModal
              displayName={displayName}
              avatarURL={avatarURL}
              changeName={this.changeName}
              changeAvatar={this.changeAvatar}
              onClose={this.closeModal}/>)
            ,
          details: (
            <DetailsModal
              conversation={currentConversation}
              leaveConversation={this.leaveConversation}
              onClose={this.closeModal}/>)
            ,
        }[currentModal] || null
      }
    </div>
  );
}
