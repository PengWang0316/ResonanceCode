import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteUserGroup } from '../actions/UserActions';

export const DeleteUserGroupComformModal = ({ deleteUserGroupProps, groupName }) => {
  const handleDelete = _ => deleteUserGroupProps(groupName);
  return (
    <div className="modal fade" id="deleteUserGroupConformModal" tabIndex="-1" role="dialog" aria-labelledby="deleteUserGroupConformModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteUserGroupConformModalLabel">Delete user group: {groupName}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="alert alert-warning">This deteling will not be recovered!</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={handleDelete}>Delete</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>);
};
DeleteUserGroupComformModal.propTypes = {
  deleteUserGroupProps: PropTypes.func.isRequired,
  groupName: PropTypes.string
};
DeleteUserGroupComformModal.defaultProps = { groupName: '' };
/* istanbul ignore next */
const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteUserGroupProps: groupName => dispatch(deleteUserGroup(groupName))
});
export default connect(null, mapDispatchToProps)(DeleteUserGroupComformModal);
