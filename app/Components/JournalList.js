import React, { Component } from 'react';
import QueryString from 'query-string';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchUnattachedJournals, fetchJournals, fetchJournalBasedOnReadingJournal, clearJournalState, clearJournalsState } from '../actions/JournalActions';
import { checkAuthentication } from '../actions/UserActions';
import UnauthenticatedUserCheck from './SharedComponents/UnauthenticatedUserCheck';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import JournalRow from './JournalRow';
import JournalSharingModal from './JournalSharingModal';
import styles from '../styles/JournalList.module.css';

/**
 * JournalList component.
 * Also include a modal for share journal function.
 */
export class JournalList extends Component {
  static propsTypes = {
    user: PropTypes.object.isRequired,
    journals: PropTypes.array.isRequired,
    fetchUnattachedJournals: PropTypes.func.isRequired,
    fetchJournals: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    fetchJournalBasedOnReadingJournal: PropTypes.func.isRequired,
    clearJournalState: PropTypes.func.isRequired,
    clearJournalsState: PropTypes.func.isRequired
  };
  /**
 * Getting this.queryInfo from url and load Journals for the page.
 * @returns {null} return null
 */
  componentWillMount() {
    this.props.clearJournalsState();
    this.queryInfo = QueryString.parse(this.props.location.search);
    this.readingName = this.queryInfo.readingName;
    this.readingId = this.queryInfo.readingId;
    // this.readingDate=this.queryInfo.readingDate;
    // this.state = { journalList: null };
    // const user = LoginApi.isLogin(document);
    // If there is not readingId in the url, read unattached Journals
    if (this.props.user.isAuth && !this.readingId)
      this.props.fetchUnattachedJournals();
    else if (this.props.user.isAuth)
      this.props.fetchJournals(this.readingId);
    else this.props.checkAuthentication();
  }

  /** Loading the data after authentication
    * @param {object} nextProps is an object of new props.
    * @return {null} No return;
  */
  componentWillReceiveProps(nextProps) {
    // The first part of code are used to detect whether the url is changed, which means the user is loading another page that is using the same component.
    const newQueryInfo = QueryString.parse(nextProps.location.search);
    const isUrlChanged = newQueryInfo.readingId !== this.readingId;
    if (isUrlChanged) {
      this.readingName = newQueryInfo.readingName;
      this.readingId = newQueryInfo.readingId;
    }

    if ((!this.props.user.isAuth && nextProps.user.isAuth) || isUrlChanged)
      if (!this.readingId)
        this.props.fetchUnattachedJournals();
      else
        this.props.fetchJournals(this.readingId);
  }

  /** Loading the journal information for the modal.
    * @param {object} ids is an object that contains reading and journal's id.
    * @return {null} No return.
  */
  handleClickShareButtonCallback = ({ readingId, journalId }) => {
    this.props.clearJournalState();
    this.props.fetchJournalBasedOnReadingJournal({ readingId, journalId });
    $('#journalSharingModal').modal('toggle'); // $ will use jQuery in the index.html page.
  };

  /**
   * Component render method.
   * @returns {jsx} The JSX for page.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className={`${styles.mainContentDiv}`}>
          <div className={`${styles.title}`}>Journal list for {this.readingName}</div>
          <LoadingAnimation />
          {this.props.journals.map(journal => {
            const newJournal = Object.assign({ readingName: this.readingName }, journal);
            // element.readingName = this.readingName;
            // element.readingDate=this.readingDate;
            return (<JournalRow
              key={newJournal._id}
              journal={newJournal}
              readingId={this.readingId}
              handleClickShareButton={this.handleClickShareButtonCallback}
            />);
          })}
        </div>

        {/* Journal sharing modal */}
        {this.readingId && <JournalSharingModal readingId={this.readingId} />}
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  journals: state.journals,
  // journal: state.journal,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  fetchUnattachedJournals: _ => dispatch(fetchUnattachedJournals()),
  fetchJournals: readingId => dispatch(fetchJournals(readingId)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  fetchJournalBasedOnReadingJournal: ({ readingId, journalId }) =>
    dispatch(fetchJournalBasedOnReadingJournal({ readingId, journalId })),
  clearJournalState: _ => dispatch(clearJournalState()),
  clearJournalsState: _ => dispatch(clearJournalsState())
});
export default connect(mapStateToProps, mapDispatchToProps)(JournalList);
