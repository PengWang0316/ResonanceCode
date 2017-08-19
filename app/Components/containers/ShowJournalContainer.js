import React, { Component } from "react";
import { connect } from "react-redux";
import QueryString from "query-string";
import AddJournalContainer from "./AddJournalContainer";

import Loading from "../Loading";

import { fetchJournal, fetchUnattachedJournal } from "../../actions/JournalActions";

class ShowJournalContainer extends Component {

  componentWillMount(){
    let queryInfo=QueryString.parse(this.props.location.search);
    let journalId=queryInfo.journalId;

    // this.state={journalDate:null};
    // console.log("isAttachedJournal:",queryInfo.isAttachedJournal);
    // fetch journal from unattached journal collection (journal_entries) or reading collection
    if(queryInfo.isAttachedJournal!="null"){
      this.props.fetchJournal(journalId);
    }else{
      this.props.fetchUnattachedJournal(journalId);
    }
  }

  render(){
    return (
      <div>
        {this.props.journal && <AddJournalContainer history={this.props.history} />}
      </div>
    );
  }

}
const mapStateToProps = (state, onwProps) => {
  return {
    isLoading: state.isLoading,
    journal: state.journal
  };
};
const mapDispatchToProps = (dispatch, onwProps) => {
  return {
    fetchJournal: journalId => {dispatch(fetchJournal(journalId));},
    fetchUnattachedJournal: journalId => {dispatch(fetchUnattachedJournal(journalId));}
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShowJournalContainer);
