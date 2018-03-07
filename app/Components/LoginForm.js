import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../styles/LoginForm.module.css';
import { usernamePasswordLogin } from '../actions/UserActions';

/** The component for the login form. */
export class LoginForm extends Component {
  static propTypes = { usernamePasswordLogin: PropTypes.func.isRequired };

  state = {
    username: '',
    password: ''
  };

  /** Handle the input value change.
    * @param {object} event is an object that comes from the input element.
    * @returns {null} No return.
  */
  handleChange = ({ target }) => this.setState({ [target.id]: target.value });

  /** Handle the submit for the form.
    * @param {object} event is an object that comes from the input element.
    * @returns {null} No return.
  */
  handleSubmit = event => {
    event.preventDefault();this.props.usernamePasswordLogin({
      username: this.state.username,
      password: this.state.password
    });
    this.setState({ password: '' });
  }

  /** The render method.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div key="key_login" className={`${styles.loginContainer} container text-right`}>

        <form className={`${styles.loginForm}`} onSubmit={this.handleSubmit}>

          <input type="text" onChange={this.handleChange} id="username" value={this.state.username} placeholder="Username" />

          <input type="password" onChange={this.handleChange} id="password" value={this.state.password} placeholder="Password" />

          <button type="submit" className={`btn btn-info ${styles.loginButton}`} disabled={!(this.state.username && this.state.password)}>Log In</button>

        </form>

        <div id="loginWarnMessage" style={{ opacity: 0 }} className={`container text-right ${styles.loginWarnMessage}`}><i className="fa fa-exclamation-triangle" />Username or Password Incorrect!</div>

      </div>
    );
  }
}
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  usernamePasswordLogin: params => dispatch(usernamePasswordLogin(params))
});
export default connect(null, mapDispatchToProps)(LoginForm);
