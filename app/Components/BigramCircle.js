import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/BigramCircle.module.css';
import growthImage from '../imgs/growth.png';
import conceptionImage from '../imgs/conception.png';
import seedingImage from '../imgs/seeding.png';
import maturationImage from '../imgs/maturation.png';

const BigramCircle = ({ circlePosition, linePoint, isBrown }) => {
  // Start to calculate styles for divs
  let {
    firstDiv, secondDiv, thirdDiv, fourthDiv
  } = styles;
  switch (linePoint) {
    case 1:
      firstDiv = `${firstDiv} ${styles.emphasizedZero}`;
      break;
    case 3:
      fourthDiv = `${fourthDiv} ${styles.emphasizedOne}`;
      break;
    case 2:
      thirdDiv = `${thirdDiv} ${styles.emphasizedTwo}`;
      firstDiv = `${firstDiv} ${styles.cancelBottomBorder}`;
      fourthDiv = `${fourthDiv} ${styles.cancelLeftBorder}`;
      break;
    default:
      firstDiv = `${firstDiv} ${styles.cancelRightBorder}`;
      fourthDiv = `${fourthDiv} ${styles.cancelTopBorder}`;
      secondDiv = `${secondDiv} ${styles.emphasizedThree}`;
      break;
  }
  if (isBrown) {
    firstDiv = `${firstDiv} ${styles.brownBorder}`;
    secondDiv = `${secondDiv} ${styles.brownBorder}`;
    thirdDiv = `${thirdDiv} ${styles.brownBorder}`;
    fourthDiv = `${fourthDiv} ${styles.brownBorder}`;
  }
  return (
    <div className={isBrown ? `${styles[`circle-${circlePosition}`]} ${styles.brownBorder}` : styles[`circle-${circlePosition}`]}>
      <div className={`${styles.internalDiv} d-flex`}>
        <div className={firstDiv}>
          <img style={{ opacity: linePoint === 1 ? 1 : 0.4 }} src={growthImage} alt="growth" />
        </div>
        <div className={secondDiv}>
          <img style={{ opacity: linePoint === 0 ? 1 : 0.4 }} src={conceptionImage} alt="conception" />
        </div>
      </div>
      <div className={`${styles.internalDiv} d-flex`}>
        <div className={thirdDiv}>
          <img style={{ opacity: linePoint === 2 ? 1 : 0.4 }} src={maturationImage} alt="maturation" />
        </div>
        <div className={fourthDiv}>
          <img style={{ opacity: linePoint === 3 ? 1 : 0.4 }} src={seedingImage} alt="seeding" />
        </div>
      </div>
    </div>
  );
};
BigramCircle.propTypes = {
  circlePosition: PropTypes.string.isRequired,
  linePoint: PropTypes.number.isRequired,
  isBrown: PropTypes.bool
};
BigramCircle.defaultProps = { isBrown: false };
export default BigramCircle;
