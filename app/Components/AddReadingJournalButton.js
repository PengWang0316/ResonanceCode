import React from 'react';
import { Link } from 'react-router-dom';
import jQuery from 'jquery';

import styles from '../styles/AddReadingJournalButton.module.css';

const handleAddBtnClick = () => {
  const isShowAddBtns = jQuery('#addReadingBtn').css('opacity') !== '0';
  const opacity = isShowAddBtns ? '0' : '1';
  const readingBottom = isShowAddBtns ? '25px' : '85px';
  const journalBottom = isShowAddBtns ? '25px' : '145px';
  jQuery('#addReadingBtn').css({ opacity, bottom: readingBottom });
  jQuery('#addJournalBtn').css({ opacity, bottom: journalBottom });
};

// $ will use jQuery in the index.html.
const handleAddReadingButtonClick = () => $('#addReadingModal').modal('toggle');

const AddReadingJurnalButton = () => (
  <div role="button" tabIndex="-3" onClick={handleAddBtnClick}>
    {/* this $('#addReadingModal').modal('toggle') will use jQuery from index.html */}
    <div role="button" tabIndex="-4" onClick={handleAddReadingButtonClick} id="addReadingBtn" className={`${styles.addBtn} ${styles.addReadingBtn} text-center`}>Reading</div>
    <Link to={{ pathname: '/addJournal' }}><div id="addJournalBtn" className={`${styles.addBtn} ${styles.addJournalBtn} text-center`}>Journal</div></Link>
    <div className={`${styles.addBtn}`}><i className="fa fa-plus" /></div>
  </div>
);

export default AddReadingJurnalButton;
