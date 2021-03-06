import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageDescription from './ImageDescription';
// import AssociatedHexagrams from './AssociatedHexagrams';
import GroupHexagramTable from './GroupHexagramTable';
// import BigramClockBig from './BigramClockBig';
// import BigramBlockBig from './BigramBlockBig';
import Bigram from './Bigram';
import ChangingLines from './ChangingLines';
import styles from '../styles/HexagramDetailModal.module.css';
import { fetchHexagrams, clearHexagrams } from '../actions/HexagramActions';
import { TOTAL_NUMBER_HEXAGRAM } from '../config';
import HexagramListContainer from './containers/HexagramListContainer';
import BigramExample from './BigramExample';

/** The component shows the detailed information for hexagram
 * @return {null} no return
*/
export class HexagramDetailModal extends Component {
  static propTypes = {
    hexagramArr: PropTypes.string,
    hexagrams: PropTypes.array.isRequired,
    // handleHexagramClick: PropTypes.func.isRequired,
    // hexagramsImgArrMap: PropTypes.object,
    fetchHexagrams: PropTypes.func.isRequired,
    clearHexagrams: PropTypes.func.isRequired
  };
  static defaultProps = {
    hexagramArr: ''
    // hexagramsImgArrMap: {}
  };

  /**
   * Creating an object with name and imageArr.
   * @param {string} name is the title name.
   * @param {string} imageArr is hexagram's img_arr.
   * @return {object} return an object that has name and imageArr.
   */
  static getGroupHexagramObject = (name, imageArr) => ({
    name, imageArr
  });

  /**
   * Creating an array for quarter hexagram.
   * @param {object} hexagram is an object that contains hexagram's information.
   * @return {object} return an QuartetHexagram array.
   */
  static getQuartetHexagramArray = hexagram => [
    HexagramDetailModal.getGroupHexagramObject('Potentiation', hexagram.potentiation_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Growth', hexagram.growth_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Maturation', hexagram.maturation_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Re-Sourcing', hexagram.resourcing_hexagram)
  ];

  /**
   * Creating an array for associate hexagram.
   * @param {object} hexagram is an object that contains hexagram's information.
   * @return {object} return an AssociateHexagram array.
   */
  static getAssociateHexagramArray = hexagram => [
    HexagramDetailModal.getGroupHexagramObject('Complementary', hexagram.complementary_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Reverse', hexagram.reverse_hexagram),
    HexagramDetailModal.getGroupHexagramObject('Hidden Influence', hexagram.hidden_influence_hexagram)
  ];

  /**
   * Creating a hexagrams object with img_arr keys.
   * @param {array} hexagrams is the array has all hexagram.
   * @return {object} Return a new object with img_arr keys.
   */
  static getHexagramImgArrMap(hexagrams) {
    const hexagramsImgArrMap = {};
    hexagrams.forEach(hexagram => {
      hexagramsImgArrMap[hexagram.img_arr] = hexagram;
    });
    return hexagramsImgArrMap;
  }

  state = { hexagram: null, isShowExample: false };

  /**
   * clear hexagrams and fetch all hexagram if hexagrams do not have the full list.
   * get hexagramsImgArrMap if the hexagrams is the full list.
   * @return {null} No return.
   */
  componentWillMount() {
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    } else
      this.hexagramsImgArrMap = HexagramDetailModal.getHexagramImgArrMap(this.props.hexagrams);
  }

  /**
   * Create a hexagramsImgArrMap after fetching the full list of hexagrams.
   * Set hexagram state to the current one.
   * @param {object} nextProps inclucdes hexagrams and hexagramArr.
   * @return {null} no return.
   */
  componentWillReceiveProps({ hexagrams, hexagramArr }) {
    /* istanbul ignore next */
    if (this.props.hexagrams !== hexagrams &&
      hexagrams.length === TOTAL_NUMBER_HEXAGRAM && !this.hexagramsImgArrMap)
      this.hexagramsImgArrMap = HexagramDetailModal.getHexagramImgArrMap(hexagrams);
    /* istanbul ignore next */
    if (this.props.hexagramArr !== hexagramArr)
      this.setState({ hexagram: this.hexagramsImgArrMap[hexagramArr] });
  }

  /**
   * Put all hexagram to an object and use id as the key.
   * @return {object} return an object with number key and hexagrams inside.
   */
  initailHexagramNumbersMap() {
    /* istanbul ignore next */
    if (!this.hexagramNumbersMap) {
      this.hexagramNumbersMap = {};
      this.props.hexagrams.forEach(hexagram => {
        this.hexagramNumbersMap[hexagram.number] = hexagram;
      });
    }
  }

  /**
   * When the user click a hexagram in the table, change the state.hexagram to that one.
   * @param {object} target is the hexagram number.
   * @return {null} No return.
   */
  handleAssociatedHexagramClick = ({ target }) => {
    this.initailHexagramNumbersMap();
    this.setState({ hexagram: HexagramListContainer.getHexagramBaseOnTarget(target, 'number', this.hexagramNumbersMap) });
  }

  /**
   * When a user click the Bigram image, set the isShowExample state to the opposite value.
   * @return {null} No return.
   */
  handleBigramClick = () => this.setState(state => ({ isShowExample: !state.isShowExample }));

  /**
   * Render the jsx for the component.
   * @return {jsx} Return jsx.
   */
  render() {
    return (
      <div className="modal fade bd-example-modal-lg" id="hexagramDetailModal" tabIndex="-1" role="dialog" aria-labelledby="hexagramDetailModalLabel" aria-hidden="true">
        <div className={`modal-dialog modal-lg ${styles.modalSize}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="hexagramDetailModalLabel">&nbsp;</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {this.state.hexagram &&
              <div className="modal-body">
                <ImageDescription
                  imageInfo={this.state.hexagram}
                  imageNumber={this.state.hexagram.img_arr}
                  isFirstImage
                  isBlack
                />
                {/* Remove the previous version of Bigram grapics.
                <div className="mt-4 d-flex flex-wrap justify-content-center">
                  <BigramClockBig lineText="Resonance Line 2/5" position={this.state.hexagram.line_25} />
                  <BigramClockBig lineText="Agency/Process Line 1/4" position={this.state.hexagram.line_14} />
                  <BigramClockBig lineText="Agent/Perspective Line 3/6" position={this.state.hexagram.line_36} />
                </div>
                <div className="pl-4 mt-5 d-flex flex-wrap justify-content-around">
                  <BigramBlockBig lineText="Particle Bigram: Line 1 and 3" position={this.state.hexagram.line_13} isLine13 />
                  <BigramBlockBig lineText="Wave Bigram: Line 4 and 6" position={this.state.hexagram.line_46} />
                </div>
                */}
                <div className={`${styles.bigramImage} mr-4 ml-4 d-flex flex-wrap justify-content-center`} role="button" tabIndex="-1" onClick={this.handleBigramClick} title="Click to check the explaination">
                  <Bigram
                    line25={this.state.hexagram.line_25}
                    line46={this.state.hexagram.line_46}
                    line13={this.state.hexagram.line_13}
                  />
                </div>
                {this.state.isShowExample && <BigramExample />}
                <div className={`mt-4 ${styles.imagePoetryDiv}`}>
                  {this.state.hexagram.image &&
                    <div className={`float-sm-left ${styles.imageDiv}`}>
                      <img src={this.state.hexagram.image} alt="this.state.hexagram" className={`img-fluid ${styles.image}`} />
                      <div className={styles.imageCitation}>
                        {this.state.hexagram.image_citation}
                      </div>
                    </div>}
                  <blockquote
                    className={styles.poetry}
                    style={this.state.hexagram.poetry_font_size ? { fontSize: `${this.state.hexagram.poetry_font_size}px` } : {}}
                  >
                    {this.state.hexagram.poetry}
                  </blockquote>
                </div>
                <div className={`mt-4 ${styles.overViewDiv}`}>Overview:</div>
                <div className={styles.preLineWhiteSpace}>{this.state.hexagram.overview}</div>
                <div className="mt-4 font-weight-bold">Question:</div>
                <div className={styles.preLineWhiteSpace}>{this.state.hexagram.question}</div>
                <div className="mt-4 font-weight-bold">Analysis:</div>
                <div className={`mb-4 ${styles.preLineWhiteSpace}`}>{this.state.hexagram.analysis}</div>
                <ChangingLines
                  hexagram={this.state.hexagram}
                  hexagramsImgArrMap={this.hexagramsImgArrMap}
                />
                <GroupHexagramTable
                  hexagramArray={HexagramDetailModal.getAssociateHexagramArray(this.state.hexagram)}
                  handleHexagramClick={this.handleAssociatedHexagramClick}
                  tableTitle="Associated Hexagrams"
                  hexagramsImgArrMap={this.hexagramsImgArrMap}
                />
                <GroupHexagramTable
                  hexagramArray={HexagramDetailModal.getQuartetHexagramArray(this.state.hexagram)}
                  handleHexagramClick={this.handleAssociatedHexagramClick}
                  tableTitle="Resonance Quartet Hexagrams"
                  hexagramsImgArrMap={this.hexagramsImgArrMap}
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

/* istanbul ignore next */
const mapStateToProps = state => ({ hexagrams: state.hexagrams });
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fetchHexagrams: () => dispatch(fetchHexagrams({})),
  clearHexagrams: () => dispatch(clearHexagrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(HexagramDetailModal);
