import React, { Component } from "react";
import PropTypes from "prop-types";
import { getReadingBasedOnName } from "../apis/DatabaseApi";
import { isLogin } from "../apis/LoginApi";

class ReadingSearchAndList extends Component{

  componentWillMount(){
    this.readingIndexTracker = {}; // Tracking reading index in the array (delete function needs)
    this.readingIndex = 0;
    this.searchFunction = null; // Keeping search function
    this.userId = isLogin(document).userid;
    this.state = {
      searchReading: "", // tracking search input text
      readingArray: [], // components for readings
      searchResults: [] // Keeping search results
    };
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
      console.log(`${keyWord} api call`);
      getReadingBasedOnName(keyWord, this.userId).then((result)=>{
        this.state.searchResults=[];
        // console.log("result:", result);
        result.data.map((element, index)=>{
          this.state.searchResults.push(<div onClick={()=>{this.handleResultClick(element._id, element.reading_name);}} className="readingSearchItem" key={index}>{element.reading_name}</div>);
        });

        if (this.state.searchResults.length===0) this.state.searchResults.push(<div key="noResult" className="readingSearchItem">No Result</div>);
        this.setState({searchResults: this.state.searchResults});
      });

      /*this.state.searchResults.push(<div key={keyWord}>{keyWord}</div>);
      this.setState({searchResults: this.state.searchResults});*/
    }, 1000);
  }

  handleResultClick(readingId, readingName){
    console.log(readingId, readingName);
    this.setState({searchResults: [], searchReading: ""});
    this.handleAddReading(readingName, readingId, this.readingIndex++);
  }

  handleAddReading(readingName, readingId, readingIndex){
    console.log("key:", readingIndex)
    // Putting reading component in the object
    this.readingIndexTracker[readingIndex] = <div className="row readingListNameDiv" key={readingIndex}><div className="col-xs-10">{readingName}</div><div className="col-xs-2 readingListDeletIcon" onClick={()=>{this.handleDelete(readingId, readingIndex);}}><i className="fa fa-trash delete-icon" /></div></div>;

    this.setReadingToStateArray();
    this.props.attachReadingCallback(readingId);

  }

  handleDelete(readingId, readingIndex){
    console.log("delete reading:", readingId, readingIndex);
    // this.state.readingArray.splice(this.readingIndexTracker[readingIndex], 1);
    delete this.readingIndexTracker[readingIndex];
    this.setReadingToStateArray();
    this.props.detachReadingCallback(readingId);
    console.log("array:",this.state.readingArray);
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

        <div className="col-sm-7">
          <div className="font-bold">Reading List (This journal will attach on)</div>
          <div className="container-fluid readingListDiv">
            {this.state.readingArray}
          </div>

        </div>

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

      </div>
    );
  }

}
ReadingSearchAndList.propTypes = {
  detachReadingCallback: PropTypes.func.isRequired,
  attachReadingCallback: PropTypes.func.isRequired
};
export default ReadingSearchAndList;
