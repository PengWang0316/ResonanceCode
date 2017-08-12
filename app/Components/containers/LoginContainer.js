import React, { Component } from "react";
// import { connect } from "react-redux";
import { login } from "../../apis/DatabaseApi";
import LoginApi from "../../apis/LoginApi";
import $ from "jQuery";

// import { loginSuccess } from "../../actions/LoginActions";
import LoginCoveImage from "../LoginCoverImage";

import LoginForm from "../LoginForm";

class LoginContainer extends Component {

  handleLoginFormSubmit(username, password){
    // console.log(username, password);
    login(username, password).then((user)=>{
      // console.log(user);
      $("input, button").prop("disabled",false);
      // if success, go to reading page.
      if(user && user.userid){
        LoginApi.login(document,user); // Saving the user to cookie in order to visit in other pages
        /*this.props.loginSuccess(user); // Calling redux action*/
        // window.user=user;
        this.props.history.push("/reading");
      }else{
        // if fail to login clear and undisable input forms and show the warn information
        $("#loginWarnMessage").css("opacity","1");
        setTimeout(()=>{$("#loginWarnMessage").css("opacity","0");},3000);
      }
    });

  }

  render(){
    return (
      <div className="loginBackgroundContainer">
        <LoginForm handleSubmitCallBack={(event, username, password) => this.handleLoginFormSubmit(event, username, password)} />
        <LoginCoveImage />
      </div>
    );
  }

}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.user
//   };
// };
/*const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginSuccess: (user) => {dispatch(loginSuccess(user));}
  };
};*/
export default LoginContainer;
