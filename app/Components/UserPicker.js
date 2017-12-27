import React from 'react';

import LoadingAnimation from './SharedComponents/LoadingAnimation';
import styles from '../styles/UserPicker.module.css';
import { NUMBER_OF_USER_PER_PAGE } from '../config';
import Pagination from './SharedComponents/Pagination';

const UserPicker = ({
  userList, handleRemoveUser, chooseTextTitle, users, usersAmount,
  user, removeText, handleAddUser, fetchAllUserList, handleGroupClick
}) => (
  <div>
    <div className={`${styles.shareListDiv} d-flex flex-wrap mb-4`}>
      {userList && Object.keys(userList).map(key => (
        <div key={userList[key].id} className="mr-3">
          {userList[key].photo ? <img className={`${styles.avatarPhoto}`} src={userList[key].photo} alt="user" /> : <i className="fa fa-user-circle" aria-hidden="true" />} {userList[key].displayName} <i userid={userList[key].id} role="button" className={`fa fa-times ${styles.closeBtn}`} aria-hidden="true" title={`${removeText}  ${userList[key].displayName}`} onClick={handleRemoveUser} />
        </div>
      ))}
    </div>

    {/* Show the user groups */}
    <div className="mt-2"><b>Your user groups</b></div>
    <div className="mb-2 text-muted"><small>Pick groups to add users</small></div>
    <div className="d-flex flex-wrap mb-3">
      {user.settings.userGroups &&
         Object.keys(user.settings.userGroups)
          .map(key => <div role="button" tabIndex="-2" key={key} id={key} className={`${styles.userNameDiv}`} onClick={handleGroupClick} title={`This group includes ${user.settings.userGroups[key].map(groupUser => groupUser.displayName)}`}>{key}</div>)}
    </div>

    {/* Starting to show user searching component */}
    <div>
      <div className="mb-2"><b>{chooseTextTitle}</b></div>
      <div>
        <form className="form-inline">
          <div className="form-group mr-2 mb-0">
            <label htmlFor="inputUsername" className="sr-only">User Name</label>
            <input type="input" className="form-control" id="inputUsername" placeholder="User's name" />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>
      <div className={`${styles.userListDiv} d-flex flex-wrap mt-3`}>
        <LoadingAnimation />
        {users && users.map(eachUser => {
          if (Object.prototype.hasOwnProperty.call(userList, eachUser._id) ||
          eachUser._id === user._id || eachUser.role === 1) return null;
          return <div role="button" tabIndex="-1" onClick={handleAddUser} userid={eachUser._id} key={eachUser._id} className={`${styles.userNameDiv}`}>{eachUser.photo ? <img className={`${styles.avatarPhoto} mr2`} src={eachUser.photo} alt="user" /> : <i className="fa fa-user-circle mr-2" aria-hidden="true" />}{eachUser.displayName}</div>;
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
);
export default UserPicker;
