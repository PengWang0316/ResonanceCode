import React, { Component } from "react";
import PropTypes from "prop-types";
import { getReadingBasedOnName } from "../apis/DatabaseApi";
import { isLogin } from "../apis/LoginApi";

class ReadingSearchAndList extends Component{

  componentWillMount(){
    console.log("ReadingSearchAndList: ", this.props);
    this.readingIndexTracker = {}; // Tracking reading index in the array (delete function needs)
    this.readingIndex = 0;
    this.searchFunction = null; // Keeping search function
    this.userId = isLogin(document).userid;
    this.state = {
      searchReading: "", // tracking search input text
      readingArray: [], // components for readings
      searchResults: [] // Keeping search results
    };

    /*putting readings' pingPongStates to state if it is updating
      The format is like {readingId: pingPongState}
    */
    this.pingPongStates = this.props.pingPongStates;

    // console.log("this.props.readings", this.props.readings);
    // if readings has already exsited, put them in the list in order to update
    if(this.props.readings){
      Object.keys(this.props.readings).map((readingId)=>{
        this.handleAddReading(this.props.readings[readingId], readingId, this.readingIndex++);
      });
    }

  }

  handleChange(event, element){
    let newState={};
    let keyWord = event.target.value;
    newState[element] = keyWord;
    // start to search
    if (keyWord.length > 2) this.searchKeyWord(keyWord);
    this.setState(newState);
  }

  /*
   *  Considering the performance, setting up a timeout to delay search api call for 1s.
   *  If somebody type fast, it can save serval database operation
  */
  searchKeyWord(keyWord){
    // console.log("start to search: ", keyWord);
    if(this.searchFunction) clearTimeout(this.searchFunction);
    this.searchFunction = setTimeout(()=>{
      // console.log(`${keyWord} api call`);
      getReadingBasedOnName(keyWord, this.userId).then((result)=>{
        this.state.searchResults=[];
        let keyWordExpression = new RegExp(`(.*)(${keyWord})(.*)`,"i");
        // console.log("result:", result);
        result.data.map((element, index)=>{
          // Format the new
          let nameResult = element.reading_name.match(keyWordExpression);
          // console.log(nameResult);
          this.state.searchResults.push(<div onClick={()=>{this.handleResultClick(element._id, element.reading_name);}} className="readingSearchItem" key={index}>{nameResult[1]}<span className="matchKeyword">{nameResult[2]}</span>{nameResult[3]}</div>);
        });

        if (this.state.searchResults.length===0) this.state.searchResults.push(<div key="noResult" className="readingSearchItem">No Result</div>);
        this.setState({searchResults: this.state.searchResults});
      });

      /*this.state.searchResults.push(<div key={keyWord}>{keyWord}</div>);
      this.setState({searchResults: this.state.searchResults});*/
    }, 1000);
  }

  handleResultClick(readingId, readingName){
    // console.log(readingId, readingName);
    this.setState({searchResults: [], searchReading: ""});
    this.handleAddReading(readingName, readingId, this.readingIndex++);
  }

  handlePingPongStateChange(readingId, event){
    // console.log(readingId, event.target.value);
    // this.setState([readingId]: event.target.value);
    this.props.handlePingpongstateChangeCallback(readingId, event.target.value);
  }

  handleAddReading(readingName, readingId, readingIndex){
    // console.log("key:", readingIndex)
    // Putting reading component in the object
    // let pingPongState = this.state[readingId];
    this.readingIndexTracker[readingIndex] =
    <div key={readingIndex}>

      <div className="row readingListNameDiv">
        <div className="col-xs-10">{readingName}</div>
        <div className="col-xs-2 readingListDeletIcon" onClick={()=>{this.handleDelete(readingId, readingIndex);}}><i className="fa fa-trash delete-icon" /></div>
      </div>

      {/*<label htmlFor="pingPongState" className="col-sm-3 col-form-label">Ping Pong State</label>*/}
      <div className="row pingPongStateDiv">
        <div className="col-xs-1">&#8627;</div>
        <div className="col-xs-10">
          <select id="pingPongState" className="form-control" defaultValue={this.pingPongStates[readingId]?this.pingPongStates[readingId]:"Neutral"} onChange={(event)=>{this.handlePingPongStateChange(readingId, event);}}>
            <option value="Neutral">Neutral</option>
            <option value="Reading/Call">Reading/Call</option>
            <option value="Impact absorbing">Impact absorbing</option>
            <option value="Impact complete">Impact complete</option>
            <option value="Response">Response</option>
            <option value="Outward moving">Outward moving</option>
            <option value="Outward complete">Outward complete</option>
          </select>
        </div>
      </div>

    </div>;


    this.setReadingToStateArray();
    this.props.attachReadingCallback(readingId);

  }

  handleDelete(readingId, readingIndex){
    // console.log("delete reading:", readingId, readingIndex);
    // this.state.readingArray.splice(this.readingIndexTracker[readingIndex], 1);
    delete this.readingIndexTracker[readingIndex];
    this.setReadingToStateArray();
    this.props.detachReadingCallback(readingId);
    // console.log("array:",this.state.readingArray);
  }

  setReadingToStateArray(){
    // transfor object to array in order to display
    this.state.readingArray=[];
    Object.keys(this.readingIndexTracker).map((element)=>{
      this.state.readingArray.push(this.readingIndexTracker[element]);
    });
    this.setState({readingArray: this.state.readingArray});
  }

  render(){
    return(
      <div className="row addJournalContentDiv">

        {/* Search input */}
        <div className="col-sm-5">
          <div><label htmlFor="searchReading" className="col-form-label">Search and pick up readings</label></div>
          <div>
            <input className="form-control" type="text" placeholder="Type reading name here..." id="searchReading" value={this.state.searchReading} onChange={(event)=>{this.handleChange(event, "searchReading")}} />
          </div>

          {/* showing searching result */}
          {this.state.searchResults.length!==0 &&
            <div className="readingSearchResultDiv">
              {this.state.searchResults}
            </div>
          }
        </div>

        {/* Reading list */}
        <div className="col-sm-7">
          <div className="font-bold">Reading List (This journal will attach on)</div>
          <div className="container-fluid readingListDiv">
            {this.state.readingArray}
          </div>
        </div>

      </div>
    );
  }

}
ReadingSearchAndList.propTypes = {
  detachReadingCallback: PropTypes.func.isRequired,
  attachReadingCallback: PropTypes.func.isRequired,
  readings: PropTypes.object
};
export default ReadingSearchAndList;
