import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import TypingDetector from '../utils/TypingDetector.jsx';
import ManagedMessageList from '../utils/ManagedMessageList.jsx';
import UserLoader from '../utils/UserLoader.jsx';

import Message from './Message.jsx';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const {title} = props.conversation;
    this.state = {
      title: title || 'loading...', // conversation title (either group name or participant names)
      users: [],                    // array of users in this conversation
      typing: {},                   // map of userID => typing status (boolean)
    };
    this.detectTyping = new TypingDetector(props.conversation);
    this.messageList = new ManagedMessageList(props.conversation);
  }
  componentDidMount() {
    // subscribe message change
    this.messageList.subscribe(_ => {
      this.forceUpdate();
    });
    // subscribe to typing events
    skygearChat.subscribeTypingIndicator(
      this.props.conversation,
      this.typingEventHandler.bind(this)
    );
    this.scrollToBottom();
    this.fetchUsers();
  }
  componentDidUpdate(prevProps) {
    this.scrollToBottom();
    if(this.props.conversation.updatedAt > prevProps.conversation.updatedAt) {
      this.fetchUsers();
    }
  }
  componentWillUnmount() {
    this.messageList.destroy();
    // FIXME: unsubscribe typing indicator when SDK is fixed.
    //skygearChat.unsubscribeTypingIndicator(
    //  this.props.conversation
    //);
  }
  scrollToBottom() {
    // wait for changes to propergate to real DOM
    setTimeout(_ => {
      const messageView = document.getElementById('message-view');
      messageView.scrollTop = messageView.scrollHeight;
    }, 100);
  }
  fetchUsers() {
    const {
      title,
      participant_ids,
    } = this.props.conversation;
    Promise.all(
      participant_ids
      .map(userID => UserLoader.get(userID))
    ).then(results => {
      let names = results
        .filter(u => u._id !== skygear.currentUser.id)
        .map(u => u.displayName)
        .join(', ');
      if (names.length > 30) {
        names = names.substring(0,27) + '...';
      }
      let typing = {};
      results.forEach(user => {
        typing[user._id] = false;
      });
      this.setState({
        title: title || names,
        users: results,
        typing,
      });
    });
  }
  typingEventHandler(event) {
    console.log('[typing event]', event);
    const {typing} = this.state;
    for(let userID in event) {
      const _id = userID.split('/')[1];
      switch(event[userID].event) {
        case 'begin':
          typing[_id] = true;
          break;
        case 'finished':
          typing[_id] = false;
          break;
      }
    }
    this.setState({typing});
  }
  sendMessage(messageBody) {
    if(messageBody.length > 0) {
      const {conversation} = this.props;
      const message = new skygear.Record('message', {
        body:             messageBody,
        metadata:         {},
        conversation_id:  new skygear.Reference(conversation.id),
        createdAt:        new Date(),
        createdBy:        skygear.currentUser.id,
      });
      this.messageList.add(message);
      skygear.privateDB.save(message);
      // force update the conversation on new message to trigger pubsub event
      skygearChat.updateConversation(conversation);
    }
  }
  render() {
    const {
      props: {
        showDetails,
        conversation: {
          participant_count,
        },
      },
      state: {
        title,
        users,
        typing,
      },
      messageList,
    } = this;
    const currentUserID = skygear.currentUser && skygear.currentUser.id;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '75%',
          height: '100%',
        }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '6rem',
            borderBottom: '1px solid #000',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <span></span>
            <div
              style={{
                textAlign: 'center',
                fontSize: '1.5rem'
              }}>
              <strong>{title}</strong> {` (${participant_count} people)`} <br/>
              <span style={{fontSize: '1rem'}}>
                {
                  (_ => {
                    const typingUsers = users
                      .filter(u => u._id !== currentUserID)
                      .filter(u => typing[u._id])
                      .map(u => u.displayName)
                      .join(', ');
                    return (typingUsers === '')? '' : `${typingUsers} is typing...`;
                  })()
                }
              </span>
            </div>
            <img
              style={{
                height: '2rem',
                cursor: 'pointer',
                marginRight: '2rem',
              }}
              onClick={showDetails}
              src="img/info.svg"/>
          </div>
        </div>
        <div
          id="message-view"
          style={{
            height: '100%',
            width: '100%',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}>
          {
            messageList.map((m) => (
              <Message
                key={m.id + m.updatedAt}
                message={m}/>
            ))
          }
        </div>
        <div
          style={{
            width: '100%',
            height: '5rem',
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #000',
          }}>
          <form
            style={{
              width: '100%',
              margin: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onSubmit={e => {
              e.preventDefault();
              this.sendMessage(e.target[0].value);
              e.target[0].value = '';
            }}>
            <input
              style={{
                padding: '0.25rem',
                fontSize: '1rem',
                width: '100%',
              }}
              onChange={_ => this.detectTyping()}
              type="text"/>
            <input
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #000',
                padding: '0.5rem 1rem',
                marginLeft: '1rem',
              }}
              value="Send"
              type="submit"/>
          </form>
        </div>
      </div>
    );
  }
}
