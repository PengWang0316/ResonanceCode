import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkUserNameAvailable } from "../actions/UserActions";

class SignUpForm extends Component {

  componentWillMount(){
    this.state = {
      userName: "",
      password: "",
      repeatPassword: "",
      isPasswordSame: true,
      isNameAvailable: false,
      isChecking: false,
      hasResult: false
    };
  }

  checkUserName(username){
    this.setState({hasResult: false}); // lock the submit button when content was changed
    // Clearing the previous checkUserName function
    if(this.checkUserNameFunction) clearTimeout(this.checkUserNameFunction);
    this.checkUserNameFunction = setTimeout(()=>{
      this.setState({isChecking: true});
      // console.log("username: ", username);
      this.props.checkUserNameAvailable(username);
      /*this.props.checkUserName(username, result => {
        this.setState({isChecking: false, hasResult: true, isNameAvailable: result});
      });*/

    }, 1000);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.user.isChecked) this.setState({isChecking: false, hasResult: true, isNameAvailable: nextProps.user.isUsernameAvailable});
  }

  handleInputChange(event, inputName){
    // comparing two passwords
    if(inputName == "password") this.setState({isPasswordSame: event.target.value == this.state.repeatPassword});
    else if(inputName == "repeatPassword") this.setState({isPasswordSame: event.target.value == this.state.password});

    // Checking availability for user name
    if(inputName == "userName") this.checkUserName(event.target.value);

    this.setState({
      [inputName]: event.target.value
    });
  }

  render(){
    return (
      <div>
        <div className="text-center signup-title">New User Sign Up</div>
        <form className="form-horizontal" onSubmit={(event) => {event.preventDefault(); this.props.handleRegisterSubmit(this.state.userName, this.state.password);}}>

          <div className={this.state.userName!="" && !this.state.isNameAvailable && this.state.hasResult ? "form-group has-error has-feedback" : "form-group"}>
            <label htmlFor="userName" className="control-label signup-lable">User Name</label>{this.state.isChecking && <i className="fa fa-spinner fa-spin" />}{this.state.userName!="" && !this.state.isNameAvailable && this.state.hasResult && <span className="wrong_name_info">Name not available!</span>}
            <input onChange={(event)=>{this.handleInputChange(event, "userName");}} type="text" className="form-control" id="userName" placeholder="User Name..." value={this.state.userName}  aria-describedby="inputError2Status" />
            <span className="glyphicon glyphicon-remove form-control-feedback form-control-feedback-img" aria-hidden="true"></span>
            <span id="inputError2Status" className="sr-only">(error)</span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="signup-lable">Password</label>
            <input onChange={(event)=>{this.handleInputChange(event, "password");}} type="password" className="form-control" id="password" placeholder="Password..." value={this.state.password} />
          </div>

          <div className={this.state.isPasswordSame ? "form-group" : "form-group has-error has-feedback"}>
            <label htmlFor="repeatPassword" className="control-label signup-lable">Repeat Password</label>{!this.state.isPasswordSame && <span className="wrong_name_info">Passwords different!</span>}
            <input onChange={(event)=>{this.handleInputChange(event, "repeatPassword");}} type="password" className="form-control" id="repeatPassword" placeholder="Repeat Password..." value={this.state.repeatPassword} />
            <span className="glyphicon glyphicon-remove form-control-feedback form-control-feedback-img" aria-hidden="true"></span>
            <span id="inputError2Status" className="sr-only">(error)</span>
          </div>

          <div className="text-right form-group"><button disabled={this.state.userName == "" || this.state.password=="" || !this.state.isPasswordSame || !this.state.isNameAvailable || !this.state.hasResult} type="submit" className="btn btn-primary">Sign Up</button></div>
        </form>
      </div>
    );
  }

}
SignUpForm.propTypes = {
  handleRegisterSubmit: PropTypes.func.isRequired,
  checkUserNameAvailable: PropTypes.func.isRequired
};
const mapStateToProps = state => ({user: state.user});
const mapDispatchToProps = dispatch => ({
  checkUserNameAvailable: username => dispatch(checkUserNameAvailable(username))
});
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
