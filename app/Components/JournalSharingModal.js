import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from '../styles/JournalSharingModal.module.css';
import { NUMBER_OF_USER_PER_PAGE } from '../config';
import { fetchUsersAmount, fetchAllUserList } from '../actions/UserActions';
import { updateJournalShareList } from '../actions/JournalActions';
import Pagination from './SharedComponents/Pagination';
import LoadingAnimation from './SharedComponents/LoadingAnimation';

/** Show the journal sharing modal */
export class JournalSharingModal extends Component {
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
    * @param {object} nextProps is an object that contains props' value.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if ((this.props.journal !== nextProps.journal) &&
    nextProps.journal) {
      const shareList = {};
      if (nextProps.journal.shareList)
        nextProps.journal.shareList.forEach(share => { shareList[share.id] = share; });
      this.setState({ shareList });
    }
  }

  /** Removing the user from state when the user click remove button.
    * @param {object} target is the html element a user is clicking.
    * @return {null} No return.
  */
  handleRemoveUser = ({ target }) => {
    const newShareList = Object.assign({}, this.state.shareList);
    delete newShareList[target.getAttribute('userid')];
    this.setState({ shareList: newShareList });
  };

  /** Adding the user to the state when a user click a user's name from user name list. The html element includes a img or i tag and a text element.
    * @param {object} target is the html element a user is clicking.
    * @return {null} No return.
  */
  handleAddUser = ({ target }) => {
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

  /** Saving the sharing information back to the journal.
    * @return {null} No return.
  */
  handleSave = () => {
    this.props.updateJournalShareList({
      journalId: this.props.journal._id,
      readingId: this.props.readingId,
      shareList: Object.keys(this.state.shareList).map(key => this.state.shareList[key])
    });
    $('#journalSharingModal').modal('toggle'); // $ will use the jQuery libaray from index.html.
  };

  /** Rendering the jsx for the component.
    * @return {jsx} Returning the jsx for the component.
  */
  render() {
    const { users, usersAmount } = this.props;
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
              <div className="text-muted">This journal will be shared with users are listed below.</div>
              <div className={`${styles.shareListDiv} d-flex flex-wrap mb-4`}>
                {this.state.shareList && Object.keys(this.state.shareList).map(key => (
                  <div key={this.state.shareList[key].id} className="mr-3">
                    {this.state.shareList[key].photo ? <img className={`${styles.avatarPhoto}`} src={this.state.shareList[key].photo} alt="user" /> : <i className="fa fa-user-circle" aria-hidden="true" />} {this.state.shareList[key].displayName} <i userid={this.state.shareList[key].id} role="button" className={`fa fa-times ${styles.closeBtn}`} aria-hidden="true" title={`Stop sharing with ${this.state.shareList[key].displayName}`} onClick={this.handleRemoveUser} />
                  </div>
                ))}
              </div>
              {/* Starting to show user searching component */}
              <div>
                <div className="mb-2"><b>Pick users you want to share this journal with</b></div>
                <div>
                  <form className="form-inline">
                    <div className="form-group mr-2 mb-0">
                      <label htmlFor="inputUsername" className="sr-only">User Name</label>
                      <input type="password" className="form-control" id="inputUsername" placeholder="User's name" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Search</button>
                  </form>
                </div>
                <div className={`${styles.userListDiv} d-flex flex-wrap mt-3`}>
                  <LoadingAnimation />
                  {users && users.map(user => {
                    if (Object.prototype.hasOwnProperty.call(this.state.shareList, user._id) ||
                    user._id === this.props.user._id || user.role === 1) return null;
                    return <div role="button" tabIndex="-1" onClick={this.handleAddUser} userid={user._id} key={user._id} className={`${styles.userNameDiv}`}>{user.photo ? <img className={`${styles.avatarPhoto} mr2`} src={user.photo} alt="user" /> : <i className="fa fa-user-circle mr-2" aria-hidden="true" />}{user.displayName}</div>;
                  })
                  }
                  {usersAmount !== null &&
                    <div className="mt-3 w-100 d-flex justify-content-end">
                      <Pagination
                        amount={usersAmount}
                        fetchContent={fetchAllUserList}
                        numberPerpage={NUMBER_OF_USER_PER_PAGE}
                      />
                    </div>}
                </div>
              </div>
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
