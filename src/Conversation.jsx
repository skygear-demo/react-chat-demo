import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

const Conversation = skygear.Record.extend('conversation');

// EVENTS =================================================

function getPropTypes() {
  return {
    // target Conversation
    conversation: React.PropTypes.instanceOf(Conversation),
    // show Details Modal action handler
    showDetails:  React.PropTypes.func,
  };
}

function getInitialState() {
  const {
    title,
    participant_ids,
  } = this.props.conversation;
  return {
    title:        title,                  // conversation title
    memberCount:  participant_ids.length, // number of people in this conversation
    messages:     [],                     // list of Message records (newest last)
  };
}

function fetchMessages() {

}
function subscribeTypingEvent() {
}
function unsubscribeTypingEvent() {
}
function subscribeMessageEvent() {
}
function unsubscribeMessageEvent() {
}

function sendMessage(
  message   // message to send (string)
) {

}

function sendTypingEvent() {

}

// VIEWS ===============================================

function render() {
  const {
  } = this.props;
  const {
  } = this.state;

  return (
    <p>foo</p>
  );
}

// COMPONENT ==========================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  componentDidMount: function() {
    fetchMessages.call(this);
    subscribeTypingEvent.call(this);
    subscribeMessageEvent.call(this);
  },
  componentWillUnmount: function() {
    unsubscribeTypingEvent.call(this);
    unsubscribeMessageEvent.call(this);
  },
  sendMessage,
  sendTypingEvent,
  render,
});
