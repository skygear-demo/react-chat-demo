import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

// EVENTS ==========================================

function getPropTypes() {
  return {
    // app loading state
    loading:                React.PropTypes.bool.isRequired,
    // target Conversation record
    conversation:           React.PropTypes.instanceOf(skygear.Record).isRequired,
    // add user to current conversation event handler
    // arg: {User} user
    addUserToConversation:  React.PropTypes.func.isRequired,
    // change current conversation name event handler
    // arg: {string} newConversationName
    changeConversationName: React.PropTypes.func.isRequired,
    // leave current conversation event handler
    leaveConversation:      React.PropTypes.func.isRequired,
    // close modal event handler
    onClose:                React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  return {
    editingName:          false,  // conversation name editing state (boolean)
    newConversationName:  '',     // editing conversation name
    users:                [],     // list of users in the current conversation
  };
}

function fetchUsers() {
  skygear.publicDB.query(
    new skygear.Query(skygear.UserRecord)
    .contains('_id', this.props.conversation.participant_ids)
  ).then(users => {
    this.setState({users});
  });
}

// start editing name
function editName() {
  if(!this.props.loading) {
    this.setState({
      newConversationName: this.props.conversation.title,
      editingName: true,
    });
  }
}

// update name string while typing
function updateName(
  newConversationName
) {
  this.setState({newConversationName});
}

// stop editing name & save changes
function changeName() {
  this.setState({editingName: false});
  this.props.changeConversationName(this.state.newConversationName);
}

// stop editing name & discard changes
function stopEditName() {
  this.setState({editingName: false});
}

// discover and add user
function discoverAndAddUser(
  username
) {
  console.log(username);
}

// VIEWS ==========================================

function render() {
  if(!this.props.conversation) {
    return null;
  }
  const {
    loading,
    addUserToConversation,
    changeConversationName,
    leaveConversation,
    onClose,
  } = this.props;
  const {
    title
  } = this.props.conversation;
  const {
    editingName,
    newConversationName,
    users,
  } = this.state;

  return (
    <Modal
      header="Details"
      onClose={onClose}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '18rem',
          padding: '1rem',
        }}>
        <strong style={{margin: '2rem 0 0.5rem'}}>
          Name:
        </strong>
        {(editingName)? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
            }}>
            <input
              type="text"
              disabled={loading}
              value={newConversationName}
              onChange={e => this.updateName(e.target.value)}/>
            <span
              style={{
                cursor: 'pointer',
                fontSize: '1.3rem',
              }}
              onClick={this.stopEditName}>
              ✕
            </span>
            <span
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
              onClick={this.changeName}>
              ✓
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
            }}>
            <span>{title || 'Not set.'}</span>
            <img
              src="img/edit.svg"
              style={{
                marginLeft: '1rem',
                height: '1rem',
                cursor: 'pointer',
              }}
              onClick={this.editName}/>
          </div>
        )}
        <strong style={{margin: '2rem 0 0.5rem'}}>
          Participants:
        </strong>
        {
          users.map(u => (
            <div
              key={u.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5rem 0',
              }}>
              <div
                style={{
                  border: '1px solid #000',
                  borderRadius: '100%',
                  backgroundImage: `url(${u.avatar ? u.avatar.url : 'img/avatar.svg'})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '3rem',
                  height: '3rem',
                }}>
              </div>
              <span style={{marginLeft: '1rem'}}>
                {u.displayName}
              </span>
            </div>
          ))
        }
        <form
          onSubmit={e => {
            e.preventDefault();
            this.discoverAndAddUser(
              e.target[1].value
            );
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0.5rem 0',
          }}>
          <input
            type='submit'
            value='+'
            style={{
              border: '1px solid #000',
              borderRadius: '100%',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              backgroundColor: '#FFF',
              cursor: 'pointer',
            }} />
          <input
            type='text'
            style={{
              marginLeft: '1rem'
            }} />
        </form>
        <div
          style={{
            alignSelf: 'center',
            marginTop: '2rem',
          }}>
          <button
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #000',
              padding: '1rem 2rem',
              cursor: 'pointer',
            }}
            disabled={loading}
            onClick={leaveConversation}>
            Leave Chat
          </button>
        </div>
      </div>
    </Modal>
  );
}

// COMPONENT ======================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  componentDidMount: fetchUsers,
  editName,
  stopEditName,
  updateName,
  changeName,
  discoverAndAddUser,
  render,
});

