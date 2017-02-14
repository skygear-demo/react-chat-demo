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
    displayName:          'loading...',       // user's display name
    avatarURL:            'img/loading.svg',  // user's avatar image URL
    unreadCount:          '',                 // user's total unread message count (int or empty string)
    currentModal:         null,               // currently displayed modal dialog name (null for none)
    currentConversation:  null,               // currently selected Conversion Record (null for none)
    conversationList:     [],                 // array of user's Conversion Records
    userConversations:    {},                 // map of conversation ID -> UserConversation objects
  };
}

function fetchUserProfile() {
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .equalTo('_id', skygear.currentUser.id)
  ).then(([user]) => {
    this.setState({
      displayName:  user.displayName,
      avatarURL:    (user.avatar)? user.avatar.url : 'img/avatar.svg',
    });
  });
}
function fetchUnreadCount() {
  skygearChat.getUnreadCount()
  .then((unreadCount) => {
    // FIXME: roll back workaround when API is fixed
    this.setState({unreadCount: unreadCount.message});
  });
}

function fetchConversations() {
  skygearChat.getUserConversations()
    .then(userConversationList => {
      console.log('userConversation list: ', userConversationList);
      // automatically remove conversations with only 1 participant
      userConversationList
        .filter(uc => uc.$transient.conversation.participant_count === 1)
        .forEach(uc => skygearChat.leaveConversation(uc.$transient.conversation));
      const cleanUserConversationList =
        userConversationList
        .filter(uc => uc.$transient.conversation.participant_count > 1);
      // convert list of UserConversations records to map by ID
      const userConversations = {};
      cleanUserConversationList.forEach(uc => {
        userConversations[uc.conversation.id] = uc;
      });
      const conversationList =
        cleanUserConversationList
        .map(c => c.$transient.conversation);
      this.setState({
        conversationList,
        userConversations,
      });
    });
}

function addNewConversation(
  userConversation
) {
  const conversation = userConversation.$transient.conversation;
  const {
    conversationList,
    userConversations,
  } = this.state;

  conversationList.unshift(conversation);
  userConversations[conversation.id] = userConversation;

  this.setState({
    currentModal: null,
    currentConversation: conversation,
    conversationList,
    userConversations,
  });
}

function switchConversation(
  conversation
) {
  this.setState({currentConversation: conversation});
}

function leaveConversation() {
  this.setState({loading: true});
  const conversation = this.state.currentConversation;
  return skygearChat.leaveConversation(
    conversation
  ).then(_ => {
    const {
      conversationList,
      userConversations,
    } = this.state;
    // remove Conversation from list
    for(let i = 0; i < conversationList.length; i++) {
      if(conversation.id === conversationList[i].id) {
        conversationList.splice(i,1);
        break;
      }
    }
    // remove UserConversation from map
    delete userConversations[conversation.id];
    this.setState({
      loading: false,
      currentModal: null,
      currentConversation: null,
      conversationList,
      userConversations,
    });
  });
}

function addUserToConversation(
  user
) {
  this.setState({loading: true});
  return skygearChat.addParticipants(
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
  return skygearChat.updateConversation(
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
    userConversations,
  } = this.state;

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
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
            height: '2rem',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #888',
          }}>
          <span>{unreadCount > 0 ? `(${unreadCount})` : ''}</span>
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
              key={c.id + c.updatedAt}
              selected={c.id === (currentConversation && currentConversation.id)}
              conversation={c}
              userConversation={userConversations[c.id] || null}
              onClick={_ => this.switchConversation(c)}/>
          ))
        }
      </div>
      {currentConversation && (
        <Conversation
          key={currentConversation.id + currentConversation.updatedAt}
          conversation={currentConversation}
          showDetails={this.showDetails}/>
      )}
      {(currentModal => {
        switch(currentModal) {
          case 'createGroup':
            return (
              <CreateGroupModal
                loading={loading}
                addNewConversation={this.addNewConversation}
                onClose={this.closeModal}/>
            );
          case 'createChat':
            return (
              <CreateChatModal
                loading={loading}
                addNewConversation={this.addNewConversation}
                onClose={this.closeModal}/>
            );
          case 'settings':
            return (
              <SettingsModal
                loading={loading}
                displayName={displayName}
                avatarURL={avatarURL}
                changeName={this.changeName}
                changeAvatar={this.changeAvatar}
                onClose={this.closeModal}
                logout={this.logout}/>
            );
          case 'details':
            return (
              <DetailsModal
                loading={loading}
                conversation={currentConversation}
                addUserToConversation={this.addUserToConversation}
                changeConversationName={this.changeConversationName}
                leaveConversation={this.leaveConversation}
                onClose={this.closeModal}/>
            );
          default:
            return null;
        }
      })(currentModal)}
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
  addNewConversation,
  changeAvatar,
  changeName,
  logout,
  render,
});
