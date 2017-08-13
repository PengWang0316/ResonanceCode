import React, { Component } from "react";
import AddJournal from "./Containers/AddJournalContainer";
import { getJournalBasedOnId, getUnattachedJournalBasedOnId } from "../apis/DatabaseApi";
// import LoginApi from "../apis/LoginApi";
import QueryString from "query-string";
// import AddJournal from "./Addjournal";
import Loading from "./Loading";

class ShowJournal extends Component{

  componentWillMount(){
    let queryInfo=QueryString.parse(this.props.location.search);
    this.journalId=queryInfo.journalId;
    // this.readingName=queryInfo.readingName;
    // this.readingId=queryInfo.readingId;
    // this.journalDate=queryInfo.journalDate;
    this.state={journalDate:null};
    // console.log("isAttachedJournal:",queryInfo.isAttachedJournal);
    // fetch journal from unattached journal collection (journal_entries) or reading collection
    if(queryInfo.isAttachedJournal!="null"){
      getJournalBasedOnId(this.journalId).then(result => this.setState({journalData: result.data}));
    }else{
      getUnattachedJournalBasedOnId(this.journalId).then(result => this.setState({journalData: result.data}));
    }

  }

  render(){
    // console.log("ShowJournal:",this.state.journalData);
    return (
      <div>{!this.state.journalData ? <Loading /> : <AddJournal journalData={this.state.journalData} history={this.props.history} />}</div>

    );
  }

}
export default ShowJournal;
