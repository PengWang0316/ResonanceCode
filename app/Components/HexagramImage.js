import React from 'react';
import PropTypes from 'prop-types';

import { getHexagramImageClassNamesArray, getHexagramBlackImageClassNamesArray } from '../apis/Util';
import styles from '../styles/HexagramImage.module.css';

const HexagramImage = ({
  isBlack, imageNumber, isFirstImage, isSmall
}) => {
  const image = isBlack ?
    getHexagramBlackImageClassNamesArray(imageNumber, isFirstImage) :
    getHexagramImageClassNamesArray(imageNumber, isFirstImage);
  // console.log(isFirstImage);
  // console.log(image);
  return (
    <div className="d-inline-block">
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[5].side]} ${styles.smallLine}` : `${styles[image[5].side]}`} /><div className={isSmall ? `${styles[image[5].middle]} ${styles.smallMiddleLine}` : `${styles[image[5].middle]}`} /><div className={isSmall ? `${styles[image[5].side]} ${styles.smallLine}` : `${styles[image[5].side]}`} /></div>
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[4].side]} ${styles.smallLine}` : `${styles[image[4].side]}`} /><div className={isSmall ? `${styles[image[4].middle]} ${styles.smallMiddleLine}` : `${styles[image[4].middle]}`} /><div className={isSmall ? `${styles[image[4].side]} ${styles.smallLine}` : `${styles[image[4].side]}`} /></div>
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[3].side]} ${styles.smallLine}` : `${styles[image[3].side]}`} /><div className={isSmall ? `${styles[image[3].middle]} ${styles.smallMiddleLine}` : `${styles[image[3].middle]}`} /><div className={isSmall ? `${styles[image[3].side]} ${styles.smallLine}` : `${styles[image[3].side]}`} /></div>
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[2].side]} ${styles.smallLine}` : `${styles[image[2].side]}`} /><div className={isSmall ? `${styles[image[2].middle]} ${styles.smallMiddleLine}` : `${styles[image[2].middle]}`} /><div className={isSmall ? `${styles[image[2].side]} ${styles.smallLine}` : `${styles[image[2].side]}`} /></div>
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[1].side]} ${styles.smallLine}` : `${styles[image[1].side]}`} /><div className={isSmall ? `${styles[image[1].middle]} ${styles.smallMiddleLine}` : `${styles[image[1].middle]}`} /><div className={isSmall ? `${styles[image[1].side]} ${styles.smallLine}` : `${styles[image[1].side]}`} /></div>
      <div className={isSmall ? `${styles.imageLine} ${styles.smallImageLine}` : `${styles.imageLine}`}><div className={isSmall ? `${styles[image[0].side]} ${styles.smallLine}` : `${styles[image[0].side]}`} /><div className={isSmall ? `${styles[image[0].middle]} ${styles.smallMiddleLine}` : `${styles[image[0].middle]}`} /><div className={isSmall ? `${styles[image[0].side]} ${styles.smallLine}` : `${styles[image[0].side]}`} /></div>
    </div>

  );
};
HexagramImage.propTypes = {
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired,
  isBlack: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool
};
HexagramImage.defaultProps = { isSmall: false };
export default HexagramImage;
