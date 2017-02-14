import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

// EVENTS ==========================================

function getPropTypes() {
  return {
    // app loading state
    loading:      React.PropTypes.bool.isRequired,
    // initial user display name
    displayName:  React.PropTypes.string.isRequired,
    // user avatar URL
    avatarURL:    React.PropTypes.string.isRequired,
    // change name event handler fn
    // arg: [string] newName
    changeName:   React.PropTypes.func.isRequired,
    // change avatar event handler fn
    // arg: [File] imageFile
    changeAvatar: React.PropTypes.func.isRequired,
    // close modal event handler
    onClose:      React.PropTypes.func.isRequired,
    // logout event handler
    logout:       React.PropTypes.func.isRequired,
  };
}

function getInitialState() {
  return {
    newDisplayName: '',     // editing user display name
    editingName:    false,  // display name editing state (boolean)
  };
}

// start editing name
function editName() {
  if(!this.props.loading) {
    this.setState({
      newDisplayName: this.props.displayName,
      editingName: true,
    });
  }
}

// update name string while typing
function updateName(
  newDisplayName
) {
  this.setState({newDisplayName});
}

// stop editing name & save changes
function changeName() {
  this.setState({editingName: false});
  this.props.changeName(this.state.newDisplayName);
}

// stop editing name & discard changes
function stopEditName() {
  this.setState({editingName: false});
}

// VIEWS ==========================================


function render() {
  const {
    props: {
      loading,
      displayName,
      avatarURL,
      changeAvatar,
      onClose,
      logout,
    },
    state: {
      newDisplayName,
      editingName,
    }
  } = this;

  return (
    <Modal
      header="Settings"
      onClose={onClose}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '2rem 0',
          width: '18rem',
        }}>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => changeAvatar(e.target.files[0])}
            style={{display: 'none'}}/>
          <div
            style={{
              border: '1px solid #000',
              borderRadius: '100%',
              backgroundImage: `url(${avatarURL})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
              width: '5rem',
              height: '5rem',
            }}>
          </div>
          <span
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}>
            edit
          </span>
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '1rem',
          }}>
          <strong>Username:</strong>
          <span style={{marginLeft: '0.5rem'}}>
            {skygear.currentUser && skygear.currentUser.username}
          </span>
        </div>
        {(editingName)? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
            }}>
            <input
              type="text"
              value={newDisplayName}
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
            <strong>Name:</strong>
            <span style={{marginLeft: '0.5rem'}}>
              {displayName}
            </span>
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
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}>
        <button
          style={{
            background: '#FFF',
            border: '1px solid #000',
            padding: '1rem 2rem',
          }}
          onClick={logout}>
          Logout
        </button>
      </div>
    </Modal>
  );
}

// COMPONENT ======================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  editName,
  updateName,
  changeName,
  stopEditName,
  render,
});

