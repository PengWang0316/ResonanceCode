import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/ReadingSearchItem.module.css';

const ReadingSearchItem = ({
  readingName, readingId, pingPongStates,
  readingIndex, handleDeleteCallback, handlePingPongStateChangeCallback
}) => {
  const handleDelete = _ => handleDeleteCallback(readingId, readingIndex);
  const handlePingPongStateChange = ({ target }) =>
    handlePingPongStateChangeCallback(readingId, target.value);
  return (
    <div>
      <div className={`row ${styles.readingListNameDiv}`}>
        <div className="col-xs-10">{readingName}</div>
        <div role="button" tabIndex="-2" className="col-xs-2 pr-1" onClick={handleDelete}><i className={`fa fa-trash ${styles.deleteIcon}`} /></div>
      </div>

      <div className="row pl-2">
        <div className="col-xs-1">&#8627;</div>
        <div className="col-xs-10">
          <select id="pingPongState" className="form-control" defaultValue={pingPongStates[readingId] ? pingPongStates[readingId] : 'Pre-reading'} onChange={handlePingPongStateChange}>
            <option value="Pre-reading">Pre-reading</option>
            <option value="Inquiring">Inquiring</option>
            <option value="Listening">Listening</option>
            <option value="Mystery Speaking">Field Speaking</option>
            <option value="Integrating Information">Integrating Information</option>
            <option value="Responding">Responding</option>
            <option value="Completion">Completion</option>
          </select>
        </div>
      </div>
    </div>
  );
};
ReadingSearchItem.propTypes = {
  readingName: PropTypes.string.isRequired,
  readingId: PropTypes.string.isRequired,
  pingPongStates: PropTypes.object.isRequired,
  readingIndex: PropTypes.number.isRequired,
  handleDeleteCallback: PropTypes.func.isRequired,
  handlePingPongStateChangeCallback: PropTypes.func.isRequired
};
export default ReadingSearchItem;
