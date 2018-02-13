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

  state = { hexagram: null };
  /**
   * Fetching all hexagram is existed number of hexagrams less than 64.
   * @return {null} No return.
  */
  componentWillMount() {
    /* istanbul ignore next */
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    }
  }

  /**
   * Looking up the giving attribute name from tr element.
   * Because the event bubbling, we have to look up util reach the tr element.
   * @param {object} target is a html element.
   * @param {string} attributeName is the attribute that keeps information.
   * @return {string} return the information that keeps in the giving attribute name.
   */
  getHexagramBaseOnTarget(target, attributeName) {
    // Put all hexagram to a object and use id as the key.
    if (!this.hexagramsMap) {
      this.hexagramsMap = {};
      this.props.hexagrams.forEach(hexagram => { this.hexagramsMap[hexagram.number] = hexagram; });
    }

    let info = null;
    let nextTarget = target.parentNode;
    while (!info) {
      if (nextTarget.nodeName === 'TR') info = nextTarget.getAttribute(attributeName);
      else if (nextTarget.nodeName === 'TBODY') throw new Error('Missing attribute.');
      else nextTarget = nextTarget.parentNode;
    }
    return this.hexagramsMap[info];
  }

  /**
   * When a user clicks a row in the table, find the hexagram and show the modal.
   * @params {string} id repersents hexagram's id.
   * @return {null} No return.
   */
  handleHexagramClick = ({ target }) => {
    // Because the event bubbling, we have to look up util reach the tr element.
    this.setState({ hexagram: this.getHexagramBaseOnTarget(target, 'id') });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

  /**
   * When the user click a hexagram in the table, change the state.hexagram to that one.
   * @param {object} target is the hexagram number.
   * @return {null} No return.
   */
  handleAssociatedHexagramClick = ({ target }) => this.setState({ hexagram: this.getHexagramBaseOnTarget(target, 'number') });
  // handleAssociatedHexagramClick = number => this.setState({ hexagram: this.hexagramsMap[number] });

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
              <th className={styles.whhName}><span>Wilhelm/Huang/Hintley Name</span></th>
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
        <HexagramDetailModal
          hexagram={this.state.hexagram}
          handleHexagramClick={this.handleAssociatedHexagramClick}
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
