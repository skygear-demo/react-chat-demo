import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

// EVENTS ==========================================

function getPropTypes() {
  return {
    // app loading state
    loading:    React.PropTypes.bool.isRequired,
    // create chat event handler
    // arg: [User] user - create chat between currentUser and user
    createChat: React.PropTypes.func.isRequired,
    // close modal event handler
    onClose:    React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  return {
    errorMessage: '',
  };
}

function discoverUser(
  username
) {
  skygear.discoverUserByUsernames(
    username
  ).then((users) => {
    if(users.length > 0) {
      this.createChat(users[0]);
    } else {
      this.setState({
        errorMessage: `Error: user ${username} not found`
      });
    }
  });
}

// VIEWS ==========================================

function render() {
  const {
    loading,
    onClose,
  } = this.props;
  const {
    errorMessage,
  } = this.state;

  return (
    <Modal
      header="Create Direct Chat"
      onClose={onClose}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <label>Username</label>
        <input
          disabled={loading}
          type="text"/>
        <p>{errorMessage}</p>
        <div style={{alignSelf: 'flex-end'}}>
          <input
            disabled={loading}
            type="submit"
            value="Start" />
        </div>
      </form>
    </Modal>
  );
}

// COMPONENT ======================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  discoverUser,
  render,
});

