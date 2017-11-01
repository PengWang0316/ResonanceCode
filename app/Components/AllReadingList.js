import React from 'react';
import { connect } from 'react-redux';

import Pagination from './SharedComponents/Pagination';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import { fetchAllReadingList as fetchAllReading } from '../actions/ReadingActions';
import { NUMBER_OF_READING_PER_PAGE } from '../config';
import ReadingListRow from './ReadingListRow';

/* Show the all reading in the list */
const AllReadingList = ({
  readings, readingsAmount, fetchAllReadingList, handleClick
}) => (
  <div className="modal fade" id="readingListModal" tabIndex="-1" role="dialog" aria-labelledby="readingListModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="readingListModalLabel">Select a reading for this journal</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <LoadingAnimation />
          <div className="mb-3">
            {readings.map(reading => <ReadingListRow key={`${reading.name}_${reading.date}`} reading={reading} handleClick={handleClick} />)}
          </div>

          {/* Pagination componentWillMount
            * Keeping readingsAmount, numberPerpage, and fetchContent out of AllReadingListPagination component can help it raising reusability.
          */}
          {readingsAmount !== null && <Pagination
            readingsAmount={readingsAmount}
            fetchContent={fetchAllReadingList}
            numberPerpage={NUMBER_OF_READING_PER_PAGE}
          />}

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
);
const mapStateToProps = state => ({
  readings: state.readings,
  readingsAmount: state.readingsAmount
});
const mapDispatchToProps = dispatch => ({
  fetchAllReadingList: pageNumber => dispatch(fetchAllReading(pageNumber))
});
export default connect(mapStateToProps, mapDispatchToProps)(AllReadingList);
