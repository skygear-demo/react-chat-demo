import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Conversation from './Conversation.jsx';
import ConversationPreview from './ConversationPreview.jsx';
import CreateChatModal from './CreateChatModal.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';
import SettingsModal from './SettingsModal.jsx';
import DetailsModal from './DetailsModal.jsx';

// EVENTS =================================================

function getInitialState() {
  return {
    loading:              false,              // app loading state (boolean)
    displayName:          '<loading...>',     // user's display name
    avatarURL:            'img/loading.svg',  // user's avatar image URL
    unreadCount:          '',                 // user's total unread message count (int or empty string)
    currentModal:         null,               // currently displayed modal dialog name (null for none)
    currentConversation:  null,               // currently selected Conversion Record (null for none)
    conversationList:     [],                 // array of user's Conversion Records
  };
}

function fetchUserProfile() {
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .equalTo('_id', skygear.currentUser.id)
  ).then(([user]) => {
    console.log('user: ', user);
    this.setState({
      displayName:  user.displayName || skygear.currentUser.username,
      avatarURL:    (user.avatar)? user.avatar.url : 'img/avatar.svg' ,
    });
  });
}
function fetchUnreadCount() {
  skygearChat.getUnreadCount()
  .then((unreadCount) => {
    console.log('unread count: ', unreadCount);
    // FIXME: use real unread count when API is fixed
    this.setState({unreadCount: 0});
  });
}

function fetchConversations() {
  skygearChat.getConversations()
  .then((conversationList) => {
    console.log('conversation list: ', conversationList);
    this.setState({conversationList});
  });
}

function switchConversation(
  conversation
) {
  this.setState({currentConversation: conversation});
}

function leaveConversation(
  conversation
) {
  this.setState({loading: true});
  skygearChat.leaveConversation(
    conversation
  ).then(_ => {
    const {conversationList} = this.state;
    // remove conversation from list
    for(let i = 0; i < conversationList.length; i++) {
      if(conversation.id === conversationList[i].id) {
        conversationList.splice(i,1);
        break;
      }
    }
    this.setState({
      loading: false,
      currentConversation: null,
      conversationList,
    });
  });
}

function addUserToConversation(
  user
) {
  this.setState({loading: true});
  skygearChat.addParticipants(
    this.state.currentConversation,
    [user]
  ).then(conversation => {
    const {conversationList} = this.state;
    // update conversation in list
    for(let i = 0; i < conversationList.length; i++) {
      if(conversation.id === conversationList[i].id) {
        conversationList[i] = conversation;
        break;
      }
    }
    this.setState({
      loading: false,
      currentConversation: conversation,
      conversationList,
    });
  });
}

function changeConversationName(
  newConversationName
) {
  this.setState({loading: true});
  skygearChat.updateConversation(
    this.state.currentConversation,
    newConversationName
  ).then(conversation => {
    const {conversationList} = this.state;
    // update conversation in list
    for(let i = 0; i < conversationList.length; i++) {
      if(conversation.id === conversationList[i].id) {
        conversationList[i] = conversation;
        break;
      }
    }
    this.setState({
      loading: false,
      currentConversation: conversation,
      conversationList,
    });
  });
}

function showCreateGroup() {
  this.setState({currentModal: 'createGroup'});
}
function showCreateChat() {
  this.setState({currentModal: 'createChat'});
}
function showSettings() {
  this.setState({currentModal: 'settings'});
}
function showDetails() {
  this.setState({currentModal: 'details'});
}
function closeModal() {
  this.setState({currentModal: null});
}

function createGroup(
  members,
  groupName
) {
  this.setState({loading: true});
  skygearChat.createConversation(
    members,
    groupName
  ).then((conversation) => {
    const {conversationList} = this.state;
    conversationList.unshift(conversation);
    this.setState({
      loading: false,
      currentConversation: conversation,
      conversationList,
    });
  });
}

function createChat(
  user
) {
  this.setState({loading: true});
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .equalTo('_id', user.id)
  ).then(([userProfile]) => {
    return skygearChat.createDirectConversation(
      user,
      userProfile.displayName || user.username
    );
  }).then((conversation) => {
    const {conversationList} = this.state;
    conversationList.unshift(conversation);
    this.setState({
      loading: false,
      currentConversation: conversation,
      conversationList,
    });
  });
}

function changeAvatar(
  imageFile
) {
  const URL = window.URL || window.webkitURL;
  const imageObjURL = URL.createObjectURL(imageFile);
  this.setState({
    loading: true,
    avatarURL: imageObjURL,
  });
  skygear.publicDB.save(
    new skygear.UserRecord({
      _id: 'user/' + skygear.currentUser.id,
      avatar: new skygear.Asset({
        name: imageFile.name,
        file: imageFile,
      }),
    })
  ).then(({avatar}) => {
    URL.revokeObjectURL(imageObjURL);
    this.setState({
      loading: false,
      avatarURL: avatar.url,
    });
  });
}

function changeName(
  newName
) {
  this.setState({
    loading: true,
    displayName: newName,
  });
  skygear.publicDB.save(
    new skygear.UserRecord({
      _id: 'user/' + skygear.currentUser.id,
      displayName: newName,
    })
  ).then(_ => {
    this.setState({loading: false});
  });
}

function logout() {
  this.setState({loading: true});
  skygear.logout().then(_ => {
    this.setState({loading: false});
    window.location.href = 'login.html';
  });
}

// VIEWS =================================================

function AddButton({
  text,
  onClick
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

function render() {
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
          conversationList.map((c) => (
            <ConversationPreview
              conversation={c}
              onClick={_ => this.switchConversation(c)}/>
          ))
        }
      </div>
      {currentConversation && (
        <Conversation
          conversation={currentConversation}
          showDetails={this.showDetails}/>
      )}
      {
        {
          createGroup: (
            <CreateGroupModal
              loading={loading}
              createGroup={this.createGroup}
              onClose={this.closeModal}/>
          ),
          createChat: (
            <CreateChatModal
              loading={loading}
              createChat={this.createChat}
              onClose={this.closeModal}/>
          ),
          settings: (
            <SettingsModal
              loading={loading}
              displayName={displayName}
              avatarURL={avatarURL}
              changeName={this.changeName}
              changeAvatar={this.changeAvatar}
              onClose={this.closeModal}
              logout={this.logout}/>
          ),
          details: (
            <DetailsModal
              loading={loading}
              conversation={currentConversation}
              addUserToConversation={this.addUserToConversation}
              changeConversationName={this.changeConversationName}
              leaveConversation={this.leaveConversation}
              onClose={this.closeModal}/>
          ),
        }[currentModal] || null
      }
    </div>
  );
}

// COMPONENT ==============================================

export default React.createClass({
  getInitialState,
  componentDidMount: function() {
    fetchUserProfile.call(this);
    fetchUnreadCount.call(this);
    fetchConversations.call(this);
  },
  switchConversation,
  leaveConversation,
  addUserToConversation,
  changeConversationName,
  showCreateGroup,
  showCreateChat,
  showSettings,
  showDetails,
  closeModal,
  createGroup,
  createChat,
  changeAvatar,
  changeName,
  logout,
  render,
});
