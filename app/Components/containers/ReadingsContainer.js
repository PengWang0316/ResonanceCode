import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import QueryString from 'query-string';

import { NUMBER_OF_READING_PER_PAGE_RECENT_READINGS, TOTAL_NUMBER_HEXAGRAM } from '../../config';
import { fetchRecentReadings, fetchReadingsAmount } from '../../actions/ReadingActions';
import { checkAuthentication } from '../../actions/UserActions';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { fetchHexagrams, clearHexagrams } from '../../actions/HexagramActions';
import BriefReading from '../BriefReading';
import Pagination from '../SharedComponents/Pagination';
import AddReadingJournalButton from '../AddReadingJournalButton';
// import PageNavigationButton from '../PageNavigationButton';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import AddReadingContainer from './AddReadingContainer';
import DeleteReadingComformModal from '../DeleteReadingComformModal';
import OutputPdfModal from '../OutputPdfModal';
import HexagramDetailModal from '../HexagramDetailModal';
// import styles from '../styles/ReadingsContainer.module.css';

// import LoginApi from "../../apis/LoginApi";
// import DatabaseApi from "../../apis/DatabaseApi";

/**
 * The container for readings page.
 * @returns {null} return null.
 */
export class ReadingsContainer extends Component {
  static propTypes = {
    readings: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    readingsAmount: PropTypes.number,
    hexagrams: PropTypes.array,
    fetchRecentReadings: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    fetchReadingsAmount: PropTypes.func.isRequired,
    fetchHexagrams: PropTypes.func.isRequired,
    clearHexagrams: PropTypes.func.isRequired
  };
  static defaultProps = { hexagrams: [], readingsAmount: null };
  state = ({
    deleteReadingId: null,
    deleteReadingName: null,
    hexagram: null
  });
  /**
 * Getting page info from url to decide showing which readings
 * and also check the authentication to decide whether fetch the readings.
 * @returns {null} return null.
 */
  componentWillMount() {
    // get the page number from url
    // this.setState({ isFinishedLoading: false });
    /* istanbul ignore next */
    if (this.props.readingsAmount === null) this.props.fetchReadingsAmount();
    /* istanbul ignore next */
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    }
    // const pageInfos = QueryString.parse(this.props.location.search);
    // if (pageInfos.start) this.startNumber = pageInfos.start;
    // this.startNumber = pageInfos.start ? pageInfos.start : '1';
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else if (this.props.readings.length === 0) this.props.fetchRecentReadings(0);
  }
  /* componentWillMount() {
    // get the page number from url
    // this.setState({ isFinishedLoading: false });
    const pageInfos = QueryString.parse(this.props.location.search);
    if (pageInfos.start) this.startNumber = pageInfos.start;
    this.startNumber = pageInfos.start ? pageInfos.start : '1';
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else if (this.props.readings.length === 0) this.props.fetchRecentReadings(this.startNumber);
  } */

  /**
   * Triger the fetch method after the user valids the authentication.
   * @param {object} user The object of user.
   * @returns {null} No return.
   */
  componentWillReceiveProps({ user, readings }) {
    if (!this.props.user.isAuth && user.isAuth && this.props.readings.length === 0) // Making sure the below code will be just loaded once.
      this.props.fetchRecentReadings(0);
    // else if (readings.length !== 0) this.setState({ isFinishedLoading: true });
  }

  /**
   * Showing the confrom modal to user.
   * @param {string} readingId is the id of reading that will be deleted.
   * @returns {null} No return.
   */
  handleDeleteCallback = ({ readingId, readingName }) => {
    // $ will use jQuery that comes from index.html
    this.setState({
      deleteReadingId: readingId,
      deleteReadingName: readingName
    });
    $('#deleteReadingConformModal').modal('toggle');
  }

  /**
   * When a user clicks the show detail button, find the hexagram and show the modal.
   * @param {object} event comes from the element a user is clicking.
   * @return {null} No return.
   */
  handleHexagramClick = event => {
    event.stopPropagation();
    // Put all hexagram to a object and use id as the key.
    if (!this.hexagramsMap) {
      this.hexagramsMap = {};
      this.props.hexagrams.forEach(hexagram => { this.hexagramsMap[hexagram.number] = hexagram; });
    }
    this.setState({ hexagram: this.hexagramsMap[event.target.id] });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

  /**
   * When the user click a associated hexagram, change the state.hexagram to that one.
   * @param {number} number is the hexagram number.
   * @return {null} No return.
   */
  handleAssociatedHexagramClick = number => this.setState({ hexagram: this.hexagramsMap[number] });

  /**
   * Render method.
   * @returns {jsx} The jsx for ReadingsContainer page.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div key="key_reading">
          <LoadingAnimation />
          {this.props.readings.map(reading => (
            <BriefReading
              key={reading._id}
              reading={reading}
              deleteReadingCallback={this.handleDeleteCallback}
              outputPdfWindowId="outputPdfModal"
              handleHexagramClick={this.handleHexagramClick}
            />))}

          {this.props.readings.length === 0 && !this.props.isLoading && <div className="font-weight-bold"><h4>There is no reading yet. Please add your reading.</h4></div>}
          {/* Old pagination component.
            <PageNavigationButton
            isEmptyContent={this.props.readings.length === 0}
            startNumber={this.startNumber}
          />
          */}
          {this.props.readingsAmount !== null && this.props.readingsAmount !== 0 && <Pagination
            amount={this.props.readingsAmount}
            fetchContent={this.props.fetchRecentReadings}
            numberPerpage={NUMBER_OF_READING_PER_PAGE_RECENT_READINGS}
          />}

          <AddReadingJournalButton />
        </div>

        <AddReadingContainer />
        <DeleteReadingComformModal
          readingId={this.state.deleteReadingId}
          readingName={this.state.deleteReadingName}
        />
        <OutputPdfModal />
        <HexagramDetailModal
          hexagram={this.state.hexagram}
          handleHexagramClick={this.handleAssociatedHexagramClick}
        />
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  readings: state.readings,
  isLoading: state.isLoading,
  user: state.user,
  readingsAmount: state.readingsAmount,
  hexagrams: state.hexagrams
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRecentReadings: pageNumber => dispatch(fetchRecentReadings(pageNumber)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  fetchReadingsAmount: _ => dispatch(fetchReadingsAmount()),
  fetchHexagrams: () => dispatch(fetchHexagrams({})),
  clearHexagrams: () => dispatch(clearHexagrams())
});
// const Readings = connect(mapStateToProps, mapDispatchToProps)(Readings);

export default connect(mapStateToProps, mapDispatchToProps)(ReadingsContainer);
