import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../../config';
import { fetchRecentReadings, fetchReadingsAmount } from '../../actions/ReadingActions';
import { checkAuthentication } from '../../actions/UserActions';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import BriefReading from '../BriefReading';
import Pagination from '../SharedComponents/Pagination';
import AddReadingJournalButton from '../AddReadingJournalButton';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import AddReadingContainer from './AddReadingContainer';
import DeleteReadingComformModal from '../DeleteReadingComformModal';
import OutputPdfModal from '../OutputPdfModal';
import HexagramDetailModal from '../HexagramDetailModal';

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
    fetchRecentReadings: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    fetchReadingsAmount: PropTypes.func.isRequired
  };
  static defaultProps = { readingsAmount: null };
  state = ({
    deleteReadingId: null,
    deleteReadingName: null,
    hexagramArr: null
  });
  /**
 * Getting page info from url to decide showing which readings
 * and also check the authentication to decide whether fetch the readings.
 * @returns {null} return null.
 */
  componentWillMount() {
    // get the page number from url
    /* istanbul ignore next */
    if (this.props.readingsAmount === null) this.props.fetchReadingsAmount();
    /* istanbul ignore next */
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else if (this.props.readings.length === 0) this.props.fetchRecentReadings(0);
  }

  /**
   * Triger the fetch method after the user valids the authentication.
   * @param {object} user The object of user.
   * @returns {null} No return.
   */
  componentWillReceiveProps({ user, readings }) {
    /* istanbul ignore next */
    if (!this.props.user.isAuth && user.isAuth && this.props.readings.length === 0) // Making sure the below code will be just loaded once.
      this.props.fetchRecentReadings(0);
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
    this.setState({ hexagramArr: event.target.id });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

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
          hexagramArr={this.state.hexagramArr}
        />
      </UnauthenticatedUserCheck>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  readings: state.readings,
  isLoading: state.isLoading,
  user: state.user,
  readingsAmount: state.readingsAmount
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRecentReadings: pageNumber => dispatch(fetchRecentReadings(pageNumber)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  fetchReadingsAmount: _ => dispatch(fetchReadingsAmount())
});
export default connect(mapStateToProps, mapDispatchToProps)(ReadingsContainer);
