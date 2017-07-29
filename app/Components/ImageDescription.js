import React from "react";
import PropTypes from "prop-types";
import HexagramImage from "./HexagramImage";

const ImageDecription = (props) => {
  let img = props.imageInfo;
  return(
    <div>
      <div className="briefImg">
        <div className="inlineBlock hexagramImageDiv" title={`${img.image_text} (The first Hexagram number: ${props.imageNumber})`}>
          <HexagramImage imageNumber={props.imageNumber} isFirstImage={props.isFirstImage} isBlack={!props.isFirstImage}/>
        </div>
        <div className="inlineBlock imgDes">
          <div>#{img.number}   {img.image_text}</div>
          {/*<div className="font-bold">Wilhelm/Huang/Hintley Name</div>*/}
          <div><b>{img.wilhelm_huang_hintley_name}</b></div>
        </div>
      </div>
      <div className="rcDescription">
        <div className="rcTitle">RC Description</div>
        <div className="rcContent">{img.rc_description}</div>
      </div>
    </div>
  );
};
ImageDecription.propTypes={
  imageInfo: PropTypes.object.isRequired,
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool.isRequired
};
export default ImageDecription;
