import React from 'react';

import {
  getInitialState,
  fetchUserProfile,
  fetchUnreadCount,
  fetchConversations,
  switchConversation,
  leaveConversation,
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
} from './events.jsx';

import {
  render,
} from './views.jsx'

export default React.createClass({
  getInitialState,
  componentDidMount: function() {
    fetchUserProfile.call(this);
    fetchUnreadCount.call(this);
    fetchConversations.call(this);
  },
  switchConversation,
  leaveConversation,
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
