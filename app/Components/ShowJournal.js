import React, { Component } from "react";
import AddJournal from "./AddJournal";
import {getJournalBasedOnId} from "../apis/DatabaseApi";
// import LoginApi from "../apis/LoginApi";
import QueryString from "query-string";
// import AddJournal from "./Addjournal";
import Loading from "./Loading";

class ShowJournal extends Component{

  componentWillMount(){
    let queryInfo=QueryString.parse(this.props.location.search);
    this.journalId=queryInfo.journalId;
    this.readingName=queryInfo.readingName;
    this.readingId=queryInfo.readingId;
    // this.journalDate=queryInfo.journalDate;
    this.state={journalDate:null};

    getJournalBasedOnId(this.journalId).then((result)=>{
      console.log("ShowJournal:",result);
      let data=result.data;
      let journalData={
        // isWriting: false,
        // journalDate: Util.getCurrentDateString(),
        pingPongState: data.ping_pong_state,
        overview: data.overview,
        internalEnvironment: data.internal_environment?data.internal_environment:"",
        relationalEnvironment: data.relational_environment?data.relational_environment:"",
        physicalEnvironment: data.physical_environment?data.physical_environment:"",
        creativeVector: data.creative_vector?data.creative_vector:"",
        synchronicities: data.synchronicities?data.synchronicities:"",
        dreams: data.dreams?data.dreams:"",
        date: data.date,
        readingId: this.readingId,
        userId:data.user_id,
        journalId: data._id,
        readingName: this.readingName
      };
      this.setState({journalData: journalData});
    });
  }

  render(){
    // console.log("ShowJournal:",this.state.journalData);
    return (
      <div>{!this.state.journalData?<Loading /> : <AddJournal journalData={this.state.journalData} history={this.props.history} />}</div>

    );
  }

}
export default ShowJournal;
