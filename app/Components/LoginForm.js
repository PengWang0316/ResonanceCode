import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { usernamePasswordLogin } from "../actions/UserActions";

class LoginForm extends Component {

  componentWillMount(){
    this.state={
      username:"",
      password:""
    };
  }

  handleChange(event, inputName){
    this.setState({[inputName]: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    // $("input, button").prop("disabled",true);
    this.setState({password:""});
    // this.props.handleSubmitCallBack(this.state.username, this.state.password); No need to use a callback function.
    this.props.usernamePasswordLogin({username: this.state.username, password: this.state.password});
  }

  render(){
    return(
      <div key="key_login" className="loginContainer container text-right">

        <form className="loginForm" onSubmit={(event)=>{this.handleSubmit(event)}}>

            <input type="text" onChange={(event)=>{this.handleChange(event,"username");}}  id="inputUsername" value={this.state.username} placeholder="Username" />

            <input type="password" onChange={(event)=>{this.handleChange(event,"password");}} id="inputPassword" value={this.state.password} placeholder="Password" />

          <button type="submit" className="btn btn-info loginButton" disabled={!(this.state.username && this.state.password)}>Log In</button>

        </form>

        <div id="loginWarnMessage" className="container text-right transition-opacity"><i className="fa fa-exclamation-triangle"></i>Username or Password Incorrect!</div>

      </div>
    );
  }

}
// LoginForm.PropTypes = {
//   handleSubmitCallBack: PropTypes.func.isRequired
// };
const mapDispatchToProps = dispatch => ({
  usernamePasswordLogin: params => dispatch(usernamePasswordLogin(params))
});
export default connect(null, mapDispatchToProps)(LoginForm);
