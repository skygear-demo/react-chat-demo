import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import UserLoader from '../utils/UserLoader.jsx';

export default class ConversationPreview extends React.Component {
  constructor(props) {
    super(props);
    const {title} = props.conversation;
    this.state = {
      title: title || 'loading...',  // conversation title (either group name or participant names)
      imageURL: 'img/loading.svg'      // conversation image URL
    };
  }
  componentDidMount() {
    const {
      title,
      participant_ids
    } = this.props.conversation;
    // fetch users
    Promise.all(
      participant_ids
      .filter(id => id !== skygear.currentUser.id)
      .map(userID => UserLoader.get(userID))
    ).then(users => {
      let names = users
        .map(u => u.displayName)
        .join(', ');
      if (names.length > 30) {
        names = names.substring(0, 27) + '...';
      }
      this.setState({
        title: title || names,
        imageURL: users[0].avatar ? users[0].avatar.url : 'img/avatar.svg'
      });
    });
  }
  render() {
    const {
      props: {
        selected,
        onClick,
        conversation: {
          unread_count,
          $transient: {
            last_message: {
              body: lastMessage
            } = {}
          }
        }
      },
      state: {
        title,
        imageURL
      }
    } = this;

    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 2rem',
          borderBottom: '1px solid #DDD',
          backgroundColor: selected ? '#EEE' : '#FFF',
          cursor: 'pointer'
        }}>
        <div
          style={{
            border: '1px solid #000',
            borderRadius: '100%',
            backgroundImage: `url(${imageURL})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '3rem',
            height: '3rem'
          }}>
        </div>
        <div
          style={{
            padding: '0 1rem',
            display: 'flex',
            flexDirection: 'column',
            width: '70%'
          }}>
          <h2 style={{margin: '0'}}>{title}</h2>
          {lastMessage &&
            <span
              style={{
                marginTop: '0.5rem',
                color: '#AAA'
              }}>
              { lastMessage.length > 23 ? lastMessage.substring(0, 20) + '...' : lastMessage }
            </span>
          }
        </div>
        <span>
          {unread_count > 0 ? `(${unread_count})` : ''}
        </span>
      </div>
    );
  }
}

