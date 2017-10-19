import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Loading from '../Loading';
import JournalForm from '../JournalForm';
// import { isLogin } from '../../apis/LoginApi';
// import { deleteJournal, deleteUnattachedJournal } from '../../apis/DatabaseApi';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { checkAuthentication } from '../../actions/UserActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
// import isLoading from '../../actions/LoadingActions';
import { updateJournal, createJournal, deleteJournal, deleteUnattachedJournal } from '../../actions/JournalActions';

/**
 * Add Journal Container class.
 */
class AddJournalContainer extends Component {
  /** Checking authentication if user object cannot be found in props.
   * @returns {null} No return.
   */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
  }

  /** After updating, creating and deleting, forward to reading page.
    * @param {object} nextProps is the object that contains new props.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (!this.props.journal && this.props.isLoading && !nextProps.isLoading)
      this.props.history.push('/reading');
  }

  /*
    ** updateObject = {
        isUpdate: bool,
        journalId: ,
        journalDate: ,
        userId: ,
        readings: ,
        contents: ,
        oldReadingIds:
      }
    */

  /** Handling the submit event.
   * @param {object} updateObject is the journal object will be updated or created.
   * @returns {null} No return.
   */
  handleSubmitCallback(updateObject) {
    // this.props.isLoading(true);
    const journal = Object.assign({
      _id: updateObject.journalId,
      date: new Date(updateObject.journalDate),
      // user_id: updateObject.userId,
      readings: updateObject.readings
    }, updateObject.contents);
    // console.log("submit:", updateObject);
    if (updateObject.isUpdate) {
      // console.log("oldContentKeys:", this.oldContentKeys);
      // console.log("oldReadingKeys:", this.oldReadingIds);
      // Assemble two arrays for deletion contents and reading
      // const deleteContents = [];
      const deleteReadingIds = [];
      // Object.prototype.hasOwnProperty.call(updateObject.readings) this.oldContentKeys.map((element)=>{if(!this.contents.hasOwnProperty(element)) deleteContents.push(element);});
      // if this.oldReadingIds array is null, it is a unattached journal
      /* if (updateObject.oldReadingIds) updateObject.oldReadingIds.map((element) => { if (!updateObject.readings.hasOwnProperty(element)) deleteReadingIds.push(element); }); */
      if (updateObject.oldReadingIds) updateObject.oldReadingIds
        .forEach((element) => {
          if (!Object.prototype.hasOwnProperty.call(updateObject.readings, element))
            deleteReadingIds.push(element);
        });

      // journal.deleteContents = deleteContents; //todo delete deleteContents and oldContentKeys
      journal.deleteReadingIds = deleteReadingIds;
      journal.isUnattachedJournal = !updateObject.oldReadingIds;
      // console.log("delete contents: ",deleteContents);
      // console.log("delete reading ids : ",deleteReadingIds);
      // updateJournal(journal, !updateObject.oldReadingIds).then((result) => {
      //   this.removeLoadingAndForward();
      // });
      this.props.updateJournal(journal);
    } else this.props.createJournal(journal);
    // this.removeLoadingAndForward();
    // createJournal(journal).then((result) => {
    //   this.removeLoadingAndForward();
    // });
  }

  /** Handling the delete event.
   * @param {string} journalId is the id for the journal.
   * @param {string} readingIds is a reading's id array that contains all reading connects to this journal.
   * @param {boolean} isUnattachedJournal is a indicator of whether is a unattached journal.
   * @returns {null} No return.
   */
  handleDeleteCallback(journalId, readingIds, isUnattachedJournal) {
    // console.log("Delete journal!");
    // event.preventDefault();
    // this.props.isLoading(true);
    if (isUnattachedJournal) {
      this.props.deleteUnattachedJournal(journalId);
      this.props.history.push('/reading');
    } else this.props.deleteJournal({ journalId, readingIds });
    // deleteJournal(journalId, readingIds, userId).then(reault => {
    //   this.removeLoadingAndForward();
    // });
  }

  /*
  removeLoadingAndForward() {
    // this.props.isLoading(false);
    this.props.clearJournalState();
    this.props.history.push('/reading');
  }
*/
  /** Rendering the component.
   * @returns {jsx} Return the jsx that represents the component.
   */
  render() {
    // console.log("container: ", this.props.journal);
    return (
      <UnauthenticatedUserCheck>
        <div>
          <LoadingAnimation />
          <JournalForm
            journalData={this.props.journal}
            isWriting={this.props.isLoading}
            history={this.props.history}
            handleSubmit={submitObject => this.handleSubmitCallback(submitObject)}
            handleDelete={(jounalId, readingIds, isUnattachedJournal) =>
              this.handleDeleteCallback(jounalId, readingIds, isUnattachedJournal)}
          />
        </div>
      </UnauthenticatedUserCheck>
    );
  }
}

/*
AddJournalContainer.propTypes = {
  journalData: PropTypes.object,
  history: PropTypes.object
}; */

const mapStateToProps = state => ({
  isLoading: state.isLoading,
  journal: state.journal,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  // isLoading: loadingState => dispatch(isLoading(loadingState)),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  createJournal: journal => dispatch(createJournal(journal)),
  updateJournal: journal => dispatch(updateJournal(journal)),
  deleteJournal: params => dispatch(deleteJournal(params)),
  deleteUnattachedJournal: journalId => dispatch(deleteUnattachedJournal(journalId))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddJournalContainer);
