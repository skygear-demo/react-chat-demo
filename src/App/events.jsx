import skygear from 'skygear';
import skygearChat from 'skygear-chat';

export function getInitialState() {
  return {
    loading:              false,  // app loading state (boolean)
    displayName:          '',     // user's display name
    avatarURL:            '',     // user's avatar image URL
    unreadCount:          '',     // user's total unread message count (int or empty string)
    currentModal:         null,   // currently displayed modal dialog name (null for none)
    currentConversation:  null,   // currently selected Conversion Record (null for none)
    conversationList:     [],     // array of user's Conversion Records
  };
}

export function fetchUserProfile() {
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .equalTo('_id', skygear.currentUser.id)
  ).then(([user]) => {
    this.setState({
      displayName:  user.displayName || skygear.currentUser.username,
      avatarUrl:    (user.avatar)? user.avatar.url : 'img/avatar.svg' ,
    });
  });
}
export function fetchUnreadCount() {
  skygearChat.getUnreadCount()
  .then((unreadCount) => {
    this.setState({unreadCount});
  });
}
export function fetchConversations() {
  skygearChat.getConversations()
  .then((conversationList) => {
    this.setState({conversationList});
  });
}
export function switchConversation(
  conversation
) {
  this.setState({currentConversation: conversation});
}
export function leaveConversation(
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

export function showCreateGroup() {
  this.setState({currentModal: 'createGroup'});
}
export function showCreateChat() {
  this.setState({currentModal: 'createChat'});
}
export function showSettings() {
  this.setState({currentModal: 'settings'});
}
export function showDetails() {
  this.setState({currentModal: 'details'});
}
export function closeModal() {
  this.setState({currentModal: null});
}

export function createGroup(
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
export function createChat(
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

export function changeAvatar(
  imageFile
) {
  this.setState({loading: true});
  skygear.publicDB.save(
    new skygear.UserRecord({
      _id: 'user/' + skygear.currentUser.id,
      avatar: new skygear.Asset({
        name: imageFile.name,
        file: imageFile,
      }),
    })
  ).then(_ => {
    this.setState({loading: false});
  });
}
export function changeName(
  newName
) {
  this.setState({loading: true});
  skygear.publicDB.save(
    new skygear.UserRecord({
      _id: 'user/' + skygear.currentUser.id,
      displayName: newName,
    })
  ).then(_ => {
    this.setState({loading: false});
  });
}

export function logout() {
  this.setState({loading: true});
  skygear.logout().then(_ => {
    this.setState({loading: false});
    location.href = 'login.html';
  });
}
