import React from 'react';

import {
  getInitialState,
  fetchConversations,
  showCreateGroup,
  showCreateChat,
  showSettings,
  showDetails,
  closeModal,
  createGroup,
  createChat,
  changeAvatar,
  changeName,
} from './events.jsx';

import {render} from './views.jsx'

export default React.createClass({
  getInitialState,
  componentDidMount: fetchConversations,
  showCreateGroup,
  showCreateChat,
  showSettings,
  showDetails,
  closeModal,
  createGroup,
  createChat,
  changeAvatar,
  changeName,
  render,
});
