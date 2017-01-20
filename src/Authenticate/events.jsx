import skygear from 'skygear';

export function getInitialState() {
  return {
    loading: false, // loading state (boolean)
    error: null     // error message (shown in error modal if non-null)
  };
}

export function login(
  username,
  password
) {
  this.setState({loading: true});
  skygear.loginWithUsername(
    username,
    password
  )
  .then(_ => {
    location.href = 'app.html';
  })
  .catch(result => {
    this.setState({
      loading: false,
      error: result.error.message
    });
  });
}

export function signup(
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
      location.href = 'app.html';
    })
    .catch(result => {
      this.setState({
        loading: false,
        error: result.error.message
      });
    });
  }
}

export function closeModal() {
  this.setState({error: null});
}

