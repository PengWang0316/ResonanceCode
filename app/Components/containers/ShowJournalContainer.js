import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryString from 'query-string';

import AddJournalContainer from './AddJournalContainer';
import { fetchJournal, fetchUnattachedJournal } from '../../actions/JournalActions';

/** The component that helps loading both attached and unattached journals */
class ShowJournalContainer extends Component {
  /** Analyizing url and use the correct api to fetch the journal.
    * @returns {null} No return.
  */
  componentWillMount() {
    const queryInfo = QueryString.parse(this.props.location.search);
    const { journalId } = queryInfo;

    // this.state={journalDate:null};
    // console.log("isAttachedJournal:",queryInfo.isAttachedJournal);
    // fetch journal from unattached journal collection (journal_entries) or reading collection
    if (queryInfo.isAttachedJournal !== 'undefined')
      this.props.fetchJournal(journalId);
    else
      this.props.fetchUnattachedJournal(journalId);
  }

  /** After updating, creating and deleting, forward to reading page.
    * @param {object} nextProps is the object that contains new props.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.journal && !nextProps.journal)
      this.props.history.push('/reading');
  }

  /** Rendering the AddJournalContainer for the user.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div>
        {this.props.journal &&
          <AddJournalContainer history={this.props.history} journal={this.props.journal} />}
      </div>
    );
  }
}
const mapStateToProps = (state, onwProps) => ({
  isLoading: state.isLoading,
  journal: state.journal
});
const mapDispatchToProps = (dispatch, onwProps) => ({
  fetchJournal: journalId => { dispatch(fetchJournal(journalId)); },
  fetchUnattachedJournal: journalId => { dispatch(fetchUnattachedJournal(journalId)); }
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowJournalContainer);
