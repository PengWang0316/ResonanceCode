import React from 'react';
import PropTypes from 'prop-types';
import LineBigram from './LineBigram';
// import QueryString from "query-string";

const DetailedReading = ({
  imageInfos, hexagram
}) => {
  // componentWillMount(){
  //   let queryInfo=QueryString.parse(this.props.location.search);
  //   console.log("DetailedReading page queryInfo:",queryInfo);
  // }
  const bigramQuestions = {
    'Resonance Bigram': hexagram.resonanceBigram,
    'Wave Bigram': hexagram.waveBigram,
    'Particle Bigram': hexagram.particleBigram
  };
  /* Exchanging the order for line 46 and line 25 */
  const newArray = [imageInfos[0], imageInfos[2], imageInfos[1]];
  return (
    <div className="mt-3">
      {newArray.map(element => (
        <LineBigram
          key={element._id}
          title={element.title}
          question={bigramQuestions[element.title]}
          data={element}
        />))}
      <div className="mt-2 font-weight-bold">Notes:</div>
      <div>{hexagram.notes}</div>
    </div>
  );
};
DetailedReading.proptypes = {
  imageInfos: PropTypes.array.isRequired,
  // particleBigram: PropTypes.string.isRequired,
  // waveBigram: PropTypes.string.isRequired,
  // resonanceBigram: PropTypes.string.isRequired,
  // notes: PropTypes.string.isRequired,
  hexagram: PropTypes.object.isRequired
};
export default DetailedReading;
