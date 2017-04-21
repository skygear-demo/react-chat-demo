import React from 'react';
import skygearChat from 'skygear-chat';

import ManagedUserConversationList from '../utils/ManagedConversationList.jsx';

import Conversation from './Conversation.jsx';
import ConversationPreview from './ConversationPreview.jsx';
import CreateChatModal from './CreateChatModal.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';
import SettingsModal from './SettingsModal.jsx';
import DetailsModal from './DetailsModal.jsx';


function AddButton({
  text,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      style={Styles.addButton}>
      + {text}
    </button>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unreadCount: 0,    // user's total unread message count (int)
      currentModal: null, // currently displayed modal dialog name (or null)
      activeID: null // currently selected UserConversion ID (or null)
    };
    this.userConversationList = new ManagedUserConversationList();
  }

  componentDidMount() {
    // subscribe conversation change
    this.userConversationList.subscribe(() => {
      this.forceUpdate();
    });
    skygearChat.getUnreadCount().then(result => {
      this.setState({unreadCount: result.message});
    });
  }

  render() {
    const {
      state: {
        unreadCount,
        currentModal,
        activeID
      },
      userConversationList
    } = this;
    const activeUC = userConversationList.get(activeID);

    return (
      <div
        style={Styles.root}>
        <div
          style={Styles.leftPanel}>
          <div
            style={Styles.settingPanel}>
            <span>{unreadCount > 0 ? `(${unreadCount})` : ''}</span>
            <h1>Chats</h1>
            <img
              src="img/gear.svg"
              style={Styles.settingImg}
              onClick={() => this.setState({currentModal: 'settings'})}/>
          </div>
          <div
            style={Styles.creationPanel}>
            <AddButton
              text="Direct Chat"
              onClick={() => this.setState({currentModal: 'createChat'})}/>
            <AddButton
              text="Group"
              onClick={() => this.setState({currentModal: 'createGroup'})}/>
          </div>
          <div style={Styles.conversationContainer}>
            {
              userConversationList
                .map((uc) => {
                  return <ConversationPreview
                    key={'ConversationPreview-' + uc.id + uc.updatedAt}
                    selected={
                      uc.id === activeID}
                    userConversation={uc}
                    conversation={uc.$transient.conversation}
                    onClick={() => this.setState({activeID: uc._id})}/>
                })
            }
          </div>
        </div>
        {activeID &&
          <Conversation
            key={'Conversation-' + activeID}
            conversation={activeUC.$transient.conversation}
            showDetails={() => this.setState({currentModal: 'details'})}/>
        }
        {(modal => {
          switch (modal) {
          case 'createGroup':
            return (
                <CreateGroupModal
                  addConversationDelegate={c => userConversationList.addConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'createChat':
            return (
                <CreateChatModal
                  addConversationDelegate={c => userConversationList.addConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'settings':
            return (
                <SettingsModal
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'details':
            return (
                <DetailsModal
                  key={'DetailsModal-' + activeID.id}
                  conversation={activeUC.$transient.conversation}
                  updateConversationDelegate={c => userConversationList.updateConversation(c)}
                  removeConversationDelegate={c => userConversationList.removeConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          default:
            return null;
          }
        })(currentModal)}
      </div>
    );
  }
}


const Styles = {
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowX: 'scroll'
  },

  leftPanel: {
    height: '100%',
    width: '25%',
    minWidth: '400px',
    borderRight: '1px solid #888',
    display: 'flex',
    flexDirection: 'column'
  },

  settingPanel: {
    height: '2rem',
    minHeight: '2rem',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #888'
  },

  settingImg: {
    cursor: 'pointer',
    height: '2rem'
  },

  creationPanel: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #888',
    height: '4rem',
    minHeight: '4rem'
  },

  conversationContainer: {
    overflowY: 'scroll'
  },

  addButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  },

}
