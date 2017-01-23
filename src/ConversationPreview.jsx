import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

const Conversation = skygear.Record.extend('conversation');

// EVENTS =============================================

function getPropTypes() {
  return {
    // target Conversation
    conversation: React.PropTypes.instanceOf(Conversation),
    // component onClick handler
    onClick:      React.PropTypes.func
  };
}

function getInitialState() {
  const {title} = this.props.conversation;
  return {
    title:        title,  // conversation name
    imageURL:     '',     // conversation image URL
    unreadCount:  '',     // conversation unread message count (or '' for unknown)
    lastMessage:  '',     // last message in conversation
  };
}

function fetchConversationImage() {

}

function fetchUnreadCount() {

}

function fetchLastMessage() {

}

// VIEWS ===================================================

function render() {
  const {
  } = this.props;
  const {
  } = this.state;

  return (
    <p>foo</p>
  );
}

// COMPONENTS =============================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  render,
});
