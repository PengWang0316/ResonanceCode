import React from 'react';

import Bigram46Example from '../imgs/Bigram46Example.png';
import Bigram13Example from '../imgs/Bigram13Example.png';

const imageStyle = { width: '100%' };

const BigramExample = props => (
  <div className="row">
    <div className="col-lg"><img style={imageStyle} src={Bigram46Example} alt="Bigram 46" /></div>
    <div className="col-lg"><img style={imageStyle} src={Bigram13Example} alt="Bigram 13" /></div>
  </div>
);
export default BigramExample;
