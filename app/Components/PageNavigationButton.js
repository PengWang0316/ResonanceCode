import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from '../styles/PageNavigationButton.module.css';

const PageNavigationButton = ({ isEmptyContent, startNumber }) => {
  if (isEmptyContent) return null;

  return (
    <div className={`${styles.pageBtnDiv} text-right`}>
      {startNumber > 1 &&
        <Link
          className={`btn btn-info ${styles.loginButton} ${styles.pageBtn}`}
          to={{
          pathname: '/reading',
          search: `?start=${(startNumber * 1) - 5 > 1 ? (startNumber * 1) - 5 : 1}`
        }}
        ><i className="fa fa-backward" />Previous
        </Link>}
      <Link
        className={`btn btn-info ${styles.loginButton} ${styles.pageBtn}`}
        to={{
          pathname: '/reading',
          search: `?start=${(startNumber * 1) + 5}`
        }}
      >Next<i className="fa fa-forward" />
      </Link>
    </div>
  );
};
PageNavigationButton.propTypes = {
  startNumber: PropTypes.string.isRequired,
  isEmptyContent: PropTypes.bool.isRequired
};
export default PageNavigationButton;
