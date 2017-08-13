import React, { Component } from "react";
import PropTypes from "prop-types";
import { matchDateFormat, getDateString, getCurrentDateString } from "../apis/Util";
import JournalContent from "./JournalContent";
import ReadingSearchAndList from "./ReadingSearchAndList";

class JournalForm extends Component {

  componentWillMount(){
    // Initial variables
    this.readings = this.props.journalData && this.props.journalData.pingPongStates ? this.props.journalData.pingPongStates : {}; // keep which readings should be attached on. Format is like {readingId: pingPongState}
    this.contents = {}; // Keep content keys and content
    this.contentKeyIndex = 0; // Generate keys for different contents
    this.contentIndexs = {}; // Use to track the index of content component in the array. Delete function needs it. The format is {contentKey: index}
    this.journalId = this.props.journalData ? this.props.journalData._id : null; // Keeping journal id for update
    this.userId = this.props.userId;

    this.state={
      journalDate: this.props.journalData ? getDateString(this.props.journalData.date) : getCurrentDateString(),
      isDateCorrect: true,
      isEmptyReading: this.props.journalData && this.props.journalData.pingPongStates ? false : true,
      contentComponentArray: [], // keep content component
      addJournalContent: "overview"
    };

    // console.log("Journal before alter: ", this.props.journalData);
    // If journal data exsit, get content
    if(this.props.journalData){
      // console.log(this.props.journalData.readingIds);
      // this.oldContentKeys = []; // keep original content keys
      this.readingIds = this.props.journalData.readingIds ? this.props.journalData.readingIds : null;
      this.oldReadingIds = this.readingIds ? Object.keys(this.props.journalData.readingIds) : null; // keep original reading ids

      // delete unnecessary properties from journal object
      let journal = Object.assign({}, this.props.journalData); /* Making a copy in order to prevent side effects */
      this.journalUserId = journal.user_id;
      delete journal.date;
      delete journal.user_id;
      // delete journal.ping_pong_state;
      delete journal._id;
      delete journal.readingIds;
      delete journal.pingPongStates;
      let keyRegExp = /-(\d+)$/; // The regular expression for subtract suffixs
      // console.log("Journal after alter: ", this.props.journalData);
      Object.keys(journal).map((key)=>{
        // this.oldContentKeys.push(key); // keeping the exsit keys in an array for delete function
        // handleAddContentClick(addJournalContent, newContentName, newContentKey, contentKeyIndex, isShared)
        // Also have to save the largest key number and use it to countine
        // journalData property is like {'overview-0': 'test overview', 'overview-0-isShared': true}
        // if key is isShared do not do anything
        let matchResult = key.match(keyRegExp);
        if (matchResult){
          if (this.contentKeyIndex < matchResult[1]) this.contentKeyIndex = matchResult[1]; // keep the max index number and user can contiune add new content
          this.handleAddContentClick(journal[key], key.replace(keyRegExp, ""), key, matchResult[1], journal[`${key}-isShared`]);
          // console.log("isShared: ",journal[`${key}-isShared`]);
        }
      });
      this.contentKeyIndex++;
    }

  }

  handleAddContentClick(addJournalContent, newContentName, newContentKey, contentKeyIndex, isShared){
    // put component in array in order to show
    newContentKey = newContentKey ? newContentKey : `${this.state.addJournalContent}-${this.contentKeyIndex}`;
    // put the component in the track object
    this.contentIndexs[newContentKey]=<JournalContent key={contentKeyIndex ? contentKeyIndex : this.contentKeyIndex++} newContent={addJournalContent ? addJournalContent : ""} newContentName={newContentName ? newContentName : this.state.addJournalContent} newContentKey={newContentKey} handleChangeCallback={(contentKey, contentText)=>{this.handleChangeCallback(contentKey, contentText);}} handleDeleteContentCallback={(contentKey)=>{this.handleDeleteContentCallback(contentKey);}} handleSharedBoxChangeCallback={(contentKey, isShared)=>{this.handleSharedBoxChangeCallback(contentKey, isShared)}} isShared={isShared ? true : false} />;
    this.setComponentToStateArray();
    // this.setState({contentComponentArray: this.state.contentComponentArray});

    // also have to put content title to state in order to track content and update
    this.contents[newContentKey] = addJournalContent ? addJournalContent : "";
    this.contents[`${newContentKey}-isShared`] = isShared ? true : false;
  }

  handleChangeCallback(contentKey, contentText){
    // console.log(contentKey, contentText);
    // update content in state
    this.contents[contentKey]=contentText;
  }

  handleDeleteContentCallback(contentKey){
    // Remove content from state
    if(this.contents.hasOwnProperty(contentKey)){
      delete this.contents[contentKey];
      delete this.contents[`${contentKey}-isShared`];
    }
    // Remove content component
    delete this.contentIndexs[contentKey];
    this.setComponentToStateArray();
    // this.state.contentComponentArray.splice(this.contentIndexs[contentKey],1);
    // this.setState({contentComponentArray: this.state.contentComponentArray});
  }

  setComponentToStateArray(){
    // transfor object to array in order to display
    this.state.contentComponentArray=[];
    Object.keys(this.contentIndexs).map((element)=>{
      this.state.contentComponentArray.push(this.contentIndexs[element]);
    });
    this.setState({contentComponentArray: this.state.contentComponentArray});
  }

  handleSharedBoxChangeCallback(contentKey, isShared){
    this.contents[`${contentKey}-isShared`] = isShared;
  }

  handleChange(event, element){
    let newState={};
    newState[element]=event.target.value;
    if(element=="journalDate") newState.isDateCorrect = matchDateFormat(newState[element]);
    this.setState(newState);
  }

  /* For ReadingSearchAndList callback */
  handleAttachReadingCallback(readingId){
    // console.log(this.readings);
    if(!this.readings[readingId]) this.readings[readingId] = "Neutral";
    this.setState({isEmptyReading: false});
  }

  handlePingpongstateChangeCallback(readingId, pingPongState){
    this.readings[readingId] = pingPongState;
    // console.log("pingPongState:", `${readingId} : ${pingPongState}`);
  }

  handleDetachAttachReadingCallback(readingId){
    delete this.readings[readingId];
    this.setState({isEmptyReading: Object.keys(this.readings).length===0});
  }

  handleCancel(){
    this.props.history.push("/reading");
  }

  handleDelete(event){
    // console.log("Delete journal!");
    event.preventDefault();
    this.props.handleDelete(this.journalId, Object.keys(this.readings), this.userId, this.oldReadingIds ? false : true);
    // console.log("**********delete************");
    // DatabaseApi.deleteJournal(this.journalId, Object.keys(this.readings), this.userId).then((reault)=>{this.props.history.push("/reading")});
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.handleSubmit({
      isUpdate: this.props.journalData ? true : false,
      journalId: this.journalId,
      journalDate: this.state.journalDate,
      userId: this.userId,
      readings: this.readings,
      contents: this.contents,
      oldReadingIds: this.oldReadingIds
    });
  }

  render(){
      return(
        <div className="addReadingDiv">

          <div className="titleDiv">{this.props.journalData ? "Update journal for readings" : "Add a new journal for readings"}</div>
          <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>

            <div className="text-right bottom-btn-div">
              {(!this.props.journalData || this.userId == this.journalUserId) &&
                <button type="submit" className="btn btn-info loginButton" disabled={this.props.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect)}>{this.props.journalData ? "Update" : "Submit"}</button>
              }
              {(this.props.journalData && this.userId == this.journalUserId) &&
                <button onClick={(event)=>{this.handleDelete(event)}} type="button" className="btn btn-danger loginButton">Delete</button>
              }
              <button onClick={()=>{this.handleCancel()}} type="button" className="btn btn-nomal loginButton">Cancel</button>
            </div>

              <div className="form-group row form-div">
                <div className="col-sm-6 row">
                  <div className="col-xs-3">
                    <label htmlFor="journalDate" className="col-sm-1 col-form-label">Date</label>
                  </div>
                  <div className="col-xs-9">
                    <input className={this.state.isDateCorrect?"form-control":"form-control form-control-warning"} type="text" placeholder="mm/dd/yyyy" id="journalDate" value={this.state.journalDate} onChange={(event)=>{this.handleChange(event, "journalDate")}} />
                    {!this.state.isDateCorrect && <span className="glyphicon glyphicon-warning-sign form-control-feedback form-control-warning-span"></span>}
                  </div>
                </div>
                <div className="col-sm-6">
                  (The date fromat is mm/dd/yyyy)
                </div>
              </div>



              {/*  Start reading search function */}
              <ReadingSearchAndList readings={this.props.journalData ? this.readingIds : null} pingPongStates={this.readings} attachReadingCallback={(readingId)=>{this.handleAttachReadingCallback(readingId);}} detachReadingCallback={(readingId)=>{this.handleDetachAttachReadingCallback(readingId);}} handlePingpongstateChangeCallback={(readingId, pingPongState)=>{this.handlePingpongstateChangeCallback(readingId, pingPongState);}}
              />


              {/* New content goes here */}
              {this.state.contentComponentArray}

              {/* Add content button and drop list */}
              <div className="row addJournalContentDiv">

                <div onClick={()=>{this.handleAddContentClick();}} className="addJournalContentBtnDiv col-sm-6"><i className="fa fa-plus-square" /> Add one content for your journal</div>
                <div className="col-sm-6">
                  <select  className="form-control" onChange={(event)=>{this.handleChange(event,"addJournalContent");}}>
                    <option value="overview">Overview</option>
                    <option value="internal_environment">Internal Environment</option>
                    <option value="relational_environment">Relational Environment</option>
                    <option value="physical_environment">Physical Environment</option>
                    <option value="creative_vector">Creative Vector</option>
                    <option value="synchronicities">Synchronicities</option>
                    <option value="dreams">Dreams</option>
                    <option value="dreams">Seasonal</option>
                    <option value="other">Other</option>
                  </select>

                </div>

              </div>


                <div className="text-right bottom-btn-div">
                  {(!this.props.journalData || this.userId == this.journalUserId) &&
                    <button type="submit" className="btn btn-info loginButton" disabled={this.props.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect)}>{this.props.journalData ? "Update" : "Submit"}</button>
                  }
                  {(this.props.journalData && this.userId == this.journalUserId) &&
                    <button onClick={(event)=>{this.handleDelete(event)}} type="button" className="btn btn-danger loginButton">Delete</button>
                  }
                  <button onClick={()=>{this.handleCancel()}} type="button" className="btn btn-nomal loginButton">Cancel</button>
                </div>
            </form>

          </div>
      );

  }

}
JournalForm.propTypes = {
  journalData: PropTypes.object,
  userId: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  isWriting: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
};
export default JournalForm;
