import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './Components/App';
import configureStore from './store/ConfigureStore';
import './styles/index.global.css';
// import jQuery from "jQuery";
// require('bootstrap');
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
