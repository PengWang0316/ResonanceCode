import React from 'react';
import PropTypes from 'prop-types';

import ImageDescription from './ImageDescription';
// import AssociatedHexagrams from './AssociatedHexagrams';
import GroupHexagramTable from './GroupHexagramTable';
import BigramClockBig from './BigramClockBig';
import BigramBlockBig from './BigramBlockBig';
import ChangingLines from './ChangingLines';
import styles from '../styles/HexagramDetailModal.module.css';

const getGroupHexagramObject = (name, imageArr) => ({
  name, imageArr
});

const getQuartetHexagramArray = hexagram => [
  getGroupHexagramObject('Potentiation', hexagram.potentiation_hexagram),
  getGroupHexagramObject('Growth', hexagram.growth_hexagram),
  getGroupHexagramObject('Maturation', hexagram.maturation_hexagram),
  getGroupHexagramObject('Re-Sourcing', hexagram.resourcing_hexagram)
];

const getAssociateHexagramArray = hexagram => [
  getGroupHexagramObject('Complementary', hexagram.complementary_hexagram),
  getGroupHexagramObject('Reverse', hexagram.reverse_hexagram),
  getGroupHexagramObject('Hidden Influence', hexagram.hidden_influence_hexagram)
];

const HexagramDetailModal = ({ hexagram, handleHexagramClick, hexagramsImgArrMap }) => (
  <div className="modal fade bd-example-modal-lg" id="hexagramDetailModal" tabIndex="-1" role="dialog" aria-labelledby="hexagramDetailModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="hexagramDetailModalLabel">&nbsp;</h5>
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
            <div className={`mt-4 ${styles.imagePoetryDiv}`}>
              {hexagram.image && <img src={hexagram.image} alt="hexagram" className={`img-fluid float-sm-left ${styles.image}`} />}
              <blockquote
                className={styles.poetry}
                style={hexagram.poetry_font_size ? { fontSize: `${hexagram.poetry_font_size}px` } : {}}
              >
                {hexagram.poetry}
              </blockquote>
            </div>
            <div className={`mt-4 ${styles.overViewDiv}`}>Overview:</div>
            <div className={styles.preLineWhiteSpace}>{hexagram.overview}</div>
            <div className="mt-4 font-weight-bold">Question:</div>
            <div className={styles.preLineWhiteSpace}>{hexagram.question}</div>
            <div className="mt-4 font-weight-bold">Analysis:</div>
            <div className={`mb-4 ${styles.preLineWhiteSpace}`}>{hexagram.analysis}</div>
            <ChangingLines hexagram={hexagram} hexagramsImgArrMap={hexagramsImgArrMap} />
            <GroupHexagramTable
              hexagramArray={getAssociateHexagramArray(hexagram)}
              handleHexagramClick={handleHexagramClick}
              tableTitle="Associated Hexagrams"
              hexagramsImgArrMap={hexagramsImgArrMap}
            />
            <GroupHexagramTable
              hexagramArray={getQuartetHexagramArray(hexagram)}
              handleHexagramClick={handleHexagramClick}
              tableTitle="Resonance Quartet Hexagrams"
              hexagramsImgArrMap={hexagramsImgArrMap}
            />
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
  handleHexagramClick: PropTypes.func.isRequired,
  hexagramsImgArrMap: PropTypes.object
};
HexagramDetailModal.defaultProps = {
  hexagram: null,
  hexagramsImgArrMap: {}
};
export default HexagramDetailModal;
