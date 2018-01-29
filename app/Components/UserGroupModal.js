import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserPicker from './UserPicker';
import { fetchUsersAmount, fetchAllUserList, updateUserGroup } from '../actions/UserActions';

/** The form that will be used to create and edit user group information. */
export class UserGroupModal extends Component {
  static propTypes = {
    userGroup: PropTypes.array,
    groupName: PropTypes.string.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    users: PropTypes.array,
    usersAmount: PropTypes.number,
    user: PropTypes.object.isRequired,
    fetchUsersAmount: PropTypes.func.isRequired,
    fetchAllUserList: PropTypes.func.isRequired,
    updateUserGroup: PropTypes.func.isRequired
  };

  static defaultProps = {
    users: [],
    usersAmount: 0,
    userGroup: null
  };

  state = { userList: {}, groupName: '', isUpdate: false };

  /** Fetching the users and userAmount for the component.
    * @param {object} props is an object contains vaules for the component.
    * @return {null} No return.
  */
  componentWillMount() {
    this.props.fetchUsersAmount();
    this.props.fetchAllUserList(0);
  }

  /** When receive a new userGroup from props, save it to state.
    * @param {object} nextProps is an object that contains props' value.
    * @return {null} No return.
  */
  componentWillReceiveProps({ userGroup, groupName, isUpdate }) {
    this.setState({ userList: {}, groupName: '', isUpdate });
    if ((this.props.userGroup !== userGroup) &&
    userGroup) {
      const userList = {};
      userGroup.forEach(share => { userList[share.id] = share; });
      this.setState({ userList, groupName, isUpdate });
      // this.isUpdate = true;
    }
  }

  /** Updating the state when a user changes group name input.
    * @param {object} event is an object that repersents the element the user is reacting with.
    * @return {null} No return.
  */
  handleInputChange = ({ target }) => this.setState({ [target.id]: target.value });

  /** Adding the user to the state when a user click a user's name from user name list. The html element includes a img or i tag and a text element.
    * @param {object} target is the html element a user is clicking.
    * @return {null} No return.
  */
  handleAddUserCallback = ({ target }) => {
    let photo = null;
    let userId = null;
    if (target.childNodes[0]) { // If the target does not have a child node, a user is clicking on the avatar photo.
      photo = target.childNodes[0].getAttribute('src') ? target.childNodes[0].getAttribute('src') : '';
      userId = target.getAttribute('userid');
    } else { // Using a different approach to get information when a user click on the avater photo.
      photo = target.getAttribute('src') ? target.getAttribute('src') : '';
      userId = target.parentElement.getAttribute('userid');
    }
    this.setState({
      userList: Object.assign({
        [userId]: {
          id: userId,
          displayName: target.innerText,
          photo
        }
      }, this.state.userList)
    });
  };

  /** Add all user in the group to shareList.
    * @param {object} event is an object that repersents the element a user is clicking.
    * @return {null} No return.
  */
  handleGroupClickCallback = ({ target }) => {
    const addUserList = {};
    this.props.user.settings.userGroups[target.id]
      .forEach(({ id, displayName, photo }) => {
        addUserList[id] = {
          id,
          displayName,
          photo,
          sharedDate: new Date()
        };
      });
    this.setState({ userList: { ...addUserList, ...this.state.userList } });
  };

  /** Removing the user from state when the user click remove button.
    * @param {object} target is the html element a user is clicking.
    * @return {null} No return.
  */
  handleRemoveUserCallback = ({ target }) => {
    const newUserList = Object.assign({}, this.state.userList);
    delete newUserList[target.getAttribute('userid')];
    this.setState({ userList: newUserList });
  };

  /** Saving the sharing information back to the journal.
    * @return {null} No return.
  */
  handleSave = () => {
    this.props.updateUserGroup({ // Do have to go through Redux since the method has to update user state in Redux.
      isUpdate: this.state.isUpdate,
      newGroupName: this.state.groupName,
      oldGroupName: this.props.groupName, // If the component has oldGroupName and it is different with newGroupName, we have to remove the old data.
      userList: Object.keys(this.state.userList).map(key => this.state.userList[key])
    });
    $('#userGroupModal').modal('toggle'); // $ will use the jQuery libaray from index.html.
  };

  /** When a user clicks cancel button, reset state for next use.
    * @return {null} No return.
  */
  // handleCancelClick = () => {
  //   this.isUpdate = false; // Reset the update indicator.
  //   this.setState({ userList: {}, groupName: '' }); // also reset the states for next use.
  // };


  /** Rendering the jsx for the component.
    * @return {jsx} Return jsx for the component.
  */
  render() {
    return (
      <div className="modal fade" id="userGroupModal" tabIndex="-1" role="dialog" aria-labelledby="userGroupModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="userGroupModalLabel">User group</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group row font-weight-bold">
                <label htmlFor="inputGroupName" className="col-sm-3 col-form-label">Group name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="groupName" placeholder="The name of user group..." value={this.state.groupName} onChange={this.handleInputChange} />
                </div>
              </div>
              <UserPicker
                userList={this.state.userList}
                handleRemoveUser={this.handleRemoveUserCallback}
                chooseTextTitle="Pick users you want to put in this group"
                users={this.props.users}
                usersAmount={this.props.usersAmount}
                user={this.props.user}
                removeText="Move out this user to the group"
                handleAddUser={this.handleAddUserCallback}
                fetchAllUserList={fetchAllUserList}
                handleGroupClick={this.handleGroupClickCallback}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" disabled={this.state.groupName === '' || Object.keys(this.state.userList).length === 0} onClick={this.handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  users: state.users,
  usersAmount: state.usersAmount,
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fetchUsersAmount: _ => dispatch(fetchUsersAmount()),
  fetchAllUserList: _ => dispatch(fetchAllUserList()),
  updateUserGroup: params => dispatch(updateUserGroup(params))
});
export default connect(mapStateToProps, mapDispatchToProps)(UserGroupModal);
