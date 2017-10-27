import React from 'react';
import PropTypes from 'prop-types';

import { getHexagramImageClassNamesArray, getHexagramBlackImageClassNamesArray } from '../apis/Util';

const HexagramImage = ({ isBlack, imageNumber, isFirstImage }) => {
  const image = isBlack ?
    getHexagramBlackImageClassNamesArray(imageNumber, isFirstImage) :
    getHexagramImageClassNamesArray(imageNumber, isFirstImage);
  // console.log(isFirstImage);
  // console.log(image);
  return (
    <div className="inlineBlock">
      <div className="image-line"><div className={image[5].side} /><div className={image[5].middle} /><div className={image[5].side} /></div>
      <div className="image-line"><div className={image[4].side} /><div className={image[4].middle} /><div className={image[4].side} /></div>
      <div className="image-line"><div className={image[3].side} /><div className={image[3].middle} /><div className={image[3].side} /></div>
      <div className="image-line"><div className={image[2].side} /><div className={image[2].middle} /><div className={image[2].side} /></div>
      <div className="image-line"><div className={image[1].side} /><div className={image[1].middle} /><div className={image[1].side} /></div>
      <div className="image-line"><div className={image[0].side} /><div className={image[0].middle} /><div className={image[0].side} /></div>
    </div>

  );
};
HexagramImage.propTypes = {
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired,
  isBlack: PropTypes.bool.isRequired
};
export default HexagramImage;
