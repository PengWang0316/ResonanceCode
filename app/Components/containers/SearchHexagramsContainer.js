import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import SearchHexagramsForm from '../SearchHexagramsForm';
import HexagramImgTable from '../HexagramImgTable';
import BriefReading from '../BriefReading';
import { checkAuthentication } from '../../actions/UserActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { fetchReadingsBaseOnHexagram, clearReadings } from '../../actions/ReadingActions';
import { fetchHexagrams, clearHexgrams } from '../../actions/HexagramActions';

/** The container component for the search hexagrams. */
class SearchHexagramsContainer extends Component {
  /** Checking the users' authentication status and clearing both the readings' and hexagrams' state.
    * @returns {null} No return.
   */
  componentWillMount() {
    // if no user does not login, direct user back to login page
    // if(!isLogin(document)) this.props.history.push("/");
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearReadings();
    this.props.clearHexgrams();
  }

  /** Handling the click image for the subcomponent.
    * @param {string} imgArr is an array that contains the hexagrams array information.
    * @returns {null} No return.
   */
  handleClickImgCallback(imgArr) {
    this.props.fetchReadingsBaseOnHexagram(imgArr);
  }

  /** Rendering the jsx for the component.
    * @returns {jsx} Return jsx for the component.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className="readingContainer">

          <SearchHexagramsForm
            handleSubmit={searchCriterians => { this.props.fetchHexagrams(searchCriterians); }}
          />

          <LoadingAnimation />

          {/* Hexagram Imgs */}
          {this.props.hexagrams && this.props.hexagrams.length !== 0 &&
          <HexagramImgTable
            hexagramsArray={this.props.hexagrams}
            onCallback={imgArr => this.handleClickImgCallback(imgArr)}
          />}

          {/* Reading */}
          {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
          {/* no result message */}
          {this.props.extraMessage !== '' && <div className="no_result text-center">{this.props.extraMessage}</div>}

        </div>
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  isLoading: state.isLoading,
  hexagrams: state.hexagrams,
  readings: state.readings,
  extraMessage: state.extraMessage,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  fetchReadingsBaseOnHexagram: (imgArr, userId) =>
    dispatch(fetchReadingsBaseOnHexagram(imgArr, userId)),
  fetchHexagrams: searchCriterias => dispatch(fetchHexagrams(searchCriterias)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearReadings: _ => dispatch(clearReadings()),
  clearHexgrams: _ => dispatch(clearHexgrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchHexagramsContainer);
