import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../../styles/SignUpContainer.module.css';
import SignUpForm from '../SignUpForm';
import ExistUserLoginForm from '../ExistUserLoginForm';
import '../../styles/FontEXO.global.css'; // Google font font-family: 'Exo', sans-serif;

/** The container component for signup */
export class SignUpContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };
  /** If a user did register correctly, forward to reading page. Otherwise, show the error message.
    * @param {object} nextProps is the object that contains this component's new props.
    * @returns {null} No return.
   */
  componentWillReceiveProps(nextProps) {
    /* Pushing to the reading page after login */
    if (nextProps.user.isAuth) this.props.history.push('/reading');
    /* istanbul ignore next */
    else if (nextProps.user.loginErr) {
      // $ will use index.html's jQuery.
      $('#loginWarnMessage').css('opacity', '1');
      setTimeout(_ => { $('#loginWarnMessage').css('opacity', '0'); }, 3000);
    }
  }

  /** Rendering the jsx for the component
    * @returns {jsx} Returning the jsx for the component.
  */
  render() {
    return (
      <div className={`${styles.loginBackgroundContainer}`}>
        <div className={`${styles.mainContentDiv}`}>
          <div className={`${styles.signupDiv}`}>
            <SignUpForm />
            <div className={`text-center ${styles.signupTitle} ${styles.exsitTitle}`}>or</div>
            <div className={`text-center ${styles.signupTitle}`}>Exist User Login</div>
            <ExistUserLoginForm />
          </div>
        </div>
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps, null)(SignUpContainer);
