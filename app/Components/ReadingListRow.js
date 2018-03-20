import React from 'react';
import PropTypes from 'prop-types';
import DateLib from 'date-format-lib';

import styles from '../styles/ReadingListRow.module.css';

const ReadingListRow = ({ reading, handleClick }) => {
  const heandleRowClick = _ => {
    handleClick(reading._id, reading.reading_name);
    $('#readingListModal').modal('toggle'); // $ will use jQuery in the index.html page.
  };
  return (
    <div onClick={heandleRowClick} role="button" tabIndex="-1" className={`${styles.readingRowDiv} m-1 p-2 ${styles.noneOutline}`}>
      <span className="mr-4"><b>{reading.reading_name}</b></span>
      <span>{DateLib.getDateString(reading.date, 'mm/dd/yyyy')}</span>
    </div>
  );
};
ReadingListRow.propTypes = {
  reading: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
};
export default ReadingListRow;
