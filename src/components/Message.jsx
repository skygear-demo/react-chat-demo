import React from 'react';
import skygear from 'skygear';

import UserLoader from '../utils/UserLoader.jsx';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null // the user this message belongs to
    };
  }
  componentDidMount() {
    UserLoader.get(
      this.props.message.createdBy
    ).then(user => {
      this.setState({user});
    });
  }
  render() {
    const {
      props: {message},
      state: {user}
    } = this;
    const currentUserID = skygear.currentUser && skygear.currentUser.id;

    if (!user) {
      return null;
    }
    return (
      <div
        style={Object.assign({},
          Styles.container,
          {justifyContent: user._id === currentUserID ? 'flex-end' : 'flex-start'}
          )}>
        <div
          style={Object.assign({},
            Styles.avatar,
            {backgroundImage: `url(${user.avatar ?
              user.avatar.url : 'img/avatar.svg'})`}
          )}>
        </div>
        <div
          style={Styles.messageBody}>
          {message.body}
        </div>
      </div>
    );
  }
}

const Styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  avatar: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '2rem',
    height: '2rem',
    marginLeft: '1rem'
  },

  messageBody: {
    margin: '1rem',
    padding: '0.5rem',
    border: '1px solid #000',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  }
}
