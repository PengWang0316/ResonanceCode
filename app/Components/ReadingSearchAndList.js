import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from '../styles/ReadingSearchAndList.module.css';
import ReadingSearchResult from './ReadingSearchResult';
import ReadingSearchItem from './ReadingSearchItem';
import AllReadingList from './AllReadingList';
import { fetchReadingBasedOnName, fetchAllReadingList, fetchReadingsAmount } from '../actions/ReadingActions';
// import PropTypes from 'prop-types';
// import { getReadingBasedOnName } from '../apis/DatabaseApi';
// import { isLogin } from '../apis/LoginApi';

/** The component will be in charge of searching readings for a journal. */
class ReadingSearchAndList extends Component {
  /** Preventing submit event when a user hit the enter key.
    * @param {object} event is the object comes from the interactive input.
    * @returns {null} No return.
  */
  static preventSubmit = event => {
    if (event.charCode === 13) event.preventDefault();
  }

  state = {
    searchReading: '', // tracking search input text
    readingArray: [], // components for readings
    searchResults: [] // Keeping search results
  };

  /** Setting up some initial variables and states. Organizing reading information if there is any reading has already exsited.
    * Also, fetch the number of readings in order to let show all reading list to use it if this number has not existed.
  * @returns {null} No return.
  */
  componentWillMount() {
    // console.log("ReadingSearchAndList: ", this.props);
    this.readingIndexTracker = {}; // Tracking reading index in the array (delete function needs)
    this.readingIndex = 0;
    this.searchFunction = null; // Keeping search function
    /* putting readings' pingPongStates to state if it is updating
      The format is like {readingId: pingPongState}
    */
    this.pingPongStates = this.props.pingPongStates;

    // console.log("this.props.readings", this.props.readings);
    // if readings has already exsited, put them in the list in order to update
    if (this.props.existReadings)
      Object.keys(this.props.existReadings).forEach(readingId => {
        this.handleAddReading(this.props.existReadings[readingId], readingId, this.readingIndex++);
      });
    // this.props.clearSearchReadings();
    if (this.props.readingsAmount === null) this.props.fetchReadingsAmount();
  }

  /** After recieve searchReadings from props, organizing searching list.
    * @param {object} nextProps contain new props this component will recieve.
    * @returns {null} No return.
  */
  componentWillReceiveProps({ searchReadings }) {
    if (this.props.searchReadings !== searchReadings) {
      this.state.searchResults = [];
      const keyWordExpression = new RegExp(`(.*)(${this.keyWord})(.*)`, 'i');
      // console.log("result:", result);
      searchReadings.forEach(element => {
        // Format the new
        const nameResult = element.reading_name.match(keyWordExpression);
        // console.log(nameResult);
        this.state.searchResults.push(<ReadingSearchResult
          key={element._id}
          element={element}
          nameResult={nameResult}
          handleClickCallback={this.handleResultClickCallback}
        />);
      });
      if (this.state.searchResults.length === 0) this.state.searchResults.push(<div key="noResult" className="readingSearchItem">No Result</div>);
      this.setState({ searchResults: this.state.searchResults });
    }
  }

  /** Transforing object to array in order to display
    * @returns {null} No return.
  */
  setReadingToStateArray() {
    this.state.readingArray = [];
    Object.keys(this.readingIndexTracker).forEach((element) => {
      this.state.readingArray.push(this.readingIndexTracker[element]);
    });
    this.setState({ readingArray: this.state.readingArray });
    // console.log('readingArray: ', this.state.readingArray);
  }

  /** Searching the keywork a user typing.
    * Considering the performance, setting up a timeout to delay search api call for 1s.
   * If somebody type fast, it can save serval database operation
   * @param {string} keyWord is the string a user is typing.
   * @returns {null} No return.
  */
  searchKeyWord(keyWord) {
    // console.log("start to search: ", keyWord);
    if (this.searchFunction) clearTimeout(this.searchFunction);
    this.searchFunction = setTimeout(() => {
      this.keyWord = keyWord;
      this.props.fetchReadingBasedOnName(keyWord);
      /* this.state.searchResults.push(<div key={keyWord}>{keyWord}</div>);
      this.setState({searchResults: this.state.searchResults}); */
    }, 1000);
  }

  /** Clearing the search result states and adding the readings to the component.
    * @param {string} readingId is the id of reading.
    * @param {string} readingName is the name of reading.
    * @returns {null} No return.
  */
  handleResultClickCallback = (readingId, readingName) => {
    // console.log(readingId, readingName);
    // this.props.clearSearchReadings();
    this.setState({ searchResults: [], searchReading: '' });
    this.handleAddReading(readingName, readingId, this.readingIndex++);
  }

  /** Trigering the callback function when PingPonState is beening changed.
    * @param {string} readingId is the id of reading.
    * @param {string} optionValue is the value comes from the option is reacting with.
    * @returns {null} No return.
  */
  handlePingPongStateChangeCallback = (readingId, optionValue) =>
    this.props.handlePingpongstateChangeCallback(readingId, optionValue);

  /** Assembling jsx code for showing the reading list.
    * @param {string} readingName is the name of reading.
    * @param {string} readingId is the id of reading.
    * @param {int} readingIndex is the index number that this reading in the reading array.
    * @returns {null} No return.
  */
  handleAddReading(readingName, readingId, readingIndex) {
    // console.log("key:", readingIndex)
    // Putting reading component in the object
    // let pingPongState = this.state[readingId];
    this.readingIndexTracker[readingIndex] = (
      <ReadingSearchItem
        key={readingId}
        readingId={readingId}
        readingName={readingName}
        readingIndex={readingIndex}
        pingPongStates={this.pingPongStates}
        handlePingPongStateChangeCallback={this.handlePingPongStateChangeCallback}
        handleDeleteCallback={this.handleDeleteCallback}
      />);

    /* Giving the reading a default pingPongState */
    this.props.handlePingpongstateChangeCallback(readingId, this.pingPongStates[readingId] ? this.pingPongStates[readingId] : 'Pre-reading');
    this.setReadingToStateArray();
    this.props.attachReadingCallback(readingId);
  }

  /** Handling the deleting reading from attacthed reading list.
    * @param {string} readingId is the id of reading.
    * @param {int} readingIndex is the position this reading in the reading array.
    * @returns {null} No return.
    */
  handleDeleteCallback = (readingId, readingIndex) => {
    // console.log("delete reading:", readingId, readingIndex);
    // this.state.readingArray.splice(this.readingIndexTracker[readingIndex], 1);
    delete this.readingIndexTracker[readingIndex];
    this.setReadingToStateArray();
    this.props.detachReadingCallback(readingId);
    // console.log("array:",this.state.readingArray);
  };

  /** Handling the input value changing.
    * @param {object} event is the object comes from the interactive input.
    * @param {string} element is the id of input.
    * @return {null} No return.
  */
  handleChange = ({ target }) => {
    // this.props.clearSearchReadings();
    this.setState({ searchResults: [] });
    const newState = {};
    const keyWord = target.value;
    newState[target.id] = keyWord;
    // start to search
    if (keyWord.length > 2) this.searchKeyWord(keyWord);
    this.setState(newState);
  };

  /** Showing the reading list modal when a user click the button.
    * @return {null} No return.
    * $ will use jQuery in the index.html page.
  */
  handleShowReadingListClick = () => {
    if (this.props.allReadingList.length === 0) this.props.fetchAllReadingList(0); $('#readingListModal').modal('toggle');
  };

  /** Fetching the reading information when a user click a page number.
    * @param {int} pageNumber is the number of page a user wants to go.
    * @return {null} No return.
  */
  // handlePaginationClickCallback = pageNumber => this.props.fetchAllReadingList(pageNumber);

  /** Rendering the jsx for the component.
    * @return {null} No return.
  */
  render() {
    return (
      <div className={`row ${styles.addJournalContentDiv}`}>

        {/* Search input */}
        <div className="col-sm-5">
          <div><label htmlFor="searchReading" className="col-form-label font-weight-bold">Search and select readings</label></div>
          <div>
            <input className="form-control" type="text" placeholder="Type reading name here..." id="searchReading" value={this.state.searchReading} onChange={this.handleChange} onKeyPress={ReadingSearchAndList.preventSubmit} />
            <small id="searchReadingHelp" className="form-text text-muted mb-2">Skip if this is a pre-reading entry.</small>
            <div><button onClick={this.handleShowReadingListClick} type="button" className="btn btn-primary btn-sm">Show all reading list</button></div>
          </div>

          {/* showing searching result */}
          {this.state.searchResults.length !== 0 &&
            <div className={`${styles.readingSearchResultDiv}`}>
              {this.state.searchResults}
            </div>
          }
        </div>

        {/* Reading list */}
        <div className="col-sm-7">
          <div className="font-weight-bold">Reading List (This journal can be attached to multiple readings.)</div>
          <div className={`container-fluid ${styles.readingListDiv}`}>
            {this.state.readingArray}
          </div>
        </div>

        {/* Search Reading modal */}
        <AllReadingList handleClick={this.handleResultClickCallback} />

      </div>
    );
  }
}
/*
ReadingSearchAndList.propTypes = {
  detachReadingCallback: PropTypes.func.isRequired,
  attachReadingCallback: PropTypes.func.isRequired,
  readings: PropTypes.object
}; */
const mapStateToProps = state => ({
  searchReadings: state.searchReadings,
  allReadingList: state.allReadingList,
  readingsAmount: state.readingsAmount
});
const mapDispatchToProps = dispatch => ({
  fetchReadingBasedOnName: keyWord => dispatch(fetchReadingBasedOnName(keyWord)),
  // clearSearchReadings: _ => dispatch(clearSearchReadings()),
  // clearReadings: _ => dispatch(clearReadings()),
  fetchAllReadingList: _ => dispatch(fetchAllReadingList()),
  fetchReadingsAmount: _ => dispatch(fetchReadingsAmount())
});
export default connect(mapStateToProps, mapDispatchToProps)(ReadingSearchAndList);
