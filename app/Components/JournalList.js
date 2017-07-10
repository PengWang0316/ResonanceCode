import React, { Component } from "react";
// import { getJournalList } from "../apis/api";
import { getJournalList } from "../apis/DatabaseApi";
import QueryString from "query-string";
import LoginApi from "../apis/LoginApi";
import Loading from "./Loading";
import JournalRow from "./JournalRow";


class JournalList extends Component{

  componentWillMount(){
    let queryInfo=QueryString.parse(this.props.location.search);
    this.readingName=queryInfo.readingName;
    // this.readingDate=queryInfo.readingDate;
    this.state={journalList:null};
    let user=LoginApi.isLogin(document);
    getJournalList(queryInfo.readingId, user.role==1?"":user.userid).then((result)=>{
      // console.log("Journal list page getjournallist:",result);
      let journalArray = [];
      result.data.map((element)=>{
        element.readingName=this.readingName;
        // element.readingDate=this.readingDate;
        journalArray.push(<JournalRow key={element._id} journal={element} readingId={queryInfo.readingId}/>);
      });
      this.setState({journalList:journalArray});
    });
  }

  render(){
    return (
      <div className="addReadingDiv">
        <div className="rcTitle">Journal list for {this.readingName}</div>
        {this.state.journalList?this.state.journalList:<Loading />}
      </div>
    );
  }

}
export default JournalList;
