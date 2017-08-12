import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PageNavigationButton = (props) => {
  if(props.isEmptyContent) return null;
  else {
    return (
      <div className="pageBtnDiv text-right">
        {props.startNumber>1 && <Link className="btn btn-info loginButton pageBtn" to={{
          pathname: "/reading",
          search: `?start=${props.startNumber*1-5>1?props.startNumber*1-5:1}`
        }} ><i className="fa fa-backward" />Previous</Link>}
        <Link className="btn btn-info loginButton pageBtn" to={{
          pathname: "/reading",
          search: `?start=${props.startNumber*1+5}`
        }}>Next<i className="fa fa-forward" /></Link>
      </div>
    );
  }
};
PageNavigationButton.propTypes = {
  startNumber: PropTypes.string.isRequired,
  isEmptyContent: PropTypes.bool.isRequired
};
export default PageNavigationButton;
