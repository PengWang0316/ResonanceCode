import React from 'react';

const ReadingSearchItem = ({
  readingName, readingId, pingPongStates,
  readingIndex, handleDeleteCallback, handlePingPongStateChangeCallback
}) => {
  const handleDelete = _ => handleDeleteCallback(readingId, readingIndex);
  const handlePingPongStateChange = ({ target }) =>
    handlePingPongStateChangeCallback(readingId, target.value);
  return (
    <div>
      <div className="row readingListNameDiv">
        <div className="col-xs-10">{readingName}</div>
        <div role="button" tabIndex="-2" className="col-xs-2 readingListDeletIcon" onClick={handleDelete}><i className="fa fa-trash delete-icon" /></div>
      </div>

      <div className="row pingPongStateDiv">
        <div className="col-xs-1">&#8627;</div>
        <div className="col-xs-10">
          <select id="pingPongState" className="form-control" defaultValue={pingPongStates[readingId] ? pingPongStates[readingId] : 'Reading'} onChange={handlePingPongStateChange}>
            <option value="Inquiring">Inquiring</option>
            <option value="Listening">Listening</option>
            <option value="Mystery Speaking">Mystery Speaking</option>
            <option value="Integrating Information">Integrating Information</option>
            <option value="Responding">Responding</option>
            <option value="Pre-reading">Pre-reading</option>
            <option value="Completion">Completion</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default ReadingSearchItem;
