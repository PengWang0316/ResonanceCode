import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Util from "../apis/Util";

const JournalRow = (props)=>{
  return(
    <div className="journal-row-div">
      <Link to={{pathname:"/showJournal",search:`?journalId=${props.journal._id}&readingName=${props.journal.readingName}&readingId=${props.readingId}`}}>
        <div><b>{Util.getDateString(props.journal.date)}</b></div>
        <div><b>Overview:</b></div>
        <div className="journal_brief_overview">{props.journal.overview}</div>
      </Link>
    </div>
  );
};
JournalRow.proptypes={
  journal: PropTypes.object.isrequired
};
export default JournalRow;
