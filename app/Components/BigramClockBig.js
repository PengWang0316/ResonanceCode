import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/BigramClockBig.module.css';
import needleBig from '../imgs/needleBig.png';
import growthImage from '../imgs/growth.png';
import conceptionImage from '../imgs/conception.png';
import seedingImage from '../imgs/seeding.png';
import maturationImage from '../imgs/maturation.png';

const imgStyles = {
  0: styles.needle0,
  1: styles.needle1,
  2: styles.needle2,
  3: styles.needle3
};

const BigramClockBig = ({ lineText, position }) => (
  <div className={styles.mainDiv}>
    <div className={styles.lineText}>{lineText}</div>
    <div className="text-center">
      <div className={styles.bigramName}>Potentiation</div>
      <div><img src={conceptionImage} alt="Potentiation" /></div>

      <div className="d-flex justify-content-center">
        <div className={styles.circleBig}>
          <div className={styles.growthDiv}>
            <div><img src={growthImage} alt="Growth" /></div>
            <div className={styles.bigramName}>Growth</div>
          </div>
          <div className={styles.reSourcingDiv}>
            <div><img src={seedingImage} alt="Re-Sourcing" /></div>
            <div className={styles.bigramName}>Re-Sourcing</div>
          </div>
          <img src={needleBig} alt="needle" className={imgStyles[position]} />
        </div>
      </div>

      <div><img src={maturationImage} alt="Maturation" /></div>
      <div className={styles.bigramName}>Maturation</div>

    </div>
  </div>
);
BigramClockBig.propTypes = {
  lineText: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired
};
export default BigramClockBig;
