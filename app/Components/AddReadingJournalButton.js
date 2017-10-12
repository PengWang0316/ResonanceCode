import React  from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

const AddReadingJurnalButton = () => {
  return (
    <div className="addBtnDiv" onClick={()=>{handleAddBtnClick();}}>
      <Link to={{pathname:"/addreading"}}><div id="addReadingBtn" className="addBtn addReadingBtn text-center">Reading</div></Link>
      <Link to={{pathname:"/addJournal"}}><div id="addJournalBtn" className="addBtn addJournalBtn text-center">Journal</div></Link>
      <div className="addBtn"><i className="fa fa-plus" /></div>
    </div>
  );
};

const handleAddBtnClick = () =>{
  let isShowAddBtns = $("#addReadingBtn").css("opacity")!="0";
  let opacity=isShowAddBtns?"0":"1";
  let readingBottom=isShowAddBtns?"25px":"85px";
  let journalBottom=isShowAddBtns?"25px":"145px";
  $("#addReadingBtn").css({"opacity":opacity, "bottom":readingBottom});
  $("#addJournalBtn").css({"opacity":opacity, "bottom":journalBottom});
};

export default AddReadingJurnalButton;
