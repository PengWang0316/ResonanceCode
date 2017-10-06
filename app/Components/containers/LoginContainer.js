import React, { Component } from "react";
// import { connect } from "react-redux";
import { login } from "../../apis/DatabaseApi"; // Deprecated using UserAction instead
import LoginApi from "../../apis/LoginApi"; // Deprecated using UserAction instead
// import { loginSuccess } from "../../actions/LoginActions";
import LoginCoveImage from "../LoginCoverImage";
import LoginForm from "../LoginForm";
import { connect } from "react-redux";
import { checkAuthentication } from "../../actions/UserActions";

class LoginContainer extends Component {

  componentWillMount(){
    this.props.checkAuthentication(); // Checking the authentication
  }

  componentWillReceiveProps(nextProps){
    /*Pushing to the reading page after login*/
    console.log(nextProps.user);
    if(nextProps.user.isAuth) this.props.history.push("/reading");
    else if (nextProps.user.loginErr) {
      $("#loginWarnMessage").css("opacity","1");
      setTimeout( _ => {$("#loginWarnMessage").css("opacity","0");},3000);
    }
  }

  /* No need anymore. Moving to UserActions
    handleLoginFormSubmit(username, password){
    // console.log(username, password);
    login(username, password).then((user)=>{
      // console.log(user);
      $("input, button").prop("disabled",false);
      // if success, go to reading page.
      if(user && user.userid){
        LoginApi.login(document,user); // Saving the user to cookie in order to visit in other pages

        this.props.history.push("/reading");
      }else{
        // if fail to login clear and undisable input forms and show the warn information
        $("#loginWarnMessage").css("opacity","1");
        setTimeout( _ => {$("#loginWarnMessage").css("opacity","0");},3000);
      }
    });

  }
*/
  render(){
    return (
      <div className="loginBackgroundContainer">
        <LoginForm />
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
const mapStateToProps = state => ({user: state.user});
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication())
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
