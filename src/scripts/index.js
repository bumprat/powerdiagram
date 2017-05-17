import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;
import _ from "lodash";
window._ = _;
//window.bootstrap = require('bootstrap');
import App from "./app";

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
