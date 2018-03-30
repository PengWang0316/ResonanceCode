import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/Bigram.module.css';
import bigramBackground1 from '../imgs/bigramBackground1.jpg';
import bigramBackground2 from '../imgs/bigramBackground2.jpg';
import bigramBackground3 from '../imgs/bigramBackground3.jpg';
import bigramBackground4 from '../imgs/bigramBackground4.jpg';
import BigramCircle from './BigramCircle';
import BigramLine from './BigramLine';

const bigramBackground = {
  0: bigramBackground1,
  1: bigramBackground2,
  2: bigramBackground3,
  3: bigramBackground4
};
const bigramPosition = {
  0: ['leftMiddle', 'rightMiddle'],
  1: ['leftBottom', 'rightCenter'],
  2: ['left', 'right'],
  3: ['leftCenter', 'rightBottom']
};
const titlePosition = {
  0: [styles.titleTopLeft, styles.titleTopRight],
  1: [styles.titleBottomLeftA, styles.titleTopRightA],
  2: [styles.titleBottomLeft, styles.titleBottomRight],
  3: [styles.titleTopLeft, styles.titleBottomRight]
};
const bigramInfo = {
  0: [false, false, 'Taking Priority', 'Taking Priority'],
  1: [false, true, 'Giving Priority', 'Taking Priority'],
  2: [true, true, 'Giving Priority', 'Giving Priority'],
  3: [true, false, 'Taking Priority', 'Taking Priority']
};

/**
 * This component will use the information of line25 to decide where to show the arrows and lines' information.
 * Line's indicator 0: two solid lines  1: broken and solid   2: two brokens  3: solid and brokens
 *
 * The information of line46 will be used to show left circle.
 * The information of line13 will be used to show right circle.
*/

const Bigram = ({
  line25, line46, line13, isSimple
}) => (
  <div className="text-center">
    <img className={styles.bigramImg} src={bigramBackground[line25]} alt="Bigram background" />
    <BigramCircle circlePosition={bigramPosition[line25][0]} linePoint={line46} />
    <BigramCircle circlePosition={bigramPosition[line25][1]} linePoint={line13} isBrown />
    {!isSimple && <div className={`${titlePosition[line25][0]} d-flex align-items-center`}>Line 5:&nbsp;&nbsp; <BigramLine isBroken={bigramInfo[line25][0]} />&nbsp;&nbsp;{bigramInfo[line25][2]}</div>}
    {!isSimple && <div className={`${titlePosition[line25][1]} d-flex align-items-center`}>Line 2:&nbsp;&nbsp;<BigramLine isBroken={bigramInfo[line25][1]} />&nbsp;&nbsp;{bigramInfo[line25][3]}</div>}
  </div>
);
Bigram.propTypes = {
  line25: PropTypes.number.isRequired,
  line46: PropTypes.number.isRequired,
  line13: PropTypes.number.isRequired,
  isSimple: PropTypes.bool
};
Bigram.defaultProps = { isSimple: false };
export default Bigram;
