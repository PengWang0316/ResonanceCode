import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import "./styles/index.css";
// import jQuery from "jQuery";
// require('bootstrap');
const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
