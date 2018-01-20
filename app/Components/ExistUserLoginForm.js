import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../styles/ExistUserLoginForm.module.css';
import { usernamePasswordLogin } from '../actions/UserActions';

/** The component show the login form for the exist users. */
export class ExistUserLoginForm extends Component {
  static propTypes = {
    usernamePasswordLogin: PropTypes.func.isRequired
  };

  state = {
    userName: '',
    password: ''
  };

  /** Setting the states when a user changes the value for a input element.
    * @param {object} event is an object that comes from input element.
    * @returns {null} No return.
  */
  handleInputChange = ({ target }) => this.setState({ [target.id]: target.value });

  /** Setting the states and call the method to check a user's login information when a user sbmits a login form.
    * @param {object} event is an object that comes from input element.
    * @returns {null} No return.
  */
  handleLoginSubmit = event => {
    event.preventDefault();
    this.props.usernamePasswordLogin({
      username: this.state.userName,
      password: this.state.password
    });
    this.setState({ password: '' });
    // this.props.handleLoginSubmit(this.state.userName, this.state.password);
  }

  /** The render method for the component.
    * @returns {jsx} Return jsx for the component.
  */
  render() {
    return (
      <form className="form-horizontal" onSubmit={this.handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="userName" className={`${styles.signupLable}`}>User Name</label>
          <input onChange={this.handleInputChange} type="text" className="form-control" id="userName" placeholder="User Name..." value={this.state.userName} />
        </div>
        <div className="form-group">
          <label htmlFor="password" className={`${styles.signupLable}`}>Password</label>
          <input onChange={this.handleInputChange} type="password" className="form-control" id="password" placeholder="Password..." value={this.state.password} />
        </div>
        <div className="form-group text-right">
          <button disabled={this.state.userName === '' || this.state.password === ''} type="submit" className="btn btn-info">Log In</button>
        </div>
        <div id="loginWarnMessage" style={{ opacity: 0 }} className={`${styles.transitionOpacity} ${styles.loginWarnMessage}`}><i className="fa fa-exclamation-triangle" />Username Password Wrong!</div>
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  usernamePasswordLogin: params => dispatch(usernamePasswordLogin(params))
});
export default connect(null, mapDispatchToProps)(ExistUserLoginForm);
