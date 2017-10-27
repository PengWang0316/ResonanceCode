import React from 'react';
import { connect } from 'react-redux';

const UnauthenticatedUserCheck = props => (
  <div>
    {props.user.isLoaded && !props.user.isAuth &&
      <span>Unauthenticated action. Please login and try it again</span>}
    {props.user.isLoaded && props.user.isAuth && props.children}
  </div>
);
const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps, null)(UnauthenticatedUserCheck);
