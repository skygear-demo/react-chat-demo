import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

// EVENTS =================================================

function getPropTypes() {
  return {
    // target Conversation
    conversation: React.PropTypes.instanceOf(skygear.Record).isRequired,
    // show Details Modal action handler
    showDetails:  React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  const {
    title,
    distinct_by_participants,
  } = this.props.conversation;
  const chatTitle = (distinct_by_participants)? 'loading...' : title;
  return {
    title:    chatTitle,  // conversation title (either group name or name of first non-self participant)
    messages: [],         // list of Message records (newest last)
  };
}

// use first user's name as the conversation title if not defined
// add elipsies if there are more than 2 participants
function fetchFirstUser() {
  const firstUserID =
    this.props.conversation
    .participant_ids
    .filter(id => id !== skygear.currentUser.id)[0];
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .equalTo('_id', firstUserID)
  ).then(([firstUser]) => {
    const {
      title,
      participant_count,
    } = this.props.conversation;
    this.setState({
      title: title || firstUser.displayName + (participant_count > 2 ? ', ...' : ''),
    });
  });
}

function fetchMessages() {
  skygearChat.getMessages(
    this.props.conversation
  ).then(messages => {
    // FIXME: rollback workaround when #21 is merged
    this.setState({messages: messages.results});
  });
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
  messageBody // {string} message to send
) {
  skygearChat.createMessage(
    this.props.conversation,
    messageBody
  ).then(message => {
    const {messages} = this.state;
    messages.push(message);
    this.setState({messages});
  });
}

function sendTypingEvent() {
  // TODO: debounce event and send typing status
}

// VIEWS ===============================================

function Message({
  message // {Message} message record to display
}) {
  return (
    <p>foo</p>
  );
}

function render() {
  const {
    showDetails,
  } = this.props;
  const {
    participant_count,
  } = this.props.conversation;
  const {
    title,
    messages,
  } = this.state;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '75%',
        height: '100%',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '6rem',
          borderBottom: '1px solid #000',
        }}>
        <span></span>
        <span style={{fontSize: '1.5rem'}}>
          <strong>{title}</strong>
          {` (${participant_count} people)`}
        </span>
        <img
          style={{
            height: '2rem',
            cursor: 'pointer',
            marginRight: '2rem',
          }}
          onClick={showDetails}
          src="img/info.svg"/>
      </div>
      <div>
        {
          messages.map((m) => (
            <Message
              key={m.id}
              message={m}/>
          ))
        }
      </div>
      <div
        style={{
          width: '100%',
          height: '4rem',
          display: 'flex',
          alignItem: 'center',
          borderTop: '1px solid #000',
        }}>
        <form
          style={{
            width: '100%',
            margin: '1rem',
            display: 'flex',
            alignItem: 'center',
            justifyContent: 'space-between',
          }}
          onSubmit={e => {
            e.preventDefault();
            this.sendMessage(e.target[0].value);
            e.target[0].value = '';
          }}>
          <input
            style={{
              padding: '0.25rem',
              fontSize: '1rem',
              width: '100%',
            }}
            onChange={this.sendTypingEvent}
            type="text"/>
          <input
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #000',
              padding: '0.5rem 1rem',
              marginLeft: '1rem',
            }}
            value="Send"
            type="submit"/>
        </form>
      </div>
    </div>
  );
}

// COMPONENT ==========================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  componentDidMount: function() {
    if(this.props.conversation.distinct_by_participants) {
      fetchFirstUser.call(this);
    }
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
