// import $ from 'jquery';
// window.jQuery = $;
// window.$ = $;
// global.jQuery = $;
// var bootstrap = require('bootstrap');
import React from "react";
import { NavLink } from "react-router-dom";
import LoginApi from "../apis/LoginApi";

const Nav=()=>{

  let user=LoginApi.isLogin(document);
  // console.log("Nav:", user);
  return(
    <nav className="navbar navbar-default navbar-fixed-top">
      <div id="navContainer">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/reading"><b>YOUR ICON</b></a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

          <ul className="nav navbar-nav navbar-right">
            <li><NavLink activeClassName="active" to="/reading">READING</NavLink></li>
            <li><NavLink activeClassName="active" to="/hexagramsSearch">HEXAGRAMS</NavLink></li>
            <li><NavLink activeClassName="active" to="/help">HELP</NavLink></li>
            {user && <li onClick={()=>{LoginApi.logout(document);}}><NavLink activeClassName="active" to="/">LOGOUT</NavLink></li>}
          </ul>
          <form className="navbar-form navbar-right">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Reading Name..." />
              <div className="input-group-btn">
              <button className="btn btn-default green-btn" type="submit">
                <i className="glyphicon glyphicon-search color-white"></i>
              </button>
              </div>
              </div>
          </form>
        </div>
      </div>
    </nav>
  );

};

export default Nav;
