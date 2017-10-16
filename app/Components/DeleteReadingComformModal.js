import React from 'react';
import { connect } from 'react-redux';
import { deleteReading } from '../actions/ReadingActions';

const DeleteReadingComformModal = ({ readingName, readingId, deleteReadingProps }) => (
  <div className="modal fade" id="deleteReadingConformModal" tabIndex="-1" role="dialog" aria-labelledby="deleteReadingConformModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="deleteReadingConformModalLabel">Delete reading: {readingName}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p className="alert alert-warning">This deteling will not be recovered!</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={_ => deleteReadingProps(readingId)}>Delete</button>
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>);
const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteReadingProps: readingId => dispatch(deleteReading(readingId))
});
export default connect(null, mapDispatchToProps)(DeleteReadingComformModal);
