import React from 'react';

import {
  getInitialState,
  login,
  signup,
  closeModal,
} from './events.jsx';

import {
  render
} from './views.jsx'

export default React.createClass({
  propTypes: {
    // login or signup page
    login: React.PropTypes.bool
  },
  getInitialState,
  login,
  signup,
  closeModal,
  render,
});
