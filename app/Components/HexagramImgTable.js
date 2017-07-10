import React from "react";
import PropTypes from "prop-types";
import HexagramImage from "./HexagramImage";
// import { transferHexagramStringToImageString } from "../apis/Util";

const HexagramImgTable = (props) => {
  // console.log("props",props);
  let showArray = [];

  props.hexagramsArray.map((element)=>{
    // console.log("wilhelm_huang_hintley_name:",element.wilhelm_huang_hintley_name);
    let imgageName = element.wilhelm_huang_hintley_name ? element.wilhelm_huang_hintley_name.match(/\s*(\w+)\s*\//)[1] : "";
    showArray.push(
      <div key={element._id} className="inlineBlock hexagram-container text-center" onClick={()=>{props.onCallback(element.img_arr);}}>
        <div>
          <HexagramImage imageNumber={element.img_arr} isBlack={true}/>
        </div>
        <div className="text-center"># {element.number}</div>
        <div className="text-center">{imgageName}</div>
      </div>
    );
  });
  return (
    <div>
      {showArray}
    </div>
  );
};
HexagramImgTable.proptypes = {
  hexagramsArray: PropTypes.array.isrequired,
  onCallback: PropTypes.func.isrequired
};
export default HexagramImgTable;
