import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchReadingBasedOnName, clearSearchReadings } from '../actions/ReadingActions';
// import PropTypes from 'prop-types';
// import { getReadingBasedOnName } from '../apis/DatabaseApi';
// import { isLogin } from '../apis/LoginApi';

/** The component will be in charge of searching readings for a journal. */
class ReadingSearchAndList extends Component {
  /** Preventing submit event when a user hit the enter key.
    * @param {object} event is the object comes from the interactive input.
    * @returns {null} No return.
  */
  static preventSubmit(event) {
    if (event.charCode === 13) event.preventDefault();
  }

  /** Setting up some initial variables and states. Organizing reading information if there is any reading has already exsited.
  * @returns {null} No return.
  */
  componentWillMount() {
    // console.log("ReadingSearchAndList: ", this.props);
    this.readingIndexTracker = {}; // Tracking reading index in the array (delete function needs)
    this.readingIndex = 0;
    this.searchFunction = null; // Keeping search function
    // this.userId = isLogin(document).userid;
    this.state = {
      searchReading: '', // tracking search input text
      readingArray: [], // components for readings
      searchResults: [] // Keeping search results
    };
    /* putting readings' pingPongStates to state if it is updating
      The format is like {readingId: pingPongState}
    */
    this.pingPongStates = this.props.pingPongStates;

    // console.log("this.props.readings", this.props.readings);
    // if readings has already exsited, put them in the list in order to update
    if (this.props.readings)
      Object.keys(this.props.readings).forEach(readingId => {
        this.handleAddReading(this.props.readings[readingId], readingId, this.readingIndex++);
      });
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
        this.state.searchResults.push(<div role="button" tabIndex="-1" onClick={_ => this.handleResultClick(element._id, element.reading_name)} className="readingSearchItem" key={element._id}>{nameResult[1]}<span className="matchKeyword">{nameResult[2]}</span>{nameResult[3]}</div>);
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
  handleResultClick(readingId, readingName) {
    // console.log(readingId, readingName);
    // this.props.clearSearchReadings();
    this.setState({ searchResults: [], searchReading: '' });
    this.handleAddReading(readingName, readingId, this.readingIndex++);
  }

  /** Trigering the callback function when PingPonState is beening changed.
    * @param {string} readingId is the id of reading.
    * @param {object} event comes from the option is reacting with.
    * @returns {null} No return.
  */
  handlePingPongStateChange(readingId, event) {
    // console.log(readingId, event.target.value);
    // this.setState([readingId]: event.target.value);
    this.props.handlePingpongstateChangeCallback(readingId, event.target.value);
  }

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
      <div key={readingIndex}>
        <div className="row readingListNameDiv">
          <div className="col-xs-10">{readingName}</div>
          <div role="button" tabIndex="-2" className="col-xs-2 readingListDeletIcon" onClick={() => { this.handleDelete(readingId, readingIndex); }}><i className="fa fa-trash delete-icon" /></div>
        </div>

        <div className="row pingPongStateDiv">
          <div className="col-xs-1">&#8627;</div>
          <div className="col-xs-10">
            <select id="pingPongState" className="form-control" defaultValue={this.pingPongStates[readingId] ? this.pingPongStates[readingId] : 'Reading'} onChange={(event) => { this.handlePingPongStateChange(readingId, event); }}>
              <option value="Inquiring">Inquiring</option>
              <option value="Listening">Listening</option>
              <option value="Mystery Speaking">Mystery Speaking</option>
              <option value="Integrating Information">Integrating Information</option>
              <option value="Responding">Responding</option>
              <option value="Pre-reading">Pre-reading</option>
              <option value="Completion">Completion</option>
            </select>
          </div>
        </div>
      </div>);

    /* Giving the reading a default pingPongState */
    this.props.handlePingpongstateChangeCallback(readingId, this.pingPongStates[readingId] ? this.pingPongStates[readingId] : 'Inquiring');
    this.setReadingToStateArray();
    this.props.attachReadingCallback(readingId);
  }

  /** Handling the deleting reading from attacthed reading list.
    * @param {string} readingId is the id of reading.
    * @param {int} readingIndex is the position this reading in the reading array.
    * @returns {null} No return.
    */
  handleDelete(readingId, readingIndex) {
    // console.log("delete reading:", readingId, readingIndex);
    // this.state.readingArray.splice(this.readingIndexTracker[readingIndex], 1);
    delete this.readingIndexTracker[readingIndex];
    this.setReadingToStateArray();
    this.props.detachReadingCallback(readingId);
    // console.log("array:",this.state.readingArray);
  }

  /** Handling the input value changing.
    * @param {object} event is the object comes from the interactive input.
    * @param {string} element is the id of input.
    * @return {null} No return.
  */
  handleChange(event, element) {
    // this.props.clearSearchReadings();
    this.setState({ searchResults: [] });
    const newState = {};
    const keyWord = event.target.value;
    newState[element] = keyWord;
    // start to search
    if (keyWord.length > 2) this.searchKeyWord(keyWord);
    this.setState(newState);
  }

  /** Rendering the jsx for the component.
    * @return {null} No return.
  */
  render() {
    return (
      <div className="row addJournalContentDiv">

        {/* Search input */}
        <div className="col-sm-5">
          <div><label htmlFor="searchReading" className="col-form-label font-weight-bold">Search and select readings</label></div>
          <div>
            <input className="form-control" type="text" placeholder="Type reading name here..." id="searchReading" value={this.state.searchReading} onChange={event => { this.handleChange(event, 'searchReading'); }} onKeyPress={event => ReadingSearchAndList.preventSubmit(event)} />
            <small id="searchReadingHelp" className="form-text text-muted">Skip if this is a pre-reading entry.</small>
          </div>

          {/* showing searching result */}
          {this.state.searchResults.length !== 0 &&
            <div className="readingSearchResultDiv">
              {this.state.searchResults}
            </div>
          }
        </div>

        {/* Reading list */}
        <div className="col-sm-7">
          <div className="font-weight-bold">Reading List (This journal can be attached to multiple readings.)</div>
          <div className="container-fluid readingListDiv">
            {this.state.readingArray}
          </div>
        </div>

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
  searchReadings: state.searchReadings
});
const mapDispatchToProps = dispatch => ({
  fetchReadingBasedOnName: keyWord => dispatch(fetchReadingBasedOnName(keyWord)),
  clearSearchReadings: _ => dispatch(clearSearchReadings())
});
export default connect(mapStateToProps, mapDispatchToProps)(ReadingSearchAndList);
