import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import LoginCoveImage from '../LoginCoverImage';
import LoginForm from '../LoginForm';
import { checkAuthentication } from '../../actions/UserActions';

/** The container for the login page. */
class LoginContainer extends Component {
  /** Checking the authentication when a user trys to load this page.
    * @return {null} No return.
  */
  componentWillMount() {
    // console.log(this.props.location.search);
    this.props.checkAuthentication(this.props.location.search); // Checking the authentication
  }

  /** Forwarding the page to reading after a user login successfully.
    * Showing the warning message when a user fails to login.
    * @param {object} nextProps is an object has new props that this component will receive.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    /* Pushing to the reading page after login */
    // console.log(nextProps.user);
    if (nextProps.user.isAuth) this.props.history.push('/reading');
    else if (nextProps.user.loginErr) {
      $('#loginWarnMessage').css('opacity', '1');
      setTimeout(_ => { $('#loginWarnMessage').css('opacity', '0'); }, 3000);
    }
  }

  /** Render method for the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div className="loginBackgroundContainer">
        <LoginForm />
        <LoginCoveImage />
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
const mapDispatchToProps = dispatch => ({
  checkAuthentication: jwt => dispatch(checkAuthentication(jwt))
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
