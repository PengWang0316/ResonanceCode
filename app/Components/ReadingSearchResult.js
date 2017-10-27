import React from 'react';
// import PropTypes from 'prop-types';

const ReadingSearchResult = ({ element, nameResult, handleClickCallback }) => {
  const handleClick = _ => handleClickCallback(element._id, element.reading_name);
  return (
    <div role="button" tabIndex="-1" onClick={handleClick} className="readingSearchItem">{nameResult[1]}<span className="matchKeyword">{nameResult[2]}</span>{nameResult[3]}</div>
  );
};
// ReadingSearchResult.propTypes = {
//   element
// };
export default ReadingSearchResult;
