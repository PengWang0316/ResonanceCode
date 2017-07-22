import React, { Component } from "react";
import DatabaseApi from "../apis/DatabaseApi";
import LoginApi from "../apis/LoginApi";
import { isUserNameAvailable, createNewUser } from "../apis/DatabaseApi";
import "../styles/FontEXO.css" // Google font font-family: 'Exo', sans-serif;

class SignUp extends Component{

  componentWillMount(){
    this.state = {
      userName: "",
      password: "",
      repeatPassword: "",
      loginUserName: "",
      loginPassword: "",
      isPasswordSame: true,
      isNameAvailable: false,
      isChecking: false,
      hasResult: false
    };
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

  // set delay 1 second for checking database.
  checkUserName(userName){
    // Clearing the previous checkUserName function
    if(this.checkUserNameFunction) clearTimeout(this.checkUserNameFunction);
    this.checkUserNameFunction = setTimeout(()=>{
      this.setState({isChecking: true, hasResult: false});
      isUserNameAvailable(userName).then((result)=>{
        console.log(result.data);
        this.setState({isChecking: false, hasResult: true, isNameAvailable: result.data});
      });
    }, 1000);

  }

  handleRegisterSubmit(event){
    event.preventDefault();
    createNewUser({username: this.state.userName, password: this.state.password}).then((user)=>{
      LoginApi.login(document,user);
      this.props.history.push("/reading");
    });
  }

  handleLoginSubmit(event){
    event.preventDefault();
    DatabaseApi.login(this.state.loginUserName, this.state.loginPassword).then((user)=>{
      // if success, go to reading page.
      if(user && user.userid){
        // $("input, button").prop("disabled",false);
        LoginApi.login(document,user);
        // window.user=user;
        this.props.history.push("/reading");
      }else{
        // if fail to login clear and undisable input forms and show the warn information
        this.setState({loginPassword:""});
        // $("input, button").prop("disabled",false);
        $("#loginWarnMessage").css("opacity","1");
        setTimeout(()=>{$("#loginWarnMessage").css("opacity","0");},3000);
      }
    });
  }

  render(){
    return(
      <div className="loginBackgroundContainer">

        <div className="addReadingDiv">

          <div className="signup-div">
            <div className="text-center signup-title">New User Sign Up</div>
            <form className="form-horizontal" onSubmit={(event) => {this.handleRegisterSubmit(event);}}>

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

              <div className="text-right form-group"><button disabled={this.state.userName == "" || this.state.password=="" || !this.state.isPasswordSame || !this.state.isNameAvailable} type="submit" className="btn btn-primary">Sign Up</button></div>
            </form>

            <div className="text-center signup-title exsit-title">or</div>
            <div className="text-center signup-title">Exsit User Login</div>

            <form className="form-horizontal" onSubmit={(event) => {this.handleLoginSubmit(event);}}>
              <div className="form-group">
                <label htmlFor="loginUserName" className="signup-lable">User Name</label>
                <input onChange={(event)=>{this.handleInputChange(event, "loginUserName");}} type="text" className="form-control" id="loginUserName" placeholder="User Name..." value={this.state.loginUserName} />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword" className="signup-lable">Password</label>
                <input onChange={(event)=>{this.handleInputChange(event, "loginPassword");}} type="password" className="form-control" id="loginPassword" placeholder="Password..." value={this.state.loginPassword} />
              </div>
              <div className="form-group text-right">
                <button disabled={this.state.loginUserName == "" || this.state.loginPassword == ""} type="submit" className="btn btn-info">Log In</button>
              </div>
              <div id="loginWarnMessage" className="transition-opacity"><i className="fa fa-exclamation-triangle"></i>Username Password Worry!</div>
            </form>


          </div>

        </div>

      </div>
    );
  }

}
export default SignUp;
