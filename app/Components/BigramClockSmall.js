import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/BigramClockSmall.module.css';
import needleSmall from '../imgs/needleSmall.png';

const imgStyles = {
  0: styles.needle0,
  1: styles.needle1,
  2: styles.needle2,
  3: styles.needle3
};

const BigramClockSmall = ({ lineText, position }) => (
  <div className="mr-3">
    <div className={styles.circleSmall}><img className={imgStyles[position]} src={needleSmall} alt="needleSmall" /></div>
    <div className={styles.lineText}>{lineText}</div>
  </div>
);
BigramClockSmall.propTypes = {
  lineText: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired
};
export default BigramClockSmall;
