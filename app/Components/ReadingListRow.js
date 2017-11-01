import React from 'react';

import Util from '../apis/Util';

const ReadingListRow = ({ reading, handleClick }) => {
  const heandleRowClick = _ => {
    handleClick(reading._id, reading.reading_name);
    $('#readingListModal').modal('toggle'); // $ will use jQuery in the index.html page.
  };
  return (
    <div onClick={heandleRowClick} role="button" tabIndex="-1" className="reading-row-div m-1 p-2 none-outline">
      <span className="mr-4"><b>{reading.reading_name}</b></span>
      <span>{Util.getDateString(reading.date)}</span>
    </div>
  );
};
export default ReadingListRow;
