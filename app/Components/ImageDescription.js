import React from 'react';
import PropTypes from 'prop-types';
import HexagramImage from './HexagramImage';
// import LoginApi from '../apis/LoginApi';

const ImageDecription = ({
  imageInfo, imageNumber, isFirstImage, isShowRc
}) => (
  <div>
    <div className="briefImg">
      <div className="inlineBlock hexagramImageDiv" title={`${imageInfo.image_text} (The first Hexagram number: ${imageNumber})`}>
        <HexagramImage
          imageNumber={imageNumber}
          isFirstImage={isFirstImage}
          isBlack={!isFirstImage}
        />
      </div>
      <div className="inlineBlock imgDes">
        <div>#{imageInfo.number}   {imageInfo.image_text}  {imageInfo.chinese_name}</div>
        {/* <div className="font-bold">Wilhelm/Huang/Hintley Name</div> */}
        <div><b>{imageInfo.wilhelm_huang_hintley_name}</b></div>
      </div>
    </div>
    {isShowRc &&
      <div className="rcDescription">
        <div className="rcTitle">RC Description</div>
        <div className="rcContent">{imageInfo.rc_description}</div>
      </div>
    }
  </div>
);

ImageDecription.propTypes = {
  imageInfo: PropTypes.objectOf(PropTypes.string).isRequired,
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired,
  isShowRc: PropTypes.bool.isRequired
};
export default ImageDecription;
