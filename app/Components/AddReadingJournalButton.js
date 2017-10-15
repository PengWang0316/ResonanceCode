import React from 'react';
import { Link } from 'react-router-dom';
import jQuery from 'jquery';

const handleAddBtnClick = () => {
  const isShowAddBtns = jQuery('#addReadingBtn').css('opacity') !== '0';
  const opacity = isShowAddBtns ? '0' : '1';
  const readingBottom = isShowAddBtns ? '25px' : '85px';
  const journalBottom = isShowAddBtns ? '25px' : '145px';
  jQuery('#addReadingBtn').css({ opacity, bottom: readingBottom });
  jQuery('#addJournalBtn').css({ opacity, bottom: journalBottom });
};

const AddReadingJurnalButton = () => (
  <div role="button" tabIndex="-3" className="addBtnDiv" onClick={_ => handleAddBtnClick()}>
    {/* this $('#addReadingModal').modal('toggle') will use jQuery from index.html */}
    <div role="button" tabIndex="-4" onClick={_ => $('#addReadingModal').modal('toggle')} id="addReadingBtn" className="addBtn addReadingBtn text-center">Reading</div>
    <Link to={{ pathname: '/addJournal' }}><div id="addJournalBtn" className="addBtn addJournalBtn text-center">Journal</div></Link>
    <div className="addBtn"><i className="fa fa-plus" /></div>
  </div>
);

export default AddReadingJurnalButton;
