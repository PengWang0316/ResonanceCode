import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { checkAuthentication } from '../../actions/UserActions';
// import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { TOTAL_NUMBER_HEXAGRAM } from '../../config';
import HexagramImage from '../HexagramImage';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
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
              <tr key={hexagram.number} className={styles.tableRow}>
                <td className="text-center">#{hexagram.number}</td>
                <td><HexagramImage imageNumber={hexagram.img_arr} isFirstImage isBlack /></td>
                <td className="pr-4">{hexagram.resonance_code_name}</td>
                <td>{hexagram.wilhelm_huang_hintley_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
