import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import { fetchRecentReadings } from '../../actions/ReadingActions';
import { checkAuthentication } from '../../actions/UserActions';
// import { isLogin } from "../../actions/LoginActions";

// import Loading from "../Loading";
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import BriefReading from '../BriefReading';
import AddReadingJournalButton from '../AddReadingJournalButton';
import PageNavigationButton from '../PageNavigationButton';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import AddReadingContainer from './AddReadingContainer';

// import LoginApi from "../../apis/LoginApi";
// import DatabaseApi from "../../apis/DatabaseApi";

/**
 * The container for readings page.
 * @returns {null} return null.
 */
class ReadingsContainer extends Component {
  /**
 * Getting page info from url to decide showing which readings
 * and also check the authentication to decide whether fetch the readings.
 * @returns {null} return null.
 */
  componentWillMount() {
    // get the page number from url
    this.setState({ isFinishedLoading: false });
    const pageInfos = QueryString.parse(this.props.location.search);
    if (pageInfos.start) this.startNumber = pageInfos.start;
    this.startNumber = pageInfos.start ? pageInfos.start : '1';
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else this.props.fetchRecentReadings(this.startNumber);
  }

  /**
   * Triger the fetch method after the user valids the authentication.
   * @param {object} user The object of user.
   * @returns {null} No return.
   */
  componentWillReceiveProps({ user, readings }) {
    if (!this.props.user.isAuth && user.isAuth) // Making sure the below code will be just loaded once.
      this.props.fetchRecentReadings(this.startNumber);
    else if (readings.length !== 0) this.setState({ isFinishedLoading: true });
  }

  /**
   * Render method.
   * @returns {jsx} The jsx for ReadingsContainer page.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div key="key_reading" className="readingContainer">
          {!this.state.isFinishedLoading && <LoadingAnimation />}
          {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}

          {this.props.readings.length === 0 && !this.props.isLoading && <div className="rcTitle">There is no reading yet. Please add your reading.</div>}

          <PageNavigationButton
            isEmptyContent={this.props.readings.length === 0}
            startNumber={this.startNumber}
          />
          <AddReadingJournalButton />
        </div>

        <AddReadingContainer />

      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  readings: state.readings,
  isLoading: state.isLoading,
  user: state.user
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRecentReadings: startNumber => dispatch(fetchRecentReadings(startNumber)),
  checkAuthentication: _ => dispatch(checkAuthentication())
});
// const Readings = connect(mapStateToProps, mapDispatchToProps)(Readings);

export default connect(mapStateToProps, mapDispatchToProps)(ReadingsContainer);
