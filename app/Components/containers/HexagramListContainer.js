import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { checkAuthentication } from '../../actions/UserActions';
// import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { TOTAL_NUMBER_HEXAGRAM } from '../../config';
import HexagramImage from '../HexagramImage';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import HexagramDetailModal from '../HexagramDetailModal';
import { fetchHexagrams, clearHexagrams } from '../../actions/HexagramActions';
import styles from '../../styles/HexagramListContainer.module.css';

/**
  Show a list for Hexagram
*/
export class HexagramListContainer extends Component {
  static propTypes = {
    hexagrams: PropTypes.array,
    fetchHexagrams: PropTypes.func.isRequired,
    clearHexagrams: PropTypes.func.isRequired
  };
  static defaultProps = { hexagrams: [] };

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

  /**
   * Looking up the giving attribute name from tr element.
   * Because the event bubbling, we have to look up util reach the tr element.
   * @param {object} target is a html element.
   * @param {string} attributeName is the attribute that keeps information.
   * @param {object} hexagramNumbersMap is an object that contains number as key and hexagrams as value.
   * @return {string} return the information that keeps in the giving attribute name.
   */
  static getHexagramBaseOnTarget(target, attributeName, hexagramNumbersMap) {
    let info = null;
    let nextTarget = target.parentNode;
    while (!info) {
      if (nextTarget.nodeName === 'TR') info = nextTarget.getAttribute(attributeName);
      else if (nextTarget.nodeName === 'TBODY') throw new Error('Missing attribute.');
      else nextTarget = nextTarget.parentNode;
    }
    return hexagramNumbersMap[info];
  }

  state = { hexagram: null };

  /**
   * Fetching all hexagram is existed number of hexagrams less than 64.
   * Creating a new object with img_arr keys.
   * @return {null} No return.
  */
  componentWillMount() {
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    } else
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(this.props.hexagrams);
  }

  /**
   * Creating a new object with img_arr keys after all 64 hexagrams were fetched.
   * @param {object} nextProps is an object that contains new props.
   * @return {null} No return.
   */
  componentWillReceiveProps(nextProps) {
    /* istanbul ignore next */
    if (this.props.hexagrams !== nextProps.hexagrams &&
      nextProps.hexagrams.length === TOTAL_NUMBER_HEXAGRAM && !this.hexagramsImgArrMap)
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(nextProps.hexagrams);
  }

  /**
   * Put all hexagram to an object and use id as the key.
   * @return {object} return an object with number key and hexagrams inside.
   */
  initailHexagramNumbersMap() {
    if (!this.hexagramNumbersMap) {
      this.hexagramNumbersMap = {};
      this.props.hexagrams.forEach(hexagram => {
        this.hexagramNumbersMap[hexagram.number] = hexagram;
      });
    }
  }

  /**
   * When a user clicks a row in the table, find the hexagram and show the modal.
   * @params {string} id repersents hexagram's id.
   * @return {null} No return.
   */
  handleHexagramClick = ({ target }) => {
    this.initailHexagramNumbersMap();
    // Because the event bubbling, we have to look up util reach the tr element.
    this.setState({ hexagram: HexagramListContainer.getHexagramBaseOnTarget(target, 'id', this.hexagramNumbersMap) });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

  /**
   * When the user click a hexagram in the table, change the state.hexagram to that one.
   * @param {object} target is the hexagram number.
   * @return {null} No return.
   */
  handleAssociatedHexagramClick = ({ target }) => {
    this.initailHexagramNumbersMap();
    this.setState({ hexagram: HexagramListContainer.getHexagramBaseOnTarget(target, 'number', this.hexagramNumbersMap) });
  }
  // handleAssociatedHexagramClick = number => this.setState({ hexagram: this.hexagramNumbersMap[number] });

  /**
   * Rendering the jsx for the component.
   * @return {jsx} Returnt jsx.
   */
  render() {
    return (
      <div>
        <LoadingAnimation />
        <table>
          <thead className={styles.tableHead}>
            <tr>
              <th>Number</th>
              <th>Image</th>
              <th className={styles.rcName}><span>Resonance Code Name</span></th>
              <th>I-Ching Name <a className="small text-muted" href="#footnote">(See the footnote)</a></th>
            </tr>
          </thead>
          <tbody>
            {this.props.hexagrams && this.props.hexagrams.map(hexagram => (
              <tr
                key={hexagram._id}
                id={hexagram.number}
                className={styles.tableRow}
                onClick={this.handleHexagramClick}
              >
                <td className="text-center">#{hexagram.number}</td>
                <td><HexagramImage imageNumber={hexagram.img_arr} isFirstImage isBlack /></td>
                <td className="pr-4">{hexagram.resonance_code_name}</td>
                <td>{hexagram.wilhelm_huang_hintley_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="footnote" className="text-muted small text-right mt-3 mb-3">Footnote: The I-Ching names are selected I-Ching translations by these authors: Richard Wilhelm, Alfred Huang, and David Hinton.</div>
        <HexagramDetailModal
          hexagram={this.state.hexagram}
          handleHexagramClick={this.handleAssociatedHexagramClick}
          hexagramsImgArrMap={this.hexagramsImgArrMap}
        />
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  hexagrams: state.hexagrams
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fetchHexagrams: () => dispatch(fetchHexagrams({})),
  clearHexagrams: () => dispatch(clearHexagrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(HexagramListContainer);
