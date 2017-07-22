import React, {Component} from "react";
import { Link } from "react-router-dom";
import $ from "jQuery";
// import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import LoginApi from "../apis/LoginApi";

class Login extends Component{

  // constructor(props){
  //   super(props);
  //
  // }

  componentWillMount(){
    this.state={
      username:"",
      password:""
    };
  }

  handleChange(event,inputName){
    this.setState({[inputName]: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    $("input, button").prop("disabled",true);
    DatabaseApi.login(this.state.username,this.state.password).then((user)=>{
      // console.log(user);

      // if success, go to reading page.
      if(user && user.userid){
        $("input, button").prop("disabled",false);
        LoginApi.login(document,user);
        // window.user=user;
        this.props.history.push("/reading");
      }else{
        // if fail to login clear and undisable input forms and show the warn information
        this.setState({username:"",password:""});
        $("input, button").prop("disabled",false);
        $("#loginWarnMessage").css("opacity","1");
        setTimeout(()=>{$("#loginWarnMessage").css("opacity","0");},3000);
      }
    });

  }

  render(){
    return (
      <div className="loginBackgroundContainer">

        <div key="key_login" className="loginContainer container text-right">

          <form className="loginForm" onSubmit={(event)=>{this.handleSubmit(event);}}>

              <input type="text" onChange={(event)=>{this.handleChange(event,"username");}}  id="inputUsername" value={this.state.username} placeholder="Username" />

              <input type="password" onChange={(event)=>{this.handleChange(event,"password");}} id="inputPassword" value={this.state.password} placeholder="Password" />

            <button type="submit" className="btn btn-info loginButton" disabled={!(this.state.username && this.state.password)}>Log In</button>

          </form>

            <div id="loginWarnMessage" className="float-right transition-opacity"><i className="fa fa-exclamation-triangle"></i>Username or Password Incorrect!</div>


        </div>


        {/*
        <div key="key_login" className="loginContainer container-fluid">
          <div className="loginTitle">Please Login</div>
            <form className="form-horizontal loginForm" onSubmit={(event)=>{this.handleSubmit(event);}}>
              <div className="form-group">
                <label htmlFor="inputEmail3" className="col-sm-3 control-label">Username</label>
                <div className="col-sm-9">
                  <input type="text" onChange={(event)=>{this.handleChange(event,true);}} className="form-control" id="inputUsername" value={this.state.username} placeholder="Username" /></div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword3" className="col-sm-3 control-label">Password</label>
                  <div className="col-sm-9">
                    <input type="password" onChange={(event)=>{this.handleChange(event,false);}} className="form-control" id="inputPassword" value={this.state.password} placeholder="Password" /></div>
                  </div>
                    <div className="form-group">
                      <div className="col-sm-12 text-right">
                        <button type="submit" className="btn btn-info loginButton" disabled={!(this.state.username && this.state.password)}>Sign in</button>
                      </div>
                    </div>
                  </form>
                  <div id="loginWarnMessage"><i className="fa fa-exclamation-triangle"></i>Username or Password Incorrect!</div>
            </div>
            */}


            <div className="loginCoverDiv"><img className="img-responsive" src={require("../imgs/cover.png")} alt="Cover Background" /> </div>
          </div>
      );
  }

}
export default Login;
