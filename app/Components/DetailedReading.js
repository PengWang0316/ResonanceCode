import React from 'react';
import PropTypes from 'prop-types';

// import LineBigram from './LineBigram';
// import AssociatedHexagrams from './AssociatedHexagrams';
// import QueryString from "query-string";

const DetailedReading = ({ hexagram }) =>
  // componentWillMount(){
  //   let queryInfo=QueryString.parse(this.props.location.search);
  //   console.log("DetailedReading page queryInfo:",queryInfo);
  // }
  // const bigramQuestions = {
  //   'Resonance Bigram': hexagram.resonance_bigram_question,
  //   'Wave Bigram': hexagram.wave_bigram_question,
  //   'Particle Bigram': hexagram.particle_bigram_question
  // };
  /* Exchanging the order for line 46 and line 25 */
  // const newArray = [imageInfos[0], imageInfos[2], imageInfos[1]];
  (
    <div className="mt-3">
      {/*
      {newArray.map(element => (
        <LineBigram
          key={element._id}
          title={element.title}
          question={bigramQuestions[element.title]}
          data={element}
        />))}
      */}
      <div className="mt-2 font-weight-bold">Overview:</div>
      <div>{hexagram.overview}</div>
      <div className="mt-2 font-weight-bold">Analysis:</div>
      <div>{hexagram.analysis}</div>
      <div className="mt-2 font-weight-bold">Question:</div>
      <div>{hexagram.question}</div>
      {/*
      <AssociatedHexagrams hexagram={hexagram} />
      */}
    </div>
  );
DetailedReading.propTypes = {
  // imageInfos: PropTypes.array.isRequired,
  // particleBigram: PropTypes.string.isRequired,
  // waveBigram: PropTypes.string.isRequired,
  // resonanceBigram: PropTypes.string.isRequired,
  // notes: PropTypes.string.isRequired,
  hexagram: PropTypes.object.isRequired
};
export default DetailedReading;
