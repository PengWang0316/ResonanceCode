import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Util from "../apis/Util";

const JournalRow = (props)=>{
  // Finding a content to show
  let journalContentKeys = Object.keys(props.journal);
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

  return(
    <div className="journal-row-div">
      <Link to={{pathname:"/showJournal",search:`?journalId=${props.journal._id}&readingName=${props.journal.readingName}&readingId=${props.readingId}`}}>
        <div><b>{Util.getDateString(props.journal.date)}</b></div>
        <div><b>{firstContentName}:</b></div>
        <div className="journal_brief_overview">{props.journal[firstContentKey]}</div>
      </Link>
    </div>
  );
};
JournalRow.proptypes={
  journal: PropTypes.object.isrequired
};
export default JournalRow;
