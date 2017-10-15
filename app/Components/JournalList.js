import React, { Component } from 'react';
// import { getJournalList } from "../apis/api";
import QueryString from 'query-string';
import { connect } from 'react-redux';
import { fetchUnattachedJournals, fetchJournals } from '../actions/JournalActions';
import { checkAuthentication } from '../actions/UserActions';
import UnauthenticatedUserCheck from './SharedComponents/UnauthenticatedUserCheck';
// import { getJournalList, getUnattachedJournalList } from '../apis/DatabaseApi';
// import LoginApi from '../apis/LoginApi';
// import Loading from "./Loading";
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import JournalRow from './JournalRow';

/**
 * JournalList component.
 */
class JournalList extends Component {
  /**
 * Getting this.queryInfo from url and load Journals for the page.
 * @returns {null} return null
 */
  componentWillMount() {
    // console.log("componentWillMount");
    this.queryInfo = QueryString.parse(this.props.location.search);
    this.readingName = this.queryInfo.readingName;
    this.readingId = this.queryInfo.readingId;
    // this.readingDate=this.queryInfo.readingDate;
    // this.state = { journalList: null };
    // const user = LoginApi.isLogin(document);
    // If there is not readingId in the url, read unattached Journals
    if (this.props.user.isAuth && !this.queryInfo.readingId)
      this.props.fetchUnattachedJournals();
    else if (this.props.user.isAuth)
      this.props.fetchJournals(this.queryInfo.readingId);
    else this.props.checkAuthentication();
  }

  /** Loading the data after authentication
    * @param {object} nextProps is an object of new props.
    * @return {null} No return;
  */
  componentWillReceiveProps(nextProps) {
    if (!this.props.user.isAuth && nextProps.user.isAuth)
      if (!this.queryInfo.readingId)
        this.props.fetchUnattachedJournals();
      else
        this.props.fetchJournals(this.queryInfo.readingId);
  }

  /**
   * Asseble journal for the row.
   * @param {object} journals are objects for journal.
   * @param {string} readingId is the id these journals belone to.
   * @returns {null} No return.
   */
  /* Deprecated old version
  assembleJournalRow(journals, readingId) {
    const journalArray = [];
    journals.forEach(element => {
      const newElement = Object.assign({ readingName: this.readingName }, element);
      // element.readingName = this.readingName;
      // element.readingDate=this.readingDate;
      journalArray.push(<JournalRow
        key={newElement._id}
        journal={newElement}
        readingId={readingId}
      />);
    });
    // this.setState({ journalList: journalArray });
  }
*/
  /**
   * Component render method.
   * @returns {jsx} The JSX for page.
   */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className="addReadingDiv">
          <div className="rcTitle">Journal list for {this.readingName}</div>
          <LoadingAnimation />
          {this.props.journals.map(journal => {
            const newJournal = Object.assign({ readingName: this.readingName }, journal);
            // element.readingName = this.readingName;
            // element.readingDate=this.readingDate;
            return (<JournalRow
              key={newJournal._id}
              journal={newJournal}
              readingId={this.readingId}
            />);
          })}
        </div>
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  journals: state.journals,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  fetchUnattachedJournals: _ => dispatch(fetchUnattachedJournals()),
  fetchJournals: readingId => dispatch(fetchJournals(readingId)),
  checkAuthentication: _ => dispatch(checkAuthentication())
});
export default connect(mapStateToProps, mapDispatchToProps)(JournalList);
