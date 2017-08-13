import React, { Component } from "react";
import PropTypes from "prop-types";

class ExistUserLoginForm extends Component {

  componentWillMount(){
    this.state = {
      userName: "",
      password: ""
    };
  }

  handleInputChange(event, inputName){
    this.setState({[inputName]: event.target.value});
  }

  handleLoginSubmit(event){
    event.preventDefault();
    this.setState({password:""});
    this.props.handleLoginSubmit(this.state.userName, this.state.password);
  }

  render(){
    return (
      <form className="form-horizontal" onSubmit={(event) => {this.handleLoginSubmit(event);}}>
        <div className="form-group">
          <label htmlFor="userName" className="signup-lable">User Name</label>
          <input onChange={(event)=>{this.handleInputChange(event, "userName");}} type="text" className="form-control" id="userName" placeholder="User Name..." value={this.state.userName} />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="signup-lable">Password</label>
          <input onChange={(event)=>{this.handleInputChange(event, "password");}} type="password" className="form-control" id="password" placeholder="Password..." value={this.state.password} />
        </div>
        <div className="form-group text-right">
          <button disabled={this.state.userName == "" || this.state.password == ""} type="submit" className="btn btn-info">Log In</button>
        </div>
        <div id="loginWarnMessage" className="transition-opacity"><i className="fa fa-exclamation-triangle"></i>Username Password Worry!</div>
      </form>
    );
  }

}
ExistUserLoginForm.propTypes = {
  handleLoginSubmit: PropTypes.func.isRequired
};
export default ExistUserLoginForm;
