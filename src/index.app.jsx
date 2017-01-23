import 'normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import skygear from 'skygear';

import config from './config.json';
import App from './App.jsx';

skygear.config(config.skygearConfig)
.then(function() {
  // redirect to login page if not logged-in
  if(!skygear.currentUser) {
    window.location.href = 'login.html';
  } else {
    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDOM.render(<App/>, root);
  }
});
