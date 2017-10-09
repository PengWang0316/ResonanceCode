import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as logoImage from '../imgs/logo.png';
import { logout } from '../actions/UserActions';

const Navbar = props => (
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
            {!props.user.isAuth && <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/signup">SIGN UP</NavLink></li>}
            {props.user.isAuth && <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/" onClick={_ => props.logout()}>LOGOUT</NavLink></li>}
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
  logout: _ => dispatch(logout())
});
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
