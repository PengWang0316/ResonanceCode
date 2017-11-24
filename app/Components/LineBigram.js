import React from 'react';
import PropTypes from 'prop-types';

import * as conceptionImage from '../imgs/conception.png';
import * as growthImage from '../imgs/growth.png';
import * as maturationImage from '../imgs/maturation.png';
import * as seedingImage from '../imgs/seeding.png';

const LineBigram = ({ title, data }) => {
  const images = {
    '../imgs/conception.png': conceptionImage.default,
    '../imgs/growth.png': growthImage.default,
    '../imgs/maturation.png': maturationImage.default,
    '../imgs/seeding.png': seedingImage.default
  };
  return (
    <div className="mt-2">
      <div className="font-weight-bold"><h6>{title}</h6> <img src={data.image ? images[data.image] : ''} alt={data.name} /> </div>

      {data.name && <div><b>Name:</b> {data.name}</div>}

      <div>{data.energy_state &&
        <span><b>Energy State:</b> {data.energy_state}</span>}{data.manifestation &&
          <span>Manifestation: {data.manifestation}</span>}{data.possibilities &&
            <span>Possibilities: {data.possibilities}</span>}
      </div>

      <div>Questions to reflect:</div>
      <div>{data.question}</div>

    </div>
  );
};
LineBigram.proptypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};
export default LineBigram;
