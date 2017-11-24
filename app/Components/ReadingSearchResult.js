import React from 'react';
// import PropTypes from 'prop-types';

import styles from '../styles/ReadingSearchResult.module.css';

const ReadingSearchResult = ({ element, nameResult, handleClickCallback }) => {
  const handleClick = _ => handleClickCallback(element._id, element.reading_name);
  return (
    <div role="button" tabIndex="-1" onClick={handleClick} className={`${styles.readingSearchItem}`}>{nameResult[1]}<span className={`${styles.matchKeyword}`}>{nameResult[2]}</span>{nameResult[3]}</div>
  );
};
// ReadingSearchResult.propTypes = {
//   element
// };
export default ReadingSearchResult;
