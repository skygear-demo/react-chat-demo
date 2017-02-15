import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

// EVENTS ==========================================

function getPropTypes() {
  return {
    // app loading state
    loading:            React.PropTypes.bool.isRequired,
    // add conversation to App
    // arg: [Conversation] conversation - conversation to add
    addNewConversation: React.PropTypes.func.isRequired,
    // close modal event handler
    onClose:            React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  return {
    loading:      false,  // modal loading state (boolean)
    errorMessage: '',     // error message to display (or '')
    members:      [],     // list of members (users) to add to the new group
    groupName:    '',     // group name input text
  };
}

function discoverUser(
  username
) {
  if(username === skygear.currentUser.username) {
    this.setState({errorMessage: 'Error: cannot create conversation with yourself'});
    return;
  }
  this.setState({loading: true});
  skygear.discoverUserByUsernames(
    username
  ).then((users) => {
    if(users.length <= 0) {
      this.setState({
        loading: false,
        errorMessage: `Error: user "${username}" not found`,
      });
      return;
    }
    const {members} = this.state;
    if(members.filter(u => u.id === users[0].id).length > 0) {
      this.setState({
        loading: false,
        errorMessage: `Error: user "${username}" already added`,
      });
      return;
    }
    members.push(users[0]);
    this.setState({
      loading: false,
      errorMessage: '',
      members,
    });
  });
}

function createGroup() {
  const {
    members,
    groupName,
  } = this.state;
  if(groupName === '') {
    this.setState({errorMessage: 'Error: missing group name'});
    return;
  }
  this.setState({loading: true});
  skygearChat.createConversation(
    members,
    groupName
  ).then(conversation => {
    return skygearChat.getUserConversation(
      conversation
    );
  }).then(userConversation => {
    this.props.addNewConversation(
      userConversation
    );
  }).catch(err => {
    this.setState({
      loading: false,
      errorMessage: `Error: ${err.message}`,
    });
  });
}


// VIEWS ==========================================

export function render() {
  const {
    props: {
      onClose,
    },
    state: {
      errorMessage,
      groupName,
      members,
    },
  } = this;

  const loading = this.props.loading || this.state.loading;

  return (
    <Modal
      header="Create Group Chat"
      onClose={onClose}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '25rem',
          padding: '1rem',
        }}>
        <strong style={{margin: '2rem 0 0.5rem'}}>
          Name:
        </strong>
        <input
          type="text"
          value={groupName}
          onChange={e => this.setState({groupName: e.target.value})} />
        <strong style={{margin: '2rem 0 0.5rem'}}>
          Participants:
        </strong>
        {
          members.map(user => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5rem 0',
              }}>
              <div
                style={{
                  border: '1px solid #000',
                  borderRadius: '100%',
                  backgroundImage: `url(${user.avatar ? user.avatar.url : 'img/avatar.svg'})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '3rem',
                  height: '3rem',
                }}>
              </div>
              <span style={{marginLeft: '1rem'}}>
                {user.displayName}
              </span>
            </div>
          ))
        }
        <form
          onSubmit={e => {
            e.preventDefault();
            this.discoverUser(
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
            disabled={loading}
            style={{
              border: '1px solid #000',
              borderRadius: '100%',
              minWidth: '3rem',
              width: '3rem',
              height: '3rem',
              fontSize: '2rem',
              backgroundColor: '#FFF',
              cursor: 'pointer',
            }} />
          <input
            type='text'
            disabled={loading}
            style={{
              marginLeft: '1rem',
              width: '100%',
            }} />
        </form>
        <p>{errorMessage}</p>
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
            onClick={this.createGroup}>
            Create Group
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
  discoverUser,
  createGroup,
  render,
});
