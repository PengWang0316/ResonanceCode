import React, { Component } from 'react';

import styles from '../styles/UserGroups.module.css';
import UserGroupModal from './UserGroupModal';
import DeleteUserGroupComformModal from './DeleteUserGroupComformModal';

/** Showing the user group list. */
class UserGroups extends Component {
  state = {
    userGroup: null, groupName: '', isUpdate: false, deleteGroupName: ''
  };

  /** setting a listener to clear states when modal is closed.
    * $ will use the jQuery library from index.html page.
    * @return {null} No return.
  */
  componentDidMount() {
    $('#userGroupModal').on('hidden.bs.modal', () => {
      // this.isUpdate = false; // Reset the update indicator.
      this.setState({ userGroup: null, groupName: '', isUpdate: false }); // also reset the states for next use.
    });
  }

  /** Showing the userGroupModal when a user click a group lable.
    * $ will use jQuery libaray comes from index.html.
    * @param {object} event is an object that repersents the element a user is clicking.
    * @return {null} No return.
  */
  handleClick = ({ target }) => {
    this.setState({ userGroup: this.props.userGroups[target.parentElement.id], groupName: target.parentElement.id, isUpdate: true }, () => $('#userGroupModal').modal('toggle'));
  };

  /** Showing the adding user group modal when a user clicks add group button.
    * @return {null} No return.
  */
  handleAddGroupClick = () => {
    this.setState({ userGroup: null, groupName: '', isUpdate: false }, () => $('#userGroupModal').modal('toggle'));
  };

  /** Show a conform modal when a user clicks the delete button.
    * $ will use the jQuery libaray from index.html page.
    * @param {object} event is an object that repersents the element a user is clicking.
    * @return {null} No return.
  */
  handleRemoveGroup = ({ target }) =>
    this.setState({ deleteGroupName: target.parentElement.id }, () =>
      $('#deleteUserGroupConformModal').modal('toggle'));
  /** Rendering the jsx for the component.
    * @return {null} Return jsx for the component.
  */
  render() {
    return (
      <div>
        <div className={`card border-dark mb-3 ${styles.cardDiv}`}>
          <h5 className="card-header">Existed user groups</h5>
          <div className="card-body text-dark">
            <div className="d-flex flex-wrap">
              {this.props.userGroups &&
                 Object.keys(this.props.userGroups).map(key => (
                   <div key={key} id={key} className={`mr-3 ${styles.groupDiv}`} title={this.props.userGroups[key].map(user => user.displayName).join()}>
                     <span tabIndex="-1" role="button" onClick={this.handleClick}>{key}</span> <i role="button" className={`fa fa-times ${styles.closeBtn}`} aria-hidden="true" title="Delete this group" onClick={this.handleRemoveGroup} />
                   </div>
                 ))}
            </div>
            <div className="text-right mt-4"><button type="button" className="btn btn-primary" onClick={this.handleAddGroupClick}>Add Group</button></div>
          </div>
        </div>
        <UserGroupModal
          userGroup={this.state.userGroup}
          groupName={this.state.groupName}
          isUpdate={this.state.isUpdate}
        />
        <DeleteUserGroupComformModal groupName={this.state.deleteGroupName} />
      </div>
    );
  }
}
// const mapStateToProps = state => ({
//   user: state.user
// });
export default UserGroups;
