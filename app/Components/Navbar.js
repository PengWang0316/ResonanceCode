import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import logoImage from '../imgs/logo.png';
import facebookLogin from '../imgs/facebookLogin.png';
import googleLogin from '../imgs/googleLogin.png';
import signupButton from '../imgs/signup.png';
import { logout } from '../actions/UserActions';
import { API_FACEBOOK_LOGIN, API_GOOGLE_LOGIN } from '../actions/ApiUrls';

export const Navbar = ({ user, userLogout }) => (
  <nav className="navbar navbar-expand-md navbar-light bg-light">
    <div className="container">
      <NavLink activeClassName="navbar-brand" to="/"><img src={logoImage} alt="KairoScope" title="KairoScope" /></NavLink>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>


      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <div className="container-fluid d-flex justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="readingsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">READINGS </a>
              <div className="dropdown-menu" aria-labelledby="readingsDropdown">
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/reading">YOUR READINGS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/sharedReadings">SHARED READINGS</NavLink>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">SEARCH </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/readingSearch">SEARCH READINGS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to="/hexagramsSearch">SEARCH HEXAGRAMS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to={{ pathname: '/allJournal' }}>ATTACHED JOURNALS</NavLink>
                <NavLink className="nav-link dropdown-item" activeClassName="active" to={{ pathname: '/unattachedJournals', search: '?readingName=Unattached Journals' }}>UNATTACHED JOURNALS</NavLink>
              </div>
            </li>

            <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/hexagramList">HEXAGRAMS</NavLink></li>

            <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/help">HELP</NavLink></li>

            {!user.isAuth &&
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="socialLoginDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">SOCIAL LOGIN </a>
                <div className="dropdown-menu" aria-labelledby="socialLoginDropdown">
                  <a className="nav-link dropdown-item" href={API_FACEBOOK_LOGIN}><img alt="Facebook login button" src={facebookLogin} /></a>
                  <a className="nav-link dropdown-item" href={API_GOOGLE_LOGIN}><img alt="Google login button" src={googleLogin} /></a>
                  <NavLink className="nav-link dropdown-item" activeClassName="active" to="/signup"><img alt="Signup button" src={signupButton} /></NavLink>
                </div>
              </li>
            }

            {user.isAuth &&
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="signoutDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{user.photo && <img alt="User Avatar" className="avatar-photo" src={user.photo} />}
                  {!user.photo && <i className="fa fa-user-circle" aria-hidden="true" />} {user.displayName}
                </a>
                <div className="dropdown-menu" aria-labelledby="signoutDropdown">
                  <NavLink className="nav-link dropdown-item" activeClassName="active" to="/settings">SETTINGS</NavLink>
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
Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  userLogout: PropTypes.func.isRequired
};
/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  userLogout: _ => dispatch(logout())
});
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Navbar);
