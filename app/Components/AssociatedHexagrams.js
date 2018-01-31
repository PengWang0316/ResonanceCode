import React from 'react';
import PropTypes from 'prop-types';

import HexagramImage from './HexagramImage';

const AssociatedHexagrams = ({ hexagram }) => (
  <div>
    <div className="mt-2 font-weight-bold">Associated Hexagrams</div>
    <div className="mt-2 d-flex align-items-center">
      <div>Complementary: #{hexagram.complementary_hexagram_number}&nbsp;&nbsp;</div>
      <div>
        <HexagramImage
          isBlack
          imageNumber={hexagram.complementary_hexagram}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <div>{hexagram.complementary_hexagram_code}</div>
    <div className="mt-2 d-flex align-items-center">
      <div>Reverse: #{hexagram.reverse_hexagram_number}&nbsp;&nbsp;</div>
      <div>
        <HexagramImage
          isBlack
          imageNumber={hexagram.reverse_hexagram}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <div>{hexagram.reverse_hexagram_code}</div>
    <div className="mt-2 d-flex align-items-center">
      <div>Hidden Influence: #{hexagram.hidden_influence_hexagram_number}&nbsp;&nbsp;</div>
      <div>
        <HexagramImage
          isBlack
          imageNumber={hexagram.hidden_influence_hexagram}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <div>{hexagram.hidden_influence_hexagram_code}</div>
  </div>
);
AssociatedHexagrams.propTypes = { hexagram: PropTypes.object.isRequired };
export default AssociatedHexagrams;
