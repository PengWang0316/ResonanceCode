import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import styles from '../styles/JournalSharingModal.module.css';

import { fetchUsersAmount, fetchAllUserList } from '../actions/UserActions';
import { updateJournalShareList } from '../actions/JournalActions';
// import LoadingAnimation from './SharedComponents/LoadingAnimation';
import UserPicker from './UserPicker';

/** Show the journal sharing modal */
export class JournalSharingModal extends Component {
  static propTypes = {
    journal: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    usersAmount: PropTypes.number,
    user: PropTypes.object.isRequired,
    readingId: PropTypes.string.isRequired,
    fetchUsersAmount: PropTypes.func.isRequired,
    fetchAllUserList: PropTypes.func.isRequired,
    updateJournalShareList: PropTypes.func.isRequired
  };

  static defaultProps = {
    journal: null,
    usersAmount: null
  };

  state = {
    shareList: {}
  };
  /** Fetching the total amount number of user and the first page user name.
    * @return {null} No return.
  */
  componentWillMount() {
    this.props.fetchUsersAmount();
    this.props.fetchAllUserList(0);
  }

  /** When receive a new journal from props, save its sharingList to state.
    * this.existedShareList is an array that contains all existed users' id which will not be notificated again.
    * @param {object} nextProps is an object that contains props' value.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if ((this.props.journal !== nextProps.journal) &&
    nextProps.journal) {
      const shareList = {};
      if (nextProps.journal.shareList)
        this.existedShareList = nextProps.journal.shareList.map(share => {
          shareList[share.id] = share;
          return share.id;
        });
      this.setState({ shareList });
    }
  }

  /** Removing the user from state when the user click remove button.
    * @param {object} target is the html element a user is clicking.
    * @return {null} No return.
  */
  handleRemoveUserCallback = ({ target }) => {
    const newShareList = Object.assign({}, this.state.shareList);
    delete newShareList[target.getAttribute('userid')];
    this.setState({ shareList: newShareList });
  };

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
      shareList: Object.assign({
        [userId]: {
          id: userId,
          displayName: target.innerText,
          photo,
          sharedDate: new Date()
        }
      }, this.state.shareList)
    });
  };

  /** Add all user in the group to shareList.
    * @param {object} event is an object that repersents the element a user is clicking.
    * @return {null} No return.
  */
  handleGroupClickCallback = ({ target }) => {
    let addShareList = {};
    this.props.user.settings.userGroups[target.id]
      .forEach(({ id, displayName, photo }) => {
        addShareList = {
          [id]: {
            id,
            displayName,
            photo,
            sharedDate: new Date()
          },
          ...addShareList
        };
      });
    this.setState({ shareList: { ...addShareList, ...this.state.shareList } });
    // this.props.user.settings.userGroups[target.id]
    //   .forEach(({ id, displayName, photo }) => this.setState({
    //     shareList: Object.assign({
    //       [id]: {
    //         id,
    //         displayName,
    //         photo,
    //         sharedDate: new Date()
    //       }
    //     }, this.state.shareList)
    //   }));
  };

  /** Saving the sharing information back to the journal.
    * @return {null} No return.
  */
  handleSave = () => {
    this.props.updateJournalShareList({
      journalId: this.props.journal._id,
      readingId: this.props.readingId,
      shareList: Object.keys(this.state.shareList).map(key => this.state.shareList[key]),
      existedShareList: this.existedShareList
    });
    $('#journalSharingModal').modal('toggle'); // $ will use the jQuery libaray from index.html.
  };

  /** Rendering the jsx for the component.
    * @return {jsx} Returning the jsx for the component.
  */
  render() {
    const { users, usersAmount, user } = this.props;
    return (
      <div className="modal fade" id="journalSharingModal" tabIndex="-1" role="dialog" aria-labelledby="journalSharingModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="journalSharingModalLabel">Share this journal with others</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div><b>Sharing List</b></div>
              <div className="text-muted">You are sharing this journal with users listed below.</div>
              <UserPicker
                userList={this.state.shareList}
                handleRemoveUser={this.handleRemoveUserCallback}
                chooseTextTitle="Pick users you want to share this journal with"
                users={users}
                usersAmount={usersAmount}
                user={user}
                removeText="Stop sharing with"
                handleAddUser={this.handleAddUserCallback}
                fetchAllUserList={fetchAllUserList}
                handleGroupClick={this.handleGroupClickCallback}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  journal: state.journal,
  users: state.users,
  usersAmount: state.usersAmount,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  fetchUsersAmount: _ => dispatch(fetchUsersAmount()),
  fetchAllUserList: _ => dispatch(fetchAllUserList()),
  updateJournalShareList: params => dispatch(updateJournalShareList(params))
});
export default connect(mapStateToProps, mapDispatchToProps)(JournalSharingModal);
