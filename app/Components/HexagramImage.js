import React from "react";
import PropTypes from "prop-types";
import { getHexagramImageClassNamesArray, getHexagramBlackImageClassNamesArray } from "../apis/Util";

const HexagramImage = (props)=>{
  let image = props.isBlack? getHexagramBlackImageClassNamesArray(props.imageNumber) : getHexagramImageClassNamesArray(props.imageNumber, props.isFirstImage);
  // console.log(props.isFirstImage);
  // console.log(image);
  return (

    <div className="inlineBlock">
      <div className="image-line"><div className={image[5].side}></div><div className={image[5].middle}></div><div className={image[5].side}></div></div>
      <div className="image-line"><div className={image[4].side}></div><div className={image[4].middle}></div><div className={image[4].side}></div></div>
      <div className="image-line"><div className={image[3].side}></div><div className={image[3].middle}></div><div className={image[3].side}></div></div>
      <div className="image-line"><div className={image[2].side}></div><div className={image[2].middle}></div><div className={image[2].side}></div></div>
      <div className="image-line"><div className={image[1].side}></div><div className={image[1].middle}></div><div className={image[1].side}></div></div>
      <div className="image-line"><div className={image[0].side}></div><div className={image[0].middle}></div><div className={image[0].side}></div></div>
    </div>

  );
};
HexagramImage.propTypes={
  imageNumber: PropTypes.string.isRequired,
  isFirstImage: PropTypes.bool,
  isBlack: PropTypes.bool
};
export default HexagramImage;
