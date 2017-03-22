import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import Modal from './Modal.jsx';

export default class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',     // user display name
      newDisplayName: '',     // new user display name (text input value)
      avatarURL: '',     // user avatar URL
      editingName: false,  // display name editing state
      loading: true   // modal loading state
    };
  }
  componentDidMount() {
    // fetch user profile
    skygear.publicDB.query(
      new skygear.Query(skygear.UserRecord)
      .equalTo('_id', skygear.currentUser.id)
    ).then(([user]) => {
      this.setState({
        loading: false,
        displayName: user.displayName,
        avatarURL: user.avatar ? user.avatar.url : 'img/avatar.svg'
      });
    });
  }
  changeAvatar(imageFile) {
    this.setState({loading: true});
    skygear.publicDB.save(
      new skygear.UserRecord({
        _id: 'user/' + skygear.currentUser.id,
        avatar: new skygear.Asset({
          name: imageFile.name,
          file: imageFile
        })
      })
    ).then(({avatar}) => {
      this.setState({
        loading: false,
        avatarURL: avatar.url
      });
    });
  }
  changeName() {
    const {newDisplayName} = this.state;
    this.setState({loading: true});
    skygear.publicDB.save(
      new skygear.UserRecord({
        _id: 'user/' + skygear.currentUser.id,
        displayName: newDisplayName
      })
    ).then(_ => {
      this.setState({
        loading: false,
        displayName: newDisplayName,
        editingName: false
      });
    });
  }
  editName() {
    const {displayName} = this.state;
    this.setState({
      newDisplayName: displayName,
      editingName: true
    });
  }
  logout() {
    this.setState({loading: true});
    skygear.logout().then(_ => {
      this.setState({loading: false});
      window.location.href = 'login.html';
    });
  }
  render() {
    const {
      props: {
        onClose
      },
      state: {
        avatarURL,
        displayName,
        newDisplayName,
        editingName,
        loading
      }
    } = this;

    const currentUsername = skygear.currentUser && skygear.currentUser.username;

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
            width: '18rem'
          }}>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <input
              type="file"
              accept="image/jpeg,image/png"
              disabled={loading}
              onChange={(e) => this.changeAvatar(e.target.files[0])}
              style={{display: 'none'}}/>
            <div
              style={{
                border: '1px solid #000',
                borderRadius: '100%',
                backgroundImage: `url(${loading ? 'img/loading.svg' : avatarURL})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                width: '5rem',
                height: '5rem'
              }}>
            </div>
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>
              edit
            </span>
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem'
            }}>
            <strong>Username:</strong>
            <span style={{marginLeft: '0.5rem'}}>{currentUsername}</span>
          </div>
          {editingName ?
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem'
              }}>
              <input
                type="text"
                disabled={loading}
                value={newDisplayName}
                onChange={e => this.setState({newDisplayName: e.target.value})}/>
              <span
                style={{
                  cursor: 'pointer',
                  fontSize: '1.3rem'
                }}
                onClick={_ => this.setState({editingName: false})}>
                ✕
              </span>
              <span
                style={{
                  cursor: 'pointer',
                  fontSize: '1.5rem'
                }}
                onClick={_ => this.changeName()}>
                ✓
              </span>
            </div>
           :
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem'
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
                  cursor: 'pointer'
                }}
                onClick={_ => this.editName()}/>
            </div>
          }
        </div>
        <div
          style={{
            width: '100%',
            textAlign: 'center'
          }}>
          <button
            style={{
              background: '#FFF',
              border: '1px solid #000',
              padding: '1rem 2rem'
            }}
            onClick={_ => this.logout()}>
            Logout
          </button>
        </div>
      </Modal>
    );
  }
}
