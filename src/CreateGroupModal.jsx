import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

// EVENTS ==========================================

function getInitialState() {
  return {
  };
}

function createGroup(
  members,
  groupName
) {
  this.setState({loading: true});
  return skygearChat.createConversation(
    members,
    groupName
  ).then((conversation) => {
    const {conversationList} = this.state;
    conversationList.unshift(conversation);
    this.setState({
      loading: false,
      modal: null,
      currentConversation: conversation,
      conversationList,
    });
  });
}

// VIEWS ==========================================

export function render() {
  const {
  } = this.props;
  const {
  } = this.state;

  return (
    <p>foo</p>
  );
}

// COMPONENT ======================================

export default React.createClass({
  getInitialState,
  render,
});
