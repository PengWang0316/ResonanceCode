import React from 'react';

import JournalRow from './JournalRow';

const SharedJournalListModal = ({ reading }) => (
  <div className="modal fade" id="sharedJournalListModal" tabIndex="-1" role="dialog" aria-labelledby="sharedJournalListModalLable" aria-hidden="true">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="sharedJournalListModalLable">{reading && <span>{`${reading.reading_name}'s shared journals'`}</span>}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {reading && reading.journal_entries.map(journal =>
            <JournalRow key={journal._id} journal={journal} isSharedJournal />)}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
);
export default SharedJournalListModal;
