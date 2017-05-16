import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;
window.bootstrap = require('bootstrap');
import App from "./app";
import _ from "lodash";
window._ = _;

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
