import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ImageDescription from './ImageDescription';
// import AssociatedHexagrams from './AssociatedHexagrams';
import GroupHexagramTable from './GroupHexagramTable';
import BigramClockBig from './BigramClockBig';
import BigramBlockBig from './BigramBlockBig';
import ChangingLines from './ChangingLines';
import styles from '../styles/HexagramDetailModal.module.css';

class HexagramDetailModal extends Component {

  static propTypes = {
    hexagram: PropTypes.object,
    handleHexagramClick: PropTypes.func.isRequired,
    hexagramsImgArrMap: PropTypes.object
  };
  static defaultProps = {
    hexagram: null,
    hexagramsImgArrMap: {}
  };

  static getGroupHexagramObject = (name, imageArr) => ({
    name, imageArr
  });

  static getQuartetHexagramArray = hexagram => [
    HexagramDetailModal.getGroupHexagramObject('Potentiation', hexagram.potentiation_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Growth', hexagram.growth_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Maturation', hexagram.maturation_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Re-Sourcing', hexagram.resourcing_hexagram)
  ];

  static getAssociateHexagramArray = hexagram => [
    HexagramDetailModal.getGroupHexagramObject('Complementary', hexagram.complementary_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Reverse', hexagram.reverse_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Hidden Influence', hexagram.hidden_influence_hexagram)
  ];

  state = { hexagram: null };

  render() {
    return (
      <div className="modal fade bd-example-modal-lg" id="hexagramDetailModal" tabIndex="-1" role="dialog" aria-labelledby="hexagramDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="hexagramDetailModalLabel">&nbsp;</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {this.props.hexagram &&
              <div className="modal-body">
                <ImageDescription
                  imageInfo={this.props.hexagram}
                  imageNumber={this.props.hexagram.img_arr}
                  isFirstImage
                  isBlack
                />
                <div className="mt-4 d-flex flex-wrap justify-content-center">
                  <BigramClockBig lineText="Resonance Line 2/5" position={this.props.hexagram.line_25} />
                  <BigramClockBig lineText="Agency/Process Line 1/4" position={this.props.hexagram.line_14} />
                  <BigramClockBig lineText="Agent/Identity Line 3/6" position={this.props.hexagram.line_36} />
                </div>
                <div className="pl-4 mt-5 d-flex flex-wrap justify-content-around">
                  <BigramBlockBig lineText="Particle Bigram: Line 1 and 3" position={this.props.hexagram.line_13} isLine13 />
                  <BigramBlockBig lineText="Wave Bigram: Line 4 and 6" position={this.props.hexagram.line_46} />
                </div>
                <div className={`mt-4 ${styles.imagePoetryDiv}`}>
                  {this.props.hexagram.image &&
                    <div className={`float-sm-left ${styles.imageDiv}`}>
                      <img src={this.props.hexagram.image} alt="this.props.hexagram" className={`img-fluid ${styles.image}`} />
                      <div className={styles.imageCitation}>{this.props.hexagram.image_citation}</div>
                    </div>}
                  <blockquote
                    className={styles.poetry}
                    style={this.props.hexagram.poetry_font_size ? { fontSize: `${this.props.hexagram.poetry_font_size}px` } : {}}
                  >
                    {this.props.hexagram.poetry}
                  </blockquote>
                </div>
                <div className={`mt-4 ${styles.overViewDiv}`}>Overview:</div>
                <div className={styles.preLineWhiteSpace}>{this.props.hexagram.overview}</div>
                <div className="mt-4 font-weight-bold">Analysis:</div>
                <div className={`mb-4 ${styles.preLineWhiteSpace}`}>{this.props.hexagram.analysis}</div>
                <div className="mt-4 font-weight-bold">Question:</div>
                <div className={styles.preLineWhiteSpace}>{this.props.hexagram.question}</div>
                <ChangingLines hexagram={this.props.hexagram} hexagramsImgArrMap={this.props.hexagramsImgArrMap} />
                <GroupHexagramTable
                  hexagramArray={HexagramDetailModal.getAssociateHexagramArray(this.props.hexagram)}
                  handleHexagramClick={this.props.handleHexagramClick}
                  tableTitle="Associated Hexagrams"
                  hexagramsImgArrMap={this.props.hexagramsImgArrMap}
                />
                <GroupHexagramTable
                  hexagramArray={HexagramDetailModal.getQuartetHexagramArray(this.props.hexagram)}
                  handleHexagramClick={this.props.handleHexagramClick}
                  tableTitle="Resonance Quartet Hexagrams"
                  hexagramsImgArrMap={this.props.hexagramsImgArrMap}
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
  }
}


export default HexagramDetailModal;
