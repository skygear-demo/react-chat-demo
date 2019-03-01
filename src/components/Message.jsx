import React from 'react';
import skygear from 'skygear';

import UserLoader from '../utils/UserLoader.jsx';
import Styles from '../styles/Message.jsx';

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
    const currentUserID = skygear.auth.currentUser && skygear.auth.currentUser.id;

    if (!user) {
      return null;
    }

    const isMine = `user/${message.ownerID}` === currentUserID

    return (
      <div
        style={Object.assign({},
          Styles.container,
          {justifyContent: isMine ? 'flex-end' : 'flex-start'}
          )}>
        {!isMine && <div
          style={Object.assign({},
            Styles.avatar,
            {backgroundImage: `url(${user.avatar ?
              user.avatar.url : 'img/avatar.svg'})`}
          )}>
        </div>}
        <div
          style={Styles.messageBody}>
          {message.body}
        </div>
        {isMine && <div
          style={Object.assign({},
            Styles.avatar,
            {backgroundImage: `url(${user.avatar ?
              user.avatar.url : 'img/avatar.svg'})`}
          )}>
        </div>}
      </div>
    );
  }
}
