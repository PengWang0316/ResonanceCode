import React from 'react';
import PropTypes from 'prop-types';

import conceptionImage from '../imgs/conception.png';
import growthImage from '../imgs/growth.png';
import maturationImage from '../imgs/maturation.png';
import seedingImage from '../imgs/seeding.png';

const LineBigram = ({ title, data, question }) => {
  const images = {
    '../imgs/conception.png': conceptionImage,
    '../imgs/growth.png': growthImage,
    '../imgs/maturation.png': maturationImage,
    '../imgs/seeding.png': seedingImage
  };
  return (
    <div className="mt-2">
      <div className="font-weight-bold">{title} <img src={data.image ? images[data.image] : ''} alt={data.name} /> </div>

      {data.name && <div><b>Name:</b> {data.name}</div>}
      {/*
      <div>{data.energy_state &&
        <span><b>Energy State:</b> {data.energy_state}</span>}{data.manifestation &&
          <span>Manifestation: {data.manifestation}</span>}{data.possibilities &&
            <span>Possibilities: {data.possibilities}</span>}
      </div>
      */}
      <div className="font-weight-bold">Questions:</div>
      <div>{question}</div>

    </div>
  );
};
LineBigram.proptypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  question: PropTypes.string.isRequired
};
export default LineBigram;
