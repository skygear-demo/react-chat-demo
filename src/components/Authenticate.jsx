import React from 'react';
import skygear from 'skygear';

import Modal from './Modal.jsx';

function InputField({
  label,    // input label text
  type,     // input type
  required, // required field (boolean)
  disabled, // input disabled (boolean)
  hidden    // input hidden (boolean)
}) {
  if (hidden) {
    return null;
  }
  return (
    <p
      style={Styles.formElement}>
      <label>{label}</label>
      <input
        style={Styles.formInput}
        required={required}
        disabled={disabled}
        type={type}/>
    </p>
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
        style={Styles.modelContainer}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </Modal>
  );
}

export default class Authenticate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,     // loading state (boolean)
      errorMessage: null // error message (shown in error modal if non-null)
    };
  }
  login(
    username,
    password
  ) {
    this.setState({loading: true});
    skygear.loginWithUsername(
      username,
      password
    ).then(() => {
      window.location.href = 'app.html';
    }).catch(result => {
      this.setState({
        loading: false,
        errorMessage: result.error.message
      });
    });
  }
  signup(
    username,
    password,
    passwordConfirm
  ) {
    if (password !== passwordConfirm) {
      this.setState({errorMessage: 'Passwords do not match.'});
      return;
    }
    this.setState({loading: true});
    skygear.signupWithUsername(
      username,
      password
    ).then(user => {
      return skygear.publicDB.save(
        new skygear.UserRecord({
          _id: `user/${user.id}`,
          displayName: username
        })
      );
    }).then(() => {
      window.location.href = 'app.html';
    }).catch(result => {
      this.setState({
        loading: false,
        errorMessage: result.error.message
      });
    });
  }
  render() {
    const {
      props: {
        login: loginPage
      },
      state: {
        loading,
        errorMessage
      }
    } = this;

    return (
      <div
        style={Styles.container}>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (loginPage) {
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
          style={Styles.form}>
          <h1 style={{textAlign: 'center'}}>
            {loginPage ? 'Welcome!' : 'Sign Up'}
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
            hidden={loginPage}
            disabled={loading}/>
          <input
            style={Styles.formButton}
            type="submit"
            disabled={loading}
            value={loginPage ? 'Login' : 'Sign Up'}/>
          <a
            style={{
              textAlign: 'center'
            }}
            href={loginPage ? 'signup.html' : 'login.html'}>
            {loginPage ? 'Sign Up' : 'Login'}
          </a>
        </form>
        {errorMessage &&
          <ErrorModal
            message={errorMessage}
            onClose={() => this.setState({errorMessage: null})}/>
        }
      </div>
    );
  }
}


const Styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    height: '100%',
    width: '100%'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px'
  },

  formElement: {
    margin: '0.5rem 0',
    display: 'flex',
    flexDirection: 'column'
  },

  formInput: {
    border: '1px solid #000',
    padding: '0.5rem',
    fontSize: '1rem'
  },

  formButton: {
    margin: '1rem 0',
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem'
  },

  modelContainer: {
    width: '16rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
