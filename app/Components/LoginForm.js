import React, { Component } from 'react';
import { connect } from 'react-redux';

import { usernamePasswordLogin } from '../actions/UserActions';

/** The component for the login form. */
class LoginForm extends Component {
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
    event.preventDefault();
    // $("input, button").prop("disabled",true);
    this.setState({ password: '' });
    // this.props.handleSubmitCallBack(this.state.username, this.state.password); No need to use a callback function.
    this.props.usernamePasswordLogin({
      username: this.state.username,
      password: this.state.password
    });
  }

  /** The render method.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div key="key_login" className="loginContainer container text-right">

        <form className="loginForm" onSubmit={this.handleSubmit}>

          <input type="text" onChange={this.handleChange} id="inputUsername" value={this.state.username} placeholder="Username" />

          <input type="password" onChange={this.handleChange} id="inputPassword" value={this.state.password} placeholder="Password" />

          <button type="submit" className="btn btn-info loginButton" disabled={!(this.state.username && this.state.password)}>Log In</button>

        </form>

        <div id="loginWarnMessage" className="container text-right transition-opacity"><i className="fa fa-exclamation-triangle" />Username or Password Incorrect!</div>

      </div>
    );
  }
}
// LoginForm.PropTypes = {
//   handleSubmitCallBack: PropTypes.func.isRequired
// };
const mapDispatchToProps = dispatch => ({
  usernamePasswordLogin: params => dispatch(usernamePasswordLogin(params))
});
export default connect(null, mapDispatchToProps)(LoginForm);
