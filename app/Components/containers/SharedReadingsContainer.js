import React, { Component } from 'react';
import { connect } from 'react-redux';

import SharedJournalListModal from '../SharedJournalListModal';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import BriefReading from '../BriefReading';
import Pagination from '../SharedComponents/Pagination';
import { checkAuthentication } from '../../actions/UserActions';
import { fetchSharedReadings, fetchSharedReadingsAmount } from '../../actions/ReadingActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../../config';

/** The component that uses to show the shared readings. */
export class SharedReadingsContainer extends Component {
  state = { currentReading: null };
  /** Checking a user's anthentication status.
    * @return {null} No return.
  */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else {
      this.props.fetchSharedReadingsAmount();
      this.props.fetchSharedReadings(0);
    }
  }

  /** Fetching the shared readings after a user passes the authentication check.
    * @param {object} nextProps is an object that contains the new props vaule.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (!this.props.user.isAuth && nextProps.user.isAuth) {
      this.props.fetchSharedReadingsAmount();
      this.props.fetchSharedReadings(0);
    }
  }

  /** Showing the shared journal list modal when a user click the open button.
    * @param {object} reading is an object that contains reading's and journal information.
    * @return {null} No return.
  */
  handleShowModalClickCallback = reading => {
    this.setState({ currentReading: reading });
    $('#sharedJournalListModal').modal('toggle'); // $ will use the jQuery from index.html.
  };

  /** Rendering the jsx for the component.
    * @return {jsx} Returning the jsx for the component.
  */
  render() {
    const { sharedReadings, isLoading, sharedReadingsAmount } = this.props;
    return (
      <UnauthenticatedUserCheck>
        <div>
          <div><h4>Other people are sharing these readings with you:</h4></div>
          <LoadingAnimation />
          {sharedReadings.map(reading => (<BriefReading
            key={reading._id}
            reading={reading}
            deleteReadingCallback={this.handleDeleteCallback}
            isSharedReading
            handleShowModalClick={this.handleShowModalClickCallback}
          />))}

          {sharedReadings.length === 0 && !isLoading && <div className="rcTitle">No shared reading yet.</div>}

          {sharedReadingsAmount !== null && sharedReadings.length !== 0 &&
            <div className="mt-3 w-100 d-flex justify-content-end">
              <Pagination
                amount={sharedReadingsAmount}
                fetchContent={fetchSharedReadings}
                numberPerpage={NUMBER_OF_READING_PER_PAGE_RECENT_READINGS}
              />
            </div>}
        </div>
        {/* Shared journal list modal */}
        <SharedJournalListModal reading={this.state.currentReading} />
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  sharedReadings: state.sharedReadings,
  isLoading: state.isLoading,
  sharedReadingsAmount: state.sharedReadingsAmount
});
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  fetchSharedReadings: _ => dispatch(fetchSharedReadings()),
  fetchSharedReadingsAmount: _ => dispatch(fetchSharedReadingsAmount())
});
export default connect(mapStateToProps, mapDispatchToProps)(SharedReadingsContainer);
