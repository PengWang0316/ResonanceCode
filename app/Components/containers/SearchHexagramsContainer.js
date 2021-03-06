import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import SearchHexagramsForm from '../SearchHexagramsForm';
import HexagramImgTable from '../HexagramImgTable';
import BriefReading from '../BriefReading';
import { checkAuthentication } from '../../actions/UserActions';
import { fetchReadingsBaseOnHexagram, clearSearchReadings } from '../../actions/ReadingActions';
import { fetchHexagrams, clearHexagrams } from '../../actions/HexagramActions';

/** The container component for the search hexagrams. */
export class SearchHexagramsContainer extends Component {
  static propTypes = {
    hexagrams: PropTypes.array.isRequired,
    searchReadings: PropTypes.array.isRequired,
    extraMessage: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    fetchReadingsBaseOnHexagram: PropTypes.func.isRequired,
    fetchHexagrams: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    clearSearchReadings: PropTypes.func.isRequired,
    clearHexagrams: PropTypes.func.isRequired
  };
  /** Checking the users' authentication status and clearing both the readings' and hexagrams' state.
    * @returns {null} No return.
   */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearSearchReadings();
    this.props.clearHexagrams();
  }

  /** Handling the click image for the subcomponent.
    * @param {string} imgArr is an array that contains the hexagrams array information.
    * @returns {null} No return.
   */
  handleClickImgCallback = imgArr => {
    this.props.fetchReadingsBaseOnHexagram(imgArr);
  }

  /** Call the Hexagram method to search hexagrams for the user.
    * @param {object} searchCriterians is an object that contains the search filter.
    * @returns {null} No return.
  */
  handleSubmit = searchCriterians => this.props.fetchHexagrams(searchCriterians);

  /** Rendering the jsx for the component.
    * @returns {jsx} Return jsx for the component.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div>

          <SearchHexagramsForm
            handleSubmit={this.handleSubmit}
          />

          <LoadingAnimation />

          {/* Hexagram Imgs */}
          {this.props.hexagrams && this.props.hexagrams.length !== 0 &&
          <HexagramImgTable
            hexagramsArray={this.props.hexagrams}
            onCallback={this.handleClickImgCallback}
          />}

          {/* Reading */}
          {this.props.searchReadings
              .map(reading => <BriefReading key={reading._id} reading={reading} />)}
          {/* no result message */}
          {this.props.extraMessage !== '' && <div className="text-center font-weight-bold"><h4>{this.props.extraMessage}</h4></div>}

        </div>
      </UnauthenticatedUserCheck>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  hexagrams: state.hexagrams,
  searchReadings: state.searchReadings,
  extraMessage: state.extraMessage,
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fetchReadingsBaseOnHexagram: (imgArr, userId) =>
    dispatch(fetchReadingsBaseOnHexagram(imgArr, userId)),
  fetchHexagrams: searchCriterias => dispatch(fetchHexagrams(searchCriterias)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearSearchReadings: _ => dispatch(clearSearchReadings()),
  clearHexagrams: _ => dispatch(clearHexagrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchHexagramsContainer);
