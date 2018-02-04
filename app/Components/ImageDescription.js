import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/ImageDescription.module.css';
import HexagramImage from './HexagramImage';
// import LoginApi from '../apis/LoginApi';

const ImageDesription = ({
  imageInfo, imageNumber, isFirstImage
}) => (
  <div>
    <div className={`${styles.briefImg}`}>
      <div className={`d-inline-block ${styles.hexagramImageDiv}`} title={`${imageInfo.image_text} (The first Hexagram number: ${imageNumber})`}>
        <HexagramImage
          imageNumber={imageNumber}
          isFirstImage={isFirstImage}
          isBlack={!isFirstImage}
        />
      </div>
      <div className={`d-inline-block ${styles.imgDes}`}>
        <div>#{imageInfo.number}   {imageInfo.image_text}  {imageInfo.chinese_name}</div>
        {/* <div className="font-bold">Wilhelm/Huang/Hintley Name</div> */}
        <div><b>{imageInfo.resonance_code_name ? imageInfo.resonance_code_name : 'Resonance Code Name'}</b></div>
      </div>
    </div>
    <div><b>{imageInfo.wilhelm_huang_hintley_name}</b></div>
  </div>
);

ImageDesription.propTypes = {
  imageInfo: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])).isRequired,
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired
};
export default ImageDesription;
