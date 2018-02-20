import React from 'react';
import PropTypes from 'prop-types';

import HexagramImage from './HexagramImage';

const GroupHexagramRow = ({ hexagram, handleHexagramClick, hexagramsImgArrMap }) => {
  const isImgArrAvailable = Object.keys(hexagramsImgArrMap).length !== 0;
  return (
    <tr number={isImgArrAvailable ? hexagramsImgArrMap[hexagram.imageArr].number : ''} onClick={handleHexagramClick}>
      <td>{hexagram.name}</td>
      <td>#{isImgArrAvailable ? hexagramsImgArrMap[hexagram.imageArr].number : ''}</td>
      <td>
        <div style={{ minWidth: '35px' }}>
          <HexagramImage
            isBlack
            imageNumber={hexagram.imageArr}
            isFirstImage
            isSmall
          />
        </div>
      </td>
      <td>{isImgArrAvailable ? hexagramsImgArrMap[hexagram.imageArr].resonance_code_name : ''}</td>
    </tr>
  );
};
GroupHexagramRow.propTypes = {
  hexagram: PropTypes.object.isRequired,
  handleHexagramClick: PropTypes.func.isRequired,
  hexagramsImgArrMap: PropTypes.object.isRequired
};
// GroupHexagramRow.defaultProps = { hexagramsImgArrMap: {} };
export default GroupHexagramRow;
