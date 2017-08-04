import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Util from "../apis/Util";

class JournalRow extends Component{

  componentWillMount(){
    // Finding a content to show
    let journalContentKeys = Object.keys(this.props.journal);
    this.firstContentKey = "";
    let firstContentName = "No content";
    // let keyLength = journalContentKeys.length;
    let keyExpression = /(.*)-\d+$/; //Using this to pick up the content field
    this.journalContentArray = [];
    journalContentKeys.map((key, index) => {
      let result = key.match(keyExpression);
      if (result){
        // console.log("match: ", result);
        this.journalContentArray.push(
          <div key={index}>
            <div><b>{result[1].replace("_", " ")}:</b></div>
            <div className="journal_brief_overview">{this.props.journal[result[0]]}</div>
          </div>
        );
      }
    });
    this.firstJournalContentArray = [];
    if(this.journalContentArray.length === 0) {
      this.firstJournalContent = <div><b>No Content</b></div>;
    }else{
      this.firstJournalContent = this.journalContentArray.shift();
    }
    // console.log(this.journalContentArray);
    /*for (let i=0;i<keyLength;i++){
      let result = journalContentKeys[i].match(keyExpression);
      if (result){
        firstContentKey = result[0];
        firstContentName = result[1].replace("_", " ");
        break;
      }
    }*/

    this.state = {
      isExpand: false // Tracking whether the journal is expanded
    };
  }

  handleExpandClick(){
    this.setState({isExpand: !this.state.isExpand});
  }

  render(){

    /*// Finding a content to show
    let journalContentKeys = Object.keys(this.props.journal);
    let firstContentKey = "";
    let firstContentName = "No content";
    let keyLength = journalContentKeys.length;
    let keyExpression = /(.*)-\d+/;
    for (let i=0;i<keyLength;i++){
      let result = journalContentKeys[i].match(keyExpression);
      if (result){
        firstContentKey = result[0];
        firstContentName = result[1].replace("_", " ");
        break;
      }
    }
*/
    return(
      <div className="journal-row-div" onClick={()=>{this.handleExpandClick();}}>

          <div><b>{Util.getDateString(this.props.journal.date)}</b><Link to={{pathname:"/showJournal",search:`?journalId=${this.props.journal._id}&isAttachedJournal=${this.props.readingId}`}}><i className="fa fa-pencil-square-o"></i></Link></div>
          {this.props.readingId && <div>PingPongState: {this.props.journal.pingPongStates[this.props.readingId]}</div>}

          {this.firstJournalContent}

          {this.state.isExpand && this.journalContentArray}



      </div>
    );
  }

}
JournalRow.proptypes={
  journal: PropTypes.object.isrequired
};
export default JournalRow;
