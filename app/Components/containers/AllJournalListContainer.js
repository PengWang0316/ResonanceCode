import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from '../../styles/AllJournalListContainer.module.css';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import JournalRow from '../JournalRow';
import Pagination from '../SharedComponents/Pagination';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { checkAuthentication } from '../../actions/UserActions';
import { fetchAllJournal } from '../../actions/JournalActions';
import { NUMBER_PER_PAGE_JOURNAL } from '../../config';

/** Show all journal a user has. */
export class AllJournalListContainer extends Component {
  state = {
    journals: []
  };
  /** Checking the users' authentication state and calling fetchAllJournal function from JournalActions.
    * @return {null} No return.
  */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    else if (this.props.allJournal.length === 0) this.props.fetchAllJournal();
    // When the component is mounted second time, all props will remind the same. The componentWillReceivedProps method will not be called. (Not sure whether it is a bug.) So, the code below can add a checking to prevent this happen.
    if (this.state.journals.length === 0 && this.props.allJournal.length !== 0)
      this.setState({ journals: this.props.allJournal.slice(0, NUMBER_PER_PAGE_JOURNAL) });
    // this.currentPage = 0;
  }

  /** Calling fetchAllJournal function from JournalActions after the user login.
    * Setting the first showing journal to state.
    * @param {object} nextProps is an object that contains props' vaule.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (!this.props.user.isAuth && nextProps.user.isAuth && this.props.allJournal.length === 0)
      this.props.fetchAllJournal();
    if (this.state.journals.length === 0 && nextProps.allJournal.length !== 0)
      this.setState({ journals: nextProps.allJournal.slice(0, NUMBER_PER_PAGE_JOURNAL) });
  }

  /** Getting the part of content from props.allJournal state and setting them to the component state.
    * @param {number} currentPage is the number of the page a user is clicking.
    * @return {null} No return.
  */
  changeContent = currentPage => {
    this.setState({
      journals: this.props.allJournal
        .slice(
          currentPage * NUMBER_PER_PAGE_JOURNAL,
          (currentPage * NUMBER_PER_PAGE_JOURNAL) + NUMBER_PER_PAGE_JOURNAL
        )
    });
  }

  /** Rendering jsx for the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className={`${styles.mainContentDiv}`}>
          <div className={`${styles.title}`}>Attached journal list</div>
          <div className="text-mute">(Not include <Link to={{ pathname: '/unattachedJournals', search: '?readingName=Unattached Journals' }}>unattached journals</Link>)</div>
          <LoadingAnimation />
          {/* Using the first reading id from the pingPongStates object. */}
          {this.state.journals.map(journal => (
            <JournalRow
              key={journal._id}
              journal={journal}
              readingId={Object.keys(journal.pingPongStates)[0]}
              isAllJournal
            />))}

          {this.props.allJournal.length !== 0 && <Pagination
            amount={this.props.allJournal.length}
            fetchContent={this.changeContent}
            numberPerpage={NUMBER_PER_PAGE_JOURNAL}
          />}
        </div>
      </UnauthenticatedUserCheck>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  allJournal: state.allJournal
});
const mapDispatchToProps = dispatch => ({
  fetchAllJournal: _ => dispatch(fetchAllJournal()),
  checkAuthentication: _ => dispatch(checkAuthentication())
});
export default connect(mapStateToProps, mapDispatchToProps)(AllJournalListContainer);
