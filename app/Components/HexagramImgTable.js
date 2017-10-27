import React from 'react';
import PropTypes from 'prop-types';

import HexagramImage from './HexagramImage';

const HexagramImgTable = ({ hexagramsArray, onCallback }) => (
  <div>
    {hexagramsArray.map((element) => {
        const imgageName = element.wilhelm_huang_hintley_name ? element.wilhelm_huang_hintley_name.match(/(\w+\s*-*\w*)\s*\//)[1] : '';
        const handleClick = _ => onCallback(element.img_arr);
        return (
          <div role="button" tabIndex="-1" key={element._id} className="inlineBlock hexagram-container text-center" onClick={handleClick}>
            <div>
              <HexagramImage imageNumber={element.img_arr} isFirstImage isBlack />
            </div>
            <div className="text-center"># {element.number}</div>
            <div className="text-center">{imgageName}</div>
          </div>);
      })}
  </div>
);
HexagramImgTable.propTypes = {
  hexagramsArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCallback: PropTypes.func.isRequired
};
export default HexagramImgTable;
