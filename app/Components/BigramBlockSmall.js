import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/BigramBlockSmall.module.css';
import taijiSmall from '../imgs/taijiSmall.png';

const BigramBlockSmall = ({ lineText, position }) => (
  <div className="mr-4">
    <img className={styles.taijiPic} src={taijiSmall} alt="taiji" />
    <div className="d-flex">
      <div className={`${styles.bigramBlock} ${styles.blockBottomBorder}  ${styles.blockRightBorder} ${position === 1 ? styles.selected : ''}`} /><div className={`${styles.bigramBlock} ${styles.blockBottomBorder} ${position === 0 ? styles.selected : ''}`} />
    </div>
    <div className="d-flex">
      <div className={`${styles.bigramBlock} ${styles.blockRightBorder} ${position === 2 ? styles.selected : ''}`} /><div className={`${styles.bigramBlock} ${position === 3 ? styles.selected : ''}`} />
    </div>
    <div className={styles.lineText}>{lineText}</div>
  </div>
);
BigramBlockSmall.propTypes = {
  lineText: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired
};
export default BigramBlockSmall;
