import React, { Component } from "react";
import SignUpForm from "../SignUpForm";
import ExistUserLoginForm from "../ExistUserLoginForm";
import LoginApi from "../../apis/LoginApi";
import { isUserNameAvailable, createNewUser, login } from "../../apis/DatabaseApi";

import "../../styles/FontEXO.css" // Google font font-family: 'Exo', sans-serif;

class SignUpContainer extends Component {

  checkUserNameCallback(name, callbackFunction){
    isUserNameAvailable(name).then((result)=>{
      callbackFunction(result.data);
    });
  }

  handleRegisterSubmitCallback(userName, password){
    createNewUser({username: userName, password: password}).then((result)=>{
      LoginApi.login(document, {username: result.data.username, password: result.data.password, userid: result.data._id});
      this.props.history.push("/reading");
    });
  }

  handleLoginSubmitCallback(username, password){
    login(username, password).then((user)=>{
      // if success, go to reading page.
      if(user && user.userid){
        LoginApi.login(document,user);
        this.props.history.push("/reading");
      }else{
        $("#loginWarnMessage").css("opacity","1");
        setTimeout(()=>{$("#loginWarnMessage").css("opacity","0");},3000);
      }
    });
  }

  render(){
    return (
      <div className="loginBackgroundContainer">
        <div className="addReadingDiv">
          <div className="signup-div">
            <SignUpForm handleRegisterSubmit = {(userName, password) => this.handleRegisterSubmitCallback(userName, password)} checkUserName = {(name, callbackFunction) => this.checkUserNameCallback(name, callbackFunction)} />
            <div className="text-center signup-title exsit-title">or</div>
            <div className="text-center signup-title">Exist User Login</div>
            <ExistUserLoginForm handleLoginSubmit = {(username, password) => this.handleLoginSubmitCallback(username, password)} />
          </div>
        </div>
      </div>
    );
  }

}
/*const mapStateToProps = (state, ownProps) => {
  return {

  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};*/
export default SignUpContainer;
