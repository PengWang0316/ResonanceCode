import React, { Component } from 'react';
import { connect } from 'react-redux';
import jquery from 'jquery';
import PropTypes from 'prop-types';

import styles from '../../styles/LoginContainer.module.css';
import LoginCoverImage from '../LoginCoverImage';
import LoginForm from '../LoginForm';
import { checkAuthentication } from '../../actions/UserActions';

/** The container for the login page. */
export class LoginContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    checkAuthentication: PropTypes.func.isRequired
  };
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
    /* istanbul ignore next */
    if (nextProps.user.isAuth) this.props.history.push('/reading');
    else if (nextProps.user.loginErr) {
      jquery('#loginWarnMessage').css('opacity', '1');
      setTimeout(_ => { jquery('#loginWarnMessage').css('opacity', '0'); }, 3000);
    }
  }

  /** Render method for the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div className={`${styles.loginBackgroundContainer}`}>
        <LoginForm />
        <LoginCoverImage />
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({ user: state.user });
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  checkAuthentication: jwt => dispatch(checkAuthentication(jwt))
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
