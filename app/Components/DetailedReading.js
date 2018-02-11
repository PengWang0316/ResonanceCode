import React from 'react';
import PropTypes from 'prop-types';

// import LineBigram from './LineBigram';
// import AssociatedHexagrams from './AssociatedHexagrams';
// import QueryString from "query-string";
import BigramClockSmall from './BigramClockSmall';
import BigramBlockSmall from './BigramBlockSmall';
import styles from '../styles/DetailedReading.module.css';

const DetailedReading = ({ hexagram, handleHexagramClick }) =>
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
      <div id={hexagram.number} className={styles.detailButton} role="button" tabIndex="-1" onClick={handleHexagramClick}><i className="fas fa-book mr-2" />Show Detailed Hexagram</div>
      <div className="d-flex">
        <BigramClockSmall lineText="Line 2/5" position={hexagram.line_25} />
        <BigramClockSmall lineText="Line 1/4" position={hexagram.line_14} />
        <BigramClockSmall lineText="Line 3/6" position={hexagram.line_36} />
      </div>
      <div className="d-flex mt-1 mb-4">
        <BigramBlockSmall lineText="Line 1/3" position={hexagram.line_13} />
        <BigramBlockSmall lineText="Line 4/6" position={hexagram.line_46} />
      </div>
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
  hexagram: PropTypes.object.isRequired,
  handleHexagramClick: PropTypes.func.isRequired
};
export default DetailedReading;
