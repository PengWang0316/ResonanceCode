import React from "react";
import PropTypes from "prop-types";

const LineBigram = (props)=>{
  // let image= ;
  // console.log(props.data.image);
  let images = {
    "../imgs/conception.png":require("../imgs/conception.png"),
    "../imgs/growth.png":require("../imgs/growth.png"),
    "../imgs/maturation.png":require("../imgs/maturation.png"),
    "../imgs/seeding.png":require("../imgs/seeding.png")
  };
  return(
    <div className="lineDesDiv">
      <div className="rcTitle">{props.title} <img src={props.data.image?images[props.data.image]:""} alt={props.data.name} /> </div>

      {props.data.name && <div>Name: {props.data.name}</div>}

      <div>{props.data.energy_state && <span>Energy State: {props.data.energy_state}</span>}{props.data.manifestation && <span>Manifestation: {props.data.manifestation}</span>}{props.data.possibilities && <span>Possibilities: {props.data.possibilities}</span>}</div>

      <div>Question:</div>
      <div>{props.data.question}</div>

    </div>
  );
};
LineBigram.proptypes={
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};
export default LineBigram;
