import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchReadingsForm from '../SearchReadingsForm';
import BriefReading from '../BriefReading';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { checkAuthentication } from '../../actions/UserActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { searchReadings, clearReadings } from '../../actions/ReadingActions';

/**
 * Search reading container.
 */
class SearchReadingsContainer extends Component {
  /**
 * Checking authentication and clearing old readings from redux.
 * @returns {null} Null.
 */
  componentWillMount() {
    // if(!isLogin(document)) this.props.history.push("/");
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearReadings();
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
  * Render method.
  * @returns {null}.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className="readingContainer">
          <SearchReadingsForm
            handleSubmit={this.handleSubmitCallback}
          />
          <LoadingAnimation />
          {/* start to show result for reading */}
          {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
          {/* no result message */}
          {this.props.extraMessage !== '' && <div className="no_result text-center">{this.props.extraMessage}</div>}
        </div>
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  readings: state.readings,
  extraMessage: state.extraMessage,
  isLoading: state.isLoading,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  searchReadings: searchCriterias => dispatch(searchReadings(searchCriterias)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearReadings: _ => dispatch(clearReadings())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchReadingsContainer);
