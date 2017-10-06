import React, { Component } from "react";
import SignUpForm from "../SignUpForm";
import ExistUserLoginForm from "../ExistUserLoginForm";
import LoginApi from "../../apis/LoginApi";
import { isUserNameAvailable, createNewUser, login } from "../../apis/DatabaseApi";
import { connect } from "react-redux";

import "../../styles/FontEXO.css" // Google font font-family: 'Exo', sans-serif;

class SignUpContainer extends Component {

  checkUserNameCallback(name, callbackFunction){
    isUserNameAvailable(name).then((result)=>{
      callbackFunction(result.data);
    });
  }

  handleRegisterSubmitCallback(userName, password){
    createNewUser({username: userName, password: password}).then((result)=>{
      LoginApi.login(document, {username: result.data.username, password: result.data.password, userid: result.data._id, role: result.data.role});
      this.props.history.push("/reading");
    });
  }

  componentWillReceiveProps(nextProps){
    /*Pushing to the reading page after login*/
    if(nextProps.user.isAuth) this.props.history.push("/reading");
    else if (nextProps.user.loginErr) {
      $("#loginWarnMessage").css("opacity","1");
      setTimeout( _ => {$("#loginWarnMessage").css("opacity","0");},3000);
    }
  }
/* Using UserAction instead
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
*/
  render(){
    return (
      <div className="loginBackgroundContainer">
        <div className="addReadingDiv">
          <div className="signup-div">
            <SignUpForm handleRegisterSubmit = {(userName, password) => this.handleRegisterSubmitCallback(userName, password)} checkUserName = {(name, callbackFunction) => this.checkUserNameCallback(name, callbackFunction)} />
            <div className="text-center signup-title exsit-title">or</div>
            <div className="text-center signup-title">Exist User Login</div>
            <ExistUserLoginForm />
          </div>
        </div>
      </div>
    );
  }

}
const mapStateToProps = state => ({user: state.user});
/*};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};*/
export default connect(mapStateToProps, null)(SignUpContainer);
