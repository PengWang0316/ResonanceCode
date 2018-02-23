import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchReadingsForm from '../SearchReadingsForm';
import BriefReading from '../BriefReading';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { checkAuthentication } from '../../actions/UserActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { searchReadings, clearSearchReadings } from '../../actions/ReadingActions';
import { fetchHexagrams, clearHexagrams } from '../../actions/HexagramActions';
import { TOTAL_NUMBER_HEXAGRAM } from '../../config';
import HexagramListContainer from './HexagramListContainer';
import HexagramDetailModal from '../HexagramDetailModal';

/**
 * Search reading container.
 */
class SearchReadingsContainer extends Component {
  state = ({
    hexagram: null
  });
  /**
 * Checking authentication and clearing old readings from redux.
 * @returns {null} Null.
 */
  componentWillMount() {
    // if(!isLogin(document)) this.props.history.push("/");
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearSearchReadings();
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    } else
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(this.props.hexagrams);
  }

  /**
   * When recieve a new hexagrams object and the total number of hexagram equal the total hexagarm we have, create a hexagramsImgArrMap.
   * @param {Object} hexagarms is the object nextProps will recieve
   * @return {null} No return.
   */
  componentWillReceiveProps({ hexagrams }) {
    /* istanbul ignore next */
    if (this.props.hexagrams !== hexagrams &&
       hexagrams.length === TOTAL_NUMBER_HEXAGRAM && !this.hexagramsImgArrMap)
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(hexagrams);
  }

  /**
  * Assembling the search object and call searchReading method.
  * @param {object} searchCriterias object for search criterias.
  * @returns {int} The sum of the two numbers.
  */
  handleSubmitCallback = searchCriterias => {
    // assemble for searching
    const searchObject = {
      startDate: searchCriterias.startDate ?
        new Date(searchCriterias.startDate) : searchCriterias.startDate,
      endDate: searchCriterias.endDate ?
        new Date(searchCriterias.endDate) : searchCriterias.endDate,
      people: searchCriterias.people,
      upperId: searchCriterias.upper,
      lowerId: searchCriterias.lower,
      line13Id: searchCriterias.line13,
      line25Id: searchCriterias.line25,
      line46Id: searchCriterias.line46
    };
    this.props.searchReadings(searchObject);
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
   * When a user clicks the show detail button, find the hexagram and show the modal.
   * @param {object} event comes from the element a user is clicking.
   * @return {null} No return.
   */
  handleHexagramClick = event => {
    event.stopPropagation();
    this.initailHexagramNumbersMap();
    this.setState({ hexagram: this.hexagramNumbersMap[event.target.id] });
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

  /**
  * Render method.
  * @returns {null}.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div>
          <SearchReadingsForm
            handleSubmit={this.handleSubmitCallback}
          />
          <LoadingAnimation />
          {/* start to show result for reading */}
          {this.props.readings
              .map(reading =>
                (<BriefReading
                  key={reading._id}
                  reading={reading}
                  handleHexagramClick={this.handleHexagramClick}
                />))}
          {/* no result message */}
          {this.props.extraMessage !== '' && <div className="text-center font-weight-bold"><h4>{this.props.extraMessage}</h4></div>}
        </div>
        <HexagramDetailModal
          hexagram={this.state.hexagram}
          handleHexagramClick={this.handleAssociatedHexagramClick}
          hexagramsImgArrMap={this.hexagramsImgArrMap}
        />
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  readings: state.searchReadings,
  extraMessage: state.extraMessage,
  isLoading: state.isLoading,
  user: state.user,
  hexagrams: state.hexagrams
});
const mapDispatchToProps = dispatch => ({
  searchReadings: searchCriterias => dispatch(searchReadings(searchCriterias)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearSearchReadings: _ => dispatch(clearSearchReadings()),
  fetchHexagrams: () => dispatch(fetchHexagrams({})),
  clearHexagrams: () => dispatch(clearHexagrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchReadingsContainer);
