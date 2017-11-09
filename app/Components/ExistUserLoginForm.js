import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { usernamePasswordLogin } from '../actions/UserActions';

/** The component show the login form for the exist users. */
class ExistUserLoginForm extends Component {
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
    this.setState({ password: '' });
    this.props.usernamePasswordLogin({
      username: this.state.userName,
      password: this.state.password
    });
    // this.props.handleLoginSubmit(this.state.userName, this.state.password);
  }

  /** The render method for the component.
    * @returns {jsx} Return jsx for the component.
  */
  render() {
    return (
      <form className="form-horizontal" onSubmit={this.handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="userName" className="signup-lable">User Name</label>
          <input onChange={this.handleInputChange} type="text" className="form-control" id="userName" placeholder="User Name..." value={this.state.userName} />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="signup-lable">Password</label>
          <input onChange={this.handleInputChange} type="password" className="form-control" id="password" placeholder="Password..." value={this.state.password} />
        </div>
        <div className="form-group text-right">
          <button disabled={this.state.userName == '' || this.state.password == ''} type="submit" className="btn btn-info">Log In</button>
        </div>
        <div id="loginWarnMessage" className="transition-opacity"><i className="fa fa-exclamation-triangle" />Username Password Worry!</div>
      </form>
    );
  }
}
ExistUserLoginForm.propTypes = {
  usernamePasswordLogin: PropTypes.func.isRequired
};
const mapDispatchToProps = dispatch => ({
  usernamePasswordLogin: params => dispatch(usernamePasswordLogin(params))
});
export default connect(null, mapDispatchToProps)(ExistUserLoginForm);
