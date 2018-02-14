import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/ImageDescription.module.css';
import HexagramImage from './HexagramImage';
// import LoginApi from '../apis/LoginApi';

const ImageDescription = ({
  imageInfo, imageNumber, isFirstImage, isBlack
}) => (
  <div>
    <div className={styles.titleCodeName}>Hexagram #{imageInfo.number}&nbsp;&nbsp;{imageInfo.resonance_code_name ? imageInfo.resonance_code_name : 'Resonance Code Name'}</div>
    <div className={styles.briefImg}>
      <div className={`d-inline-block ${styles.hexagramImageDiv}`} title={`${imageInfo.image_text} (The first Hexagram number: ${imageNumber})`}>
        <HexagramImage
          imageNumber={imageNumber}
          isFirstImage={isFirstImage}
          isBlack={isBlack || !isFirstImage}
        />
      </div>
      <div className={`d-inline-block ${styles.imgDes}`}>
        <div className="font-weight-bold">Image: {imageInfo.image_text}</div>
        {/* <div className="font-bold">Wilhelm/Huang/Hintley Name</div> */}
        <div className="font-weight-bold">I-Ching: {imageInfo.wilhelm_huang_hintley_name}</div>
      </div>
    </div>
  </div>
);

ImageDescription.propTypes = {
  imageInfo: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ])).isRequired,
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired,
  isBlack: PropTypes.bool
};
ImageDescription.defaultProps = {
  isBlack: false
};
export default ImageDescription;
