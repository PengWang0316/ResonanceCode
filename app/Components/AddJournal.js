import React, { Component } from "react";
import Util from "../apis/Util";
import Loading from "./Loading"
import JournalContent from "./JournalContent";
import ReadingSearchAndList from "./ReadingSearchAndList";
import { isLogin } from "../apis/LoginApi";
import DatabaseApi from "../apis/DatabaseApi";
import PropTypes from "prop-types";

class AddJournal extends Component {

  componentWillMount(){
    // Initial variables
    this.readings = this.props.journalData ? this.props.journalData.readingIds : {}; // keep which readings should be attached on. Format is like {readingId: null}
    this.contents = {}; // Keep content keys and content
    this.contentKeyIndex = 0; // Generate keys for different contents
    this.contentIndexs = {}; // Use to track the index of content component in the array. Delete function needs it. The format is {contentKey: index}
    this.jounalId = this.props.journalData ? this.props.journalData._id : null; // Keeping journal id for update
    this.userId = isLogin(document).userid;

    this.state={
      isWriting: false,
      journalDate: this.props.journalData ? Util.getDateString(this.props.journalData.date) : Util.getCurrentDateString(),
      isDateCorrect: true,
      isEmptyReading: this.props.journalData ? false : true,
      contentComponentArray: [], // keep content component
      addJournalContent: "overview",
      pingPongState: this.props.journalData ? this.props.journalData.ping_pong_state : "Neutral"
    };

    console.log("Journal before alter: ", this.props.journalData);
    // If journal data exsit, get content
    if(this.props.journalData){
      // this.oldContentKeys = []; // keep original content keys
      this.oldReadingIds = Object.keys(this.readings); // keep original reading ids

      // delete unnecessary properties from journal object
      let journal = this.props.journalData;
      this.journalUserId = journal.user_id;
      delete journal.date;
      delete journal.user_id;
      delete journal.ping_pong_state;
      delete journal._id;
      delete journal.readingIds;
      let keyRegExp = /-(\d+)$/; // The regular expression for subtract suffixs
      console.log("Journal after alter: ", this.props.journalData);
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

  handleChange(event, element){
    let newState={};
    newState[element]=event.target.value;
    if(element=="journalDate") newState.isDateCorrect = Util.matchDateFormat(newState[element]);
    this.setState(newState);
  }

  handleChangeCallback(contentKey, contentText){
    console.log(contentKey, contentText);
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

  handleSharedBoxChangeCallback(contentKey, isShared){
    this.contents[`${contentKey}-isShared`] = isShared;
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

  setComponentToStateArray(){
    // transfor object to array in order to display
    this.state.contentComponentArray=[];
    Object.keys(this.contentIndexs).map((element)=>{
      this.state.contentComponentArray.push(this.contentIndexs[element]);
    });
    this.setState({contentComponentArray: this.state.contentComponentArray});
  }

  handleSubmit(event, isUpdate){
    event.preventDefault();
    // console.log("submit: contents:",this.contents);
    console.log("journal date:",this.state.journalDate);
    // Assemble a journal object for save
    let readingIdArray = [];
    Object.keys(this.readings).map((key)=>{readingIdArray.push(key)});
    let journal = Object.assign({_id:this.jounalId, date: new Date(this.state.journalDate), ping_pong_state: this.state.pingPongState, user_id: this.userId, readingIds: readingIdArray}, this.contents);

    if(isUpdate){
      console.log("submit: journal:", journal);
      // console.log("oldContentKeys:", this.oldContentKeys);
      console.log("oldReadingKeys:", this.oldReadingIds);
      // Assemble two arrays for deletion contents and reading
      let deleteContents = [];
      let deleteReadingIds = [];
      // this.oldContentKeys.map((element)=>{if(!this.contents.hasOwnProperty(element)) deleteContents.push(element);});
      this.oldReadingIds.map((element)=>{if(!this.readings.hasOwnProperty(element)) deleteReadingIds.push(element);});
      // journal.deleteContents = deleteContents; //todo delete deleteContents and oldContentKeys
      journal.deleteReadingIds = deleteReadingIds;
      console.log("delete contents: ",deleteContents);
      console.log("delete reading ids : ",deleteReadingIds);
      DatabaseApi.updateJournal(journal).then((result)=>{
        this.props.history.push("/reading");
      });
    }else{
      DatabaseApi.createJournal(journal).then((result)=>{
        this.props.history.push("/reading");
      });
    }
    /**/
    this.setState({isWriting: true});
    console.log("submit: journal:", journal);
  }

  /* For ReadingSearchAndList callback */
  handleAttachReadingCallback(readingId){
    this.readings[readingId] = null;
    this.setState({isEmptyReading: false});
  }

  handleDetachAttachReadingCallback(readingId){
    delete this.readings[readingId];
    this.setState({isEmptyReading: Object.keys(this.readings).length===0});
  }

  handleCancel(){
    this.props.history.push("/reading");
  }

  handleDelete(){
    console.log("Delete journal!");
  }

  render(){
    return(
      <div className="addReadingDiv">
        {this.state.isWriting && <Loading text="Creating" />}

        <div className="titleDiv">{this.props.journalData ? "Update journal for readings" : "Add a new journal for readings"}</div>
        <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event, this.props.journalData);}}>

          <div className="text-right bottom-btn-div">
            {(!this.props.journalData || this.userId == this.journalUserId) &&
              <button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect) || this.state.isEmptyReading}>{this.props.journalData ? "Update" : "Submit"}</button>
            }
            {(this.props.journalData && this.userId == this.journalUserId) &&
              <button onClick={()=>{this.handleDelete()}} type="button" className="btn btn-danger loginButton">Delete</button>
            }
            <button onClick={()=>{this.handleCancel()}} type="button" className="btn btn-nomal loginButton">Cancel</button>
          </div>

            <div className="form-group row form-div">
              <label htmlFor="journalDate" className="col-sm-1 col-form-label">Date</label>
              <div className="col-sm-4">

                <input className={this.state.isDateCorrect?"form-control":"form-control form-control-warning"} type="text" placeholder="mm/dd/yyyy" id="journalDate" value={this.state.journalDate} onChange={(event)=>{this.handleChange(event, "journalDate")}} />
                {!this.state.isDateCorrect && <span className="glyphicon glyphicon-warning-sign form-control-feedback form-control-warning-span"></span>}

              </div>
              <label htmlFor="pingPongState" className="col-sm-3 col-form-label">Ping Pong State</label>
              <div className="col-sm-4">
                <select value={this.state.pingPongState} id="pingPongState" className="form-control" onChange={(event)=>{this.handleChange(event,"pingPongState");}}>
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
                  <option value="other">Other</option>
                </select>

              </div>

            </div>


            {/*  Start reading search function */}
            <ReadingSearchAndList readings={this.props.journalData ? this.readings : null} attachReadingCallback={(readingId)=>{this.handleAttachReadingCallback(readingId);}} detachReadingCallback={(readingId)=>{this.handleDetachAttachReadingCallback(readingId);}} />

              <div className="text-right bottom-btn-div">
                {(!this.props.journalData || this.userId == this.journalUserId) &&
                  <button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect) || this.state.isEmptyReading}>{this.props.journalData ? "Update" : "Submit"}</button>
                }
                {(this.props.journalData && this.userId == this.journalUserId) &&
                  <button onClick={()=>{this.handleDelete()}} type="button" className="btn btn-danger loginButton">Delete</button>
                }
                <button onClick={()=>{this.handleCancel()}} type="button" className="btn btn-nomal loginButton">Cancel</button>
              </div>
          </form>

        </div>
    );
  }


}
AddJournal.propTypes={
  journalData: PropTypes.object,
  history: PropTypes.object
};
export default AddJournal;
