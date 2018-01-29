import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../styles/SignUpForm.module.css';
import { checkUserNameAvailable, registerNewUser } from '../actions/UserActions';

/** The sign up form component. */
export class SignUpForm extends Component {
  static propTypes = {
    registerNewUser: PropTypes.func.isRequired,
    checkUserNameAvailable: PropTypes.func.isRequired,
    user: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.bool)
    ])).isRequired
  };

  state = {
    userName: '',
    password: '',
    repeatPassword: '',
    isPasswordSame: true,
    isNameAvailable: false,
    isChecking: false,
    hasResult: false
  };

  /** Redirecting a user to the reading page after sign up succesfully.
    * Showing the warnning message if the username has already existed.
    * @param {object} nextProps is the object that contains next props information.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.isChecked) this.setState({
      isChecking: false, hasResult: true, isNameAvailable: nextProps.user.isUsernameAvailable
    });
  }

  /** Checking whether the username has already exsited.
    * @param {string} username is a string that repersents the name a user wants.
    * @returns {null} No return.
  */
  checkUserName(username) {
    this.setState({ hasResult: false }); // lock the submit button when content was changed
    // Clearing the previous checkUserName function
    if (this.checkUserNameFunction) clearTimeout(this.checkUserNameFunction);
    this.checkUserNameFunction = setTimeout(() => {
      this.setState({ isChecking: true });
      this.props.checkUserNameAvailable(username);
      /* this.props.checkUserName(username, result => {
        this.setState({isChecking: false, hasResult: true, isNameAvailable: result});
      }); */
    }, 1000);
  }

  /** Setting up the states when a user changes the value in the input element.
    * @param {object} event is an object that comes from the input the user is reacting with.
    * @returns {null} No return.
  */
  handleInputChange = ({ target }) => {
    // comparing two passwords
    if (target.id === 'password') this.setState({ isPasswordSame: target.value === this.state.repeatPassword });
    else if (target.id === 'repeatPassword') this.setState({ isPasswordSame: target.value === this.state.password });

    // Checking availability for user name
    if (target.id === 'userName') this.checkUserName(target.value);

    this.setState({
      [target.id]: target.value
    });
  };

  /** Register a new user when a user submits the form.
    * @param {object} event is an object that comes from the input the user is reacting with.
    * @returns {null} No return.
  */
  handleSubmit = event => {
    event.preventDefault();
    this.props.registerNewUser({ username: this.state.userName, password: this.state.password });
  };

  /** Render method for the component.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div>
        <div className={`text-center ${styles.signupTitle}`}>New User Sign Up</div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          <div className={this.state.userName !== '' && !this.state.isNameAvailable && this.state.hasResult ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="userName" className={`control-lable ${styles.signupLable}`}>User Name</label>{this.state.isChecking && <i className="fa fa-spinner fa-spin" />}{this.state.userName !== '' && !this.state.isNameAvailable && this.state.hasResult && <span className={`${styles.wrongNameInfo}`}>Name not available!</span>}
            <input onChange={this.handleInputChange} type="text" className="form-control" id="userName" placeholder="User Name..." value={this.state.userName} aria-describedby="inputError2Status" />
            <span className={`glyphicon glyphicon-remove form-control-feedback form-control-feedback-img ${styles.formControlFeedbackImg}`} aria-hidden="true" />
            <span id="inputError2Status" className="sr-only">(error)</span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className={`${styles.signupLable}`}>Password</label>
            <input onChange={this.handleInputChange} type="password" className="form-control" id="password" placeholder="Password..." value={this.state.password} />
          </div>

          <div className={this.state.isPasswordSame ? 'form-group' : 'form-group has-error has-feedback'}>
            <label htmlFor="repeatPassword" className={`control-label ${styles.signupLable}`}>Repeat Password</label>{!this.state.isPasswordSame && <span className={`${styles.wrongNameInfo}`}>Passwords different!</span>}
            <input onChange={this.handleInputChange} type="password" className="form-control" id="repeatPassword" placeholder="Repeat Password..." value={this.state.repeatPassword} />
            <span className={`glyphicon glyphicon-remove form-control-feedback form-control-feedback-img ${styles.formControlFeedbackImg}`} aria-hidden="true" />
            <span id="inputError2Status" className="sr-only">(error)</span>
          </div>

          <div className="text-right form-group"><button disabled={this.state.userName === '' || this.state.password === '' || !this.state.isPasswordSame || !this.state.isNameAvailable || !this.state.hasResult} type="submit" className="btn btn-primary">Sign Up</button></div>
        </form>
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({ user: state.user });
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  checkUserNameAvailable: username => dispatch(checkUserNameAvailable(username)),
  registerNewUser: user => dispatch(registerNewUser(user))
});
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
