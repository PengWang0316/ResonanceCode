import React, { Component } from "react";
import Navbar from "../Navbar";

import {isLogin, logout} from "../../apis/LoginApi";

import { connect } from "react-redux";
// import { loginSuccess, logoutSuccess } from "../../actions/LoginActions";

class NavContainer extends Component {

  /*componentWillMount(){
    this.props.loginSuccess(isLogin(document));  send user imformation to state
  }
*/
  render(){
    return(
      <Navbar user={isLogin(document)} handleLogout={()=>{logout(document);}} />
    );
  }

}

/*const mapStateToProps = (state, onwProps) => {  console.log("state:",state);
return {user: state.user};};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginSuccess: (user) => {dispatch(loginSuccess(user));},
    logoutSuccess: () => {dispatch(logoutSuccess());}
  }
};*/
export default NavContainer;
