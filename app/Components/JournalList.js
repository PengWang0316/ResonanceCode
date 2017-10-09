import React, { Component } from 'react';
// import { getJournalList } from "../apis/api";
import QueryString from 'query-string';
import { connect } from 'react-redux';
import { fetchUnattachedJournals, fetchJournals } from '../actions/JournalActions';
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
 * Getting queryInfo from url and load Journals for the page.
 * @returns {null} return null
 */
  componentWillMount() {
    // console.log("componentWillMount");
    const queryInfo = QueryString.parse(this.props.location.search);
    this.readingName = queryInfo.readingName;
    this.readingId = queryInfo.readingId;
    // this.readingDate=queryInfo.readingDate;
    // this.state = { journalList: null };
    // const user = LoginApi.isLogin(document);
    // If there is not readingId in the url, read unattached Journals
    if (!queryInfo.readingId) {
      this.props.fetchUnattachedJournals();
      /* Deprecated old version
      getUnattachedJournalList(user.userid).then((result) => {
        this.assembleJournalRow(result.data, null);
      }); */
    } else {
      this.props.fetchJournals(queryInfo.readingId);
      /* Deprecated old version
      getJournalList(queryInfo.readingId, user.role * 1 === 1 ? '' : user.userid).then((result) => {
        // console.log("Journal list page getjournallist:",result);
        this.assembleJournalRow(result.data, queryInfo.readingId);
      }); */
    }
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
    );
  }
}
const mapStateToProps = state => ({ journals: state.journals });
const mapDispatchToProps = dispatch => ({
  fetchUnattachedJournals: _ => dispatch(fetchUnattachedJournals()),
  fetchJournals: readingId => dispatch(fetchJournals(readingId))
});
export default connect(mapStateToProps, mapDispatchToProps)(JournalList);
