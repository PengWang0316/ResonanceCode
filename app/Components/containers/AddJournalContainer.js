import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import JournalForm from '../JournalForm';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { checkAuthentication } from '../../actions/UserActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { updateJournal, createJournal, deleteJournal, deleteUnattachedJournal, clearJournalState } from '../../actions/JournalActions';
import { clearReadings } from '../../actions/ReadingActions';

/**
 * Add Journal Container class.
 */
export class AddJournalContainer extends Component {
  static propTypes = {
    journal: PropTypes.object,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    createJournal: PropTypes.func.isRequired,
    updateJournal: PropTypes.func.isRequired,
    deleteJournal: PropTypes.func.isRequired,
    deleteUnattachedJournal: PropTypes.func.isRequired,
    clearReadings: PropTypes.func.isRequired,
    clearJournalState: PropTypes.func.isRequired
  };
  static defaultProps = {
    journal: null
  };
  /** Checking authentication if user object cannot be found in props.
   * @returns {null} No return.
   */
  componentWillMount() {
    /* istanbul ignore next */
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.isSubmited = false; // Use this as an indicator for finishing submit.
  }

  /** After updating, creating and deleting, forward to reading page.
    * @param {object} nextProps is the object that contains new props.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    /* istanbul ignore next */
    if (this.isSubmited && !this.props.journal && this.props.isLoading && !nextProps.isLoading) {
      this.props.clearReadings();
      this.props.history.push('/reading');
    }
  }

  /** Handling the submit event.
   * @param {object} updateObject is the journal object will be updated or created.
   * @returns {null} No return.
   */
  handleSubmitCallback = updateObject => {
    const journal = Object.assign({
      _id: updateObject.journalId,
      date: new Date(updateObject.journalDate),
      readings: updateObject.readings,
      shareList: updateObject.shareList,
      uploadImages: updateObject.uploadImages
    }, updateObject.contents);
    if (updateObject.isUpdate) {
      // Assemble two arrays for deletion contents and reading
      const deleteReadingIds = [];
      /* istanbul ignore next */
      if (updateObject.oldReadingIds) updateObject.oldReadingIds
        .forEach((element) => {
          if (!Object.prototype.hasOwnProperty.call(updateObject.readings, element))
            deleteReadingIds.push(element);
        });

      journal.deleteReadingIds = deleteReadingIds;
      journal.isUnattachedJournal = !updateObject.oldReadingIds;
      this.props.updateJournal(journal);
    } else this.props.createJournal(journal);
    this.isSubmited = true;
  }

  /** Handling the delete event.
   * @param {string} journalId is the id for the journal.
   * @param {string} readingIds is a reading's id array that contains all reading connects to this journal.
   * @param {boolean} isUnattachedJournal is a indicator of whether is a unattached journal.
   * @returns {null} No return.
   */
  handleDeleteCallback = (journalId, readingIds, isUnattachedJournal) => {
    this.props.clearJournalState();
    if (isUnattachedJournal) {
      this.props.deleteUnattachedJournal(journalId);
      this.props.history.push('/reading');
    } else this.props.deleteJournal({ journalId, readingIds });
  }

  /** Rendering the component.
   * @returns {jsx} Return the jsx that represents the component.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div>
          <LoadingAnimation />
          <JournalForm
            journalData={this.props.journal}
            isWriting={this.props.isLoading}
            history={this.props.history}
            handleSubmit={this.handleSubmitCallback}
            handleDelete={this.handleDeleteCallback}
          />
        </div>
      </UnauthenticatedUserCheck>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  isLoading: state.isLoading,
  // journal: state.journal,
  user: state.user
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  createJournal: journal => dispatch(createJournal(journal)),
  updateJournal: journal => dispatch(updateJournal(journal)),
  deleteJournal: params => dispatch(deleteJournal(params)),
  deleteUnattachedJournal: journalId => dispatch(deleteUnattachedJournal(journalId)),
  clearReadings: _ => dispatch(clearReadings()),
  clearJournalState: _ => dispatch(clearJournalState())
});
export default connect(mapStateToProps, mapDispatchToProps)(AddJournalContainer);
