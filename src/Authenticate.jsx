import React from 'react';
import skygear from 'skygear';

import Modal from './Modal.jsx';

// EVENTS ===================================================

function getPropTypes() {
  return {
    // selects weather this is a login or signup page
    login: React.PropTypes.bool.isRequired
  };
}

function getInitialState() {
  return {
    loading: false, // loading state (boolean)
    error: null     // error message (shown in error modal if non-null)
  };
}

function login(
  username,
  password
) {
  this.setState({loading: true});
  skygear.loginWithUsername(
    username,
    password
  )
  .then(_ => {
    window.location.href = 'app.html';
  })
  .catch(result => {
    this.setState({
      loading: false,
      error: result.error.message
    });
  });
}

function signup(
  username,
  password,
  passwordConfirm
) {
  this.setState({loading: true});
  if(password !== passwordConfirm) {
    this.setState({error: 'Passwords do not match.'});
    return;
  } else {
    skygear.signupWithUsername(
      username,
      password
    )
    .then(_ => {
      window.location.href = 'app.html';
    })
    .catch(result => {
      this.setState({
        loading: false,
        error: result.error.message
      });
    });
  }
}

function closeModal() {
  this.setState({error: null});
}

// VIEWS =====================================================

function InputField({
  label,    // input label text
  type,     // input type
  required, // required field (boolean)
  disabled, // input disabled (boolean)
  hidden    // input hidden (boolean)
}) {
  if(hidden) return null;
  return (
    <div
      style={{
        margin: '0.5rem 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <label>{label}</label>
      <input
        style={{
          border: '1px solid #000',
          padding: '0.5rem',
          fontSize: '1rem',
        }}
        required={required}
        disabled={disabled}
        type={type}/>
    </div>
  );
}

function ErrorModal({
  message,  // error message
  onClose   // modal close event handler
}) {
  return (
    <Modal
      header="Error"
      onClose={onClose}>
      <div
        style={{
          width: '16rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </Modal>
  );
}

function render() {
  const {
    login
  } = this.props;
  const {
    loading,
    error
  } = this.state;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        height: '100%',
        width: '100%'
      }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if(login) {
            this.login(
              e.target[0].value,
              e.target[1].value
            );
          } else {
            this.signup(
              e.target[0].value,
              e.target[1].value,
              e.target[2].value
            );
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px'
        }}>
        <h1 style={{textAlign: 'center'}}>
          {login? 'Welcome!' : 'Sign Up'}
        </h1>
        <InputField
          required
          type="text"
          label="Username"
          disabled={loading}/>
        <InputField
          required
          type="password"
          label="Password"
          disabled={loading}/>
        <InputField
          required
          type="password"
          label="Confirm Password"
          hidden={login}
          disabled={loading}/>
        <input
          style={{
            margin: '1rem 0',
            backgroundColor: '#FFF',
            border: '1px solid #000',
            padding: '1rem 2rem',
          }}
          type="submit"
          disabled={loading}
          value={login? 'Login' : 'Sign Up'}/>
        <a
          style={{
            textAlign: 'center',
          }}
          href={login? 'signup.html' : 'login.html'}>
          {login? 'Sign Up' : 'Login'}
        </a>
      </form>
      {error && (
        <ErrorModal
          message={error}
          onClose={this.closeModal}/>
      )}
    </div>
  );
}

// COMPONENT ==================================================

export default React.createClass({
  propTypes: getPropTypes(),
  getInitialState,
  login,
  signup,
  closeModal,
  render,
});
