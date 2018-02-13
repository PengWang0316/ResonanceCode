import React from 'react';
import PropTypes from 'prop-types';

import HexagramImage from './HexagramImage';

const GroupHexagramRow = ({ hexagram, handleHexagramClick }) => (
  <tr number={hexagram.number} onClick={handleHexagramClick}>
    <td>{hexagram.name}</td>
    <td>#{hexagram.number}</td>
    <td>
      <HexagramImage
        isBlack
        imageNumber={hexagram.imageArr}
        isFirstImage
        isSmall
      />
    </td>
    <td>{hexagram.rcName}</td>
  </tr>
);
GroupHexagramRow.propTypes = {
  hexagram: PropTypes.object.isRequired,
  handleHexagramClick: PropTypes.func.isRequired
};
export default GroupHexagramRow;
