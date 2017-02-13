import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

// EVENTS =============================================

function getPropTypes() {
  return {
    // target Conversation
    conversation:     React.PropTypes.instanceOf(skygear.Record).isRequired,
    // target UserConversation
    userConversation: React.PropTypes.instanceOf(skygear.Record).isRequired,
    // weather this conversation is selected
    selected:         React.PropTypes.bool.isRequired,
    // component onClick handler
    onClick:          React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  const {title} = this.props.conversation;
  return {
    title:    title || 'loading...',  // conversation title (either group name or name of first non-self participant)
    imageURL: 'img/loading.svg',      // conversation image URL
  };
}

// fetch image of first non-self user as the conversation image
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
      imageURL: (firstUser.avatar)? firstUser.avatar.url : 'img/avatar.svg',
    });
  });
}


// VIEWS ===================================================

function render() {
  const {
    selected,
    onClick,
  } = this.props;
  const unreadCount =
    this.props.userConversation.unread_count;
  const lastMessageObj =
    this.props.userConversation
    .$transient.conversation
    .$transient.last_message;
  const lastMessage = lastMessageObj ? lastMessageObj.body : null;
  const {
    title,
    imageURL,
  } = this.state;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #DDD',
        backgroundColor: selected? '#EEE' : '#FFF',
        cursor: 'pointer',
      }}>
      <div
        style={{
          border: '1px solid #000',
          borderRadius: '100%',
          backgroundImage: `url(${imageURL})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '3rem',
          height: '3rem',
        }}>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '70%',
        }}>
        <h2 style={{margin: '0'}}>{title}</h2>
        {lastMessage && (
          <span
            style={{
              marginTop: '0.5rem',
              color: '#AAA',
            }}>
            {lastMessage}
          </span>
        )}
      </div>
      <span>{unreadCount > 0 ? `(${unreadCount})` : ''}</span>
    </div>
  );
}

// COMPONENTS =============================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  componentDidMount: fetchFirstUser,
  render,
});

