import React from 'react';
import PropTypes from 'prop-types';

import ImageDescription from './ImageDescription';
import AssociatedHexagrams from './AssociatedHexagrams';
import BigramClockBig from './BigramClockBig';
import BigramBlockBig from './BigramBlockBig';
import styles from '../styles/HexagramDetailModal.module.css';

const HexagramDetailModal = ({ hexagram, handleHexagramClick }) => (
  <div className="modal fade bd-example-modal-lg" id="hexagramDetailModal" tabIndex="-1" role="dialog" aria-labelledby="hexagramDetailModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="hexagramDetailModalLabel">Hexagram #{hexagram && hexagram.number}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {hexagram &&
          <div className="modal-body">
            <ImageDescription
              imageInfo={hexagram}
              imageNumber={hexagram.img_arr}
              isFirstImage
              isBlack
            />
            <div className="mt-4 d-flex flex-wrap justify-content-center">
              <BigramClockBig lineText="Resonance Line 2/5" position={hexagram.line_25} />
              <BigramClockBig lineText="Agency/Process Line 1/4" position={hexagram.line_14} />
              <BigramClockBig lineText="Agent/Identity Line 3/6" position={hexagram.line_36} />
            </div>
            <div className="pl-4 mt-5 d-flex flex-wrap justify-content-around">
              <BigramBlockBig lineText="Particle Bigram: Line 1 and 3" position={hexagram.line_13} isLine13 />
              <BigramBlockBig lineText="Wave Bigram: Line 4 and 6" position={hexagram.line_46} />
            </div>
            <div className="mt-4">
              {hexagram.image && <img src={hexagram.image} alt="hexagram" className={`img-fluid ${styles.image}`} />}
              <blockquote className={styles.poetry}>{hexagram.poetry}</blockquote>
            </div>
            <div className="mt-2 font-weight-bold">Overview:</div>
            <div>{hexagram.overview}</div>
            <div className="mt-2 font-weight-bold">Analysis:</div>
            <div>{hexagram.analysis}</div>
            <div className="mt-2 font-weight-bold">Question:</div>
            <div>{hexagram.question}</div>
            <AssociatedHexagrams hexagram={hexagram} handleHexagramClick={handleHexagramClick} />
          </div>
        }
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
);
HexagramDetailModal.propTypes = {
  hexagram: PropTypes.object,
  handleHexagramClick: PropTypes.func.isRequired
};
HexagramDetailModal.defaultProps = {
  hexagram: null
};
export default HexagramDetailModal;
