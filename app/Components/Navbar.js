import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as logoImage from '../imgs/logo.png';
import * as facebookLogin from '../imgs/facebookLogin.png';
import * as googleLogin from '../imgs/googleLogin.png';
import * as signupButton from '../imgs/signup.png';
import { logout } from '../actions/UserActions';
import { API_FACEBOOK_LOGIN, API_GOOGLE_LOGIN } from '../actions/ApiUrls';

const Navbar = ({ user, userLogout }) => (
  <nav className="navbar navbar-expand-md navbar-light bg-light">
    <div className="container">
      <NavLink activeClassName="navbar-brand" to="/"><img src={logoImage.default} alt="KairoScope" title="KairoScope" /></NavLink>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>


      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <div className="container-fluid d-flex justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/reading">YOUR READINGS</NavLink></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">SEARCH </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/readingSearch">SEARCH READINGS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/hexagramsSearch">SEARCH HEXAGRAMS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to={{ pathname: '/unattachedJournals', search: '?readingName=Unattached Journals' }}>UNATTACHED JOURNALS</NavLink>
              </div>
            </li>

            <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/help">HELP</NavLink></li>

            {!user.isAuth &&
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="socialLoginDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">SOCIAL LOGIN </a>
                <div className="dropdown-menu" aria-labelledby="socialLoginDropdown">
                  <a className="nav-link dropdown-item" href={API_FACEBOOK_LOGIN}><img alt="Facebook login button" src={facebookLogin.default} /></a>
                  <a className="nav-link dropdown-item" href={API_GOOGLE_LOGIN}><img alt="Google login button" src={googleLogin.default} /></a>
                  <NavLink className="nav-link dropdown-item" activeClassName="active" to="/signup"><img alt="Signup button" src={signupButton.default} /></NavLink>
                </div>
              </li>
            }


            {user.isAuth &&
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="signoutDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{user.photo && <img alt="User Avatar" className="avatar-photo" src={user.photo} />}
                  {!user.photo && <i className="fa fa-user-circle" aria-hidden="true" />} {user.displayName}
                </a>
                <div className="dropdown-menu" aria-labelledby="signoutDropdown">
                  <NavLink className="nav-link" activeClassName="active" to="/settings">SETTINGS</NavLink>
                  <NavLink className="nav-link" activeClassName="active" to="/" onClick={userLogout}>LOGOUT</NavLink>
                </div>
              </li>
            }

          </ul>
        </div>

      </div>

    </div>
  </nav>

);
const mapStateToProps = state => ({
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  userLogout: _ => dispatch(logout())
});
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
