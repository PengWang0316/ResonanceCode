import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import PropTypes from 'prop-types';

import AddJournalContainer from './AddJournalContainer';
import { fetchJournal, fetchUnattachedJournal } from '../../actions/JournalActions';

/** The component that helps loading both attached and unattached journals */
export class ShowJournalContainer extends Component {
  static propTypes = {
    journal: PropTypes.PropTypes.object,
    fetchJournal: PropTypes.func.isRequired,
    fetchUnattachedJournal: PropTypes.func.isRequired
  };
  static defaultProps = { journal: null };

  /** Analyizing url and use the correct api to fetch the journal.
    * @returns {null} No return.
  */
  componentWillMount() {
    const queryInfo = QueryString.parse(this.props.location.search);
    const { journalId, isAttachedJournal } = queryInfo;
    // fetch journal from unattached journal collection (journal_entries) or reading collection
    if (isAttachedJournal !== 'null')
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
/* istanbul ignore next */
const mapStateToProps = (state, onwProps) => ({
  journal: state.journal
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch, onwProps) => ({
  fetchJournal: journalId => { dispatch(fetchJournal(journalId)); },
  fetchUnattachedJournal: journalId => { dispatch(fetchUnattachedJournal(journalId)); }
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowJournalContainer);
