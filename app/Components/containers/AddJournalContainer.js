import React, { Component } from "react";
import PropTypes from "prop-types";
import Loading from "../Loading";
import JournalForm from "../JournalForm";
import { isLogin } from "../../apis/LoginApi";
import { updateJournal, createJournal, deleteJournal, deleteUnAttachedJournal } from "../../apis/DatabaseApi";

import { connect } from "react-redux";
import { checkAuthentication } from "../../actions/UserActions";
import UnauthenticatedUserCheck from "../SharedComponents/UnauthenticatedUserCheck";


import isLoading from "../../actions/LoadingActions";
import { clearJournalState } from "../../actions/JournalActions";


class AddJournalContainer extends Component {

  componentWillMount(){
    if(!this.props.user.isAuth) this.props.checkAuthentication();
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
    handleSubmitCallback(updateObject){
      this.props.isLoading(true);
      let journal = Object.assign({_id:updateObject.journalId, date: new Date(updateObject.journalDate), user_id: updateObject.userId, readings: updateObject.readings}, updateObject.contents);
      // console.log("submit:", updateObject);
      if(updateObject.isUpdate){

        // console.log("oldContentKeys:", this.oldContentKeys);
        // console.log("oldReadingKeys:", this.oldReadingIds);
        // Assemble two arrays for deletion contents and reading
        let deleteContents = [];
        let deleteReadingIds = [];
        // this.oldContentKeys.map((element)=>{if(!this.contents.hasOwnProperty(element)) deleteContents.push(element);});
        // if this.oldReadingIds array is null, it is a unattached journal
        if(updateObject.oldReadingIds) updateObject.oldReadingIds.map((element)=>{if(!updateObject.readings.hasOwnProperty(element)) deleteReadingIds.push(element);});

        // journal.deleteContents = deleteContents; //todo delete deleteContents and oldContentKeys
        journal.deleteReadingIds = deleteReadingIds;
        // console.log("delete contents: ",deleteContents);
        // console.log("delete reading ids : ",deleteReadingIds);
        updateJournal(journal, updateObject.oldReadingIds ? false : true).then((result)=>{
          this.removeLoadingAndForward();
        });
      }else{
        createJournal(journal).then((result)=>{
          this.removeLoadingAndForward();
        });
      }
    }

    handleDeleteCallback(jounalId, readingIds, userId, isUnattachedJournal){
      // console.log("Delete journal!");
      // event.preventDefault();
      // console.log("**********delete************", isUnattachedJournal, jounalId, readingIds, userId);
      this.props.isLoading(true);
      if(isUnattachedJournal) {
        deleteUnAttachedJournal(jounalId, userId).then(result => {
          this.removeLoadingAndForward();
        });
      }else{
        deleteJournal(jounalId, readingIds, userId).then(reault => {
          this.removeLoadingAndForward();
        });
      }
    }

    removeLoadingAndForward(){
      this.props.isLoading(false);
      this.props.clearJournalState();
      this.props.history.push("/reading");
    }

  render(){
    // console.log("container: ", this.props.journal);
    return (
      <UnauthenticatedUserCheck>
        <div>
          <Loading isLoading = {this.props.isLoadingState} />
          <JournalForm journalData={this.props.journal} userId = {isLogin(document).userid} isWriting = {this.props.isLoadingState} history = {this.props.history} handleSubmit = {submitObject => {this.handleSubmitCallback(submitObject);}} handleDelete = {(jounalId, readingIds, userId, isUnattachedJournal) => {this.handleDeleteCallback(jounalId, readingIds, userId, isUnattachedJournal);}} />
        </div>
      </UnauthenticatedUserCheck>
    );
  }

}

AddJournalContainer.propTypes={
  journalData: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
    isLoadingState: state.isLoading,
    journal: state.journal,
    user: state.user
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
    isLoading: loadingState => dispatch(isLoading(loadingState)),
    clearJournalState: _ => dispatch(clearJournalState()),
    checkAuthentication: _ => dispatch(checkAuthentication())
  });
export default connect(mapStateToProps, mapDispatchToProps)(AddJournalContainer);
