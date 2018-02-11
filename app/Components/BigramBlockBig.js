import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/BigramBlockBig.module.css';
import taijiBig from '../imgs/taijiBig.png';
import growthImage from '../imgs/growth.png';
import conceptionImage from '../imgs/conception.png';
import seedingImage from '../imgs/seeding.png';
import maturationImage from '../imgs/maturation.png';

const BigramBlockBig = ({ lineText, position, isLine13 }) => (
  <div className={styles.mainDiv}>
    <div className={styles.lineText}>{lineText}</div>
    <div className={styles.tbTitle}>Agency/Process - Becoming</div>
    <div className="d-flex">
      <div className={`${styles.bigramBlock} ${styles.blockBottomBorder}  ${styles.blockRightBorder} d-flex justify-content-center align-items-center`}>
        <div className={`${position === 1 ? '' : styles.unactive}`}>
          <div className={styles.bigramName}>{isLine13 ? 'Doing/\nProductive' : 'Organizing/\nExpanding'}</div>
          <div className="text-center">
            <img src={growthImage} alt="bigram" />
          </div>
        </div>
      </div>
      <div className={`${styles.bigramBlock} ${styles.blockBottomBorder} d-flex justify-content-center align-items-center`}>
        <div className={`${position === 0 ? '' : styles.unactive}`}>
          <div className={styles.bigramName}>{isLine13 ? 'Transcending/\nEmptying' : 'System Reset'}</div>
          <div className="text-center">
            <img src={conceptionImage} alt="bigram" />
          </div>
        </div>
      </div>
    </div>
    <div className="d-flex">
      <div className={`${styles.bigramBlock} ${styles.blockRightBorder} d-flex justify-content-center align-items-center`}>
        <div className={`${position === 2 ? '' : styles.unactive}`}>
          <div className={styles.bigramName}>{isLine13 ? 'Embodying/\nAttuning' : 'Accruing\nInterest'}</div>
          <div className="text-center">
            <img src={maturationImage} alt="bigram" />
          </div>
        </div>
      </div>
      <div className={`${styles.bigramBlock} d-flex justify-content-center align-items-center`}>
        <div className={`${position === 3 ? '' : styles.unactive}`}>
          <div className={styles.bigramName}>{isLine13 ? 'Composting/\nDigesting' : 'Dispensing/\nConsolidating'}</div>
          <div className="text-center">
            <img src={seedingImage} alt="bigram" />
          </div>
        </div>
      </div>
    </div>
    <div className={styles.tbTitle}>Agency/Process - Being</div>
    <img className={styles.taijiPic} src={taijiBig} alt="taiji" />
    <div className={styles.leftTitle}>Agent/Identity<br />- Being</div>
    <div className={styles.rightTitle}>Agent/Identity<br />- Becoming</div>
  </div>
);
BigramBlockBig.propTypes = {
  lineText: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  isLine13: PropTypes.bool
};
BigramBlockBig.defaultProps = { isLine13: false };
export default BigramBlockBig;
