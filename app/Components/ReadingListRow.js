import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/ReadingListRow.module.css';
import Util from '../apis/Util';

const ReadingListRow = ({ reading, handleClick }) => {
  const heandleRowClick = _ => {
    handleClick(reading._id, reading.reading_name);
    $('#readingListModal').modal('toggle'); // $ will use jQuery in the index.html page.
  };
  return (
    <div onClick={heandleRowClick} role="button" tabIndex="-1" className={`${styles.readingRowDiv} m-1 p-2 ${styles.noneOutline}`}>
      <span className="mr-4"><b>{reading.reading_name}</b></span>
      <span>{Util.getDateString(reading.date)}</span>
    </div>
  );
};
ReadingListRow.propTypes = {
  reading: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
};
export default ReadingListRow;
