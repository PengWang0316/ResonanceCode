import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchReadingsForm from '../SearchReadingsForm';
import BriefReading from '../BriefReading';
import HexagramDetailModal from '../HexagramDetailModal';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { checkAuthentication } from '../../actions/UserActions';
import { searchReadings, clearSearchReadings } from '../../actions/ReadingActions';

/**
 * Search reading container.
 */
export class SearchReadingsContainer extends Component {
  static propTypes = {
    readings: PropTypes.array.isRequired,
    extraMessage: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    searchReadings: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    clearSearchReadings: PropTypes.func.isRequired
  };
  state = ({
    hexagramArr: ''
  });
  /**
 * Checking authentication and clearing old readings from redux.
 * @returns {null} Null.
 */
  componentWillMount() {
    // if(!isLogin(document)) this.props.history.push("/");
    /* istanbul ignore next */
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearSearchReadings();
  }

  /**
  * Assembling the search object and call searchReading method.
  * @param {object} searchCriterias object for search criterias.
  * @return {null} No return.
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
   * When a user clicks the show detail button, find the hexagram and show the modal.
   * @param {object} event comes from the element a user is clicking.
   * @return {null} No return.
   */
  handleHexagramClick = event => {
    event.stopPropagation();
    this.setState({ hexagramArr: event.target.id });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

  /**
  * Render method.
  * @returns {null}.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div>
          <SearchReadingsForm handleSubmit={this.handleSubmitCallback} />
          <LoadingAnimation />
          {/* start to show result for reading */}
          {this.props.readings.map(reading =>
            (<BriefReading
                key={reading._id}
                reading={reading}
                handleHexagramClick={this.handleHexagramClick}
              />))}
          {/* no result message */}
          {this.props.extraMessage !== '' && <div className="text-center font-weight-bold"><h4>{this.props.extraMessage}</h4></div>}
        </div>
        <HexagramDetailModal hexagramArr={this.state.hexagramArr} />
      </UnauthenticatedUserCheck>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  readings: state.searchReadings,
  extraMessage: state.extraMessage,
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  searchReadings: searchCriterias => dispatch(searchReadings(searchCriterias)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearSearchReadings: _ => dispatch(clearSearchReadings())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchReadingsContainer);
