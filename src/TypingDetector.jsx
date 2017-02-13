
import skygearChat from 'skygear-chat';


// http://stackoverflow.com/questions/36871299/how-to-extend-function-with-es6-classes
class ExtensibleFunction extends Function {
  constructor(f) {
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}


export default class extends ExtensibleFunction {
  constructor(conversation, debounceTime = 3000) {
    super(() => {
      if(this.debounceTimer) {
        this.startTyping();
      } else {
        this.resetTimer();
      }
    });
    this.conversation = conversation;
    this.debounceTime = debounceTime;
    this.debounceTimer = null;
  }
  startTyping() {
    this.debounceTimer = setTimeout(
      this.stopTyping,
      this.debounceTime
    );
    skygearChat.sendTypingIndicator(
      this.conversation, 'begin'
    );
  }
  resetTimer() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(
      this.stopTyping,
      this.debounceTime
    );
  }
  stopTyping() {
    this.debounceTimer = null;
    skygearChat.sendTypingIndicator(
      this.conversation, 'finished'
    );
  }
}
