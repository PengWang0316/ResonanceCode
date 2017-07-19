import React, { Component } from "react";
import Util from "../apis/Util";
import Loading from "./Loading"
import JournalContent from "./JournalContent";
import ReadingSearchAndList from "./ReadingSearchAndList";
import { isLogin } from "../apis/LoginApi";
import DatabaseApi from "../apis/DatabaseApi";

class AddJournal extends Component {

  componentWillMount(){
    this.state={
      isWriting: false,
      journalDate: Util.getCurrentDateString(),
      isDateCorrect: true,
      isEmptyReading: true,
      contentComponentArray: [], // keep content component
      addJournalContent: "overview",
      pingPongState: "Neutral"
    };
    this.readings = {}; // keep which readings should be attached on. Format is like {readingId: null}
    this.contents = {}; // Keep content keys and content
    this.contentKey = 0; // Generate keys for different contents
    this.contentIndexs = {}; // Use to track the index of content component in the array. Delete function needs it. The format is {contentKey: index}
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

  handleAddContentClick(){
    // put component in array in order to show
    let newContentKey = `${this.state.addJournalContent}-${this.contentKey}`;
    // put the component in the track object
    this.contentIndexs[newContentKey]=<JournalContent key={this.contentKey++} newContent={this.state.addJournalContent} newContentKey={newContentKey} handleChangeCallback={(contentKey, contentText)=>{this.handleChangeCallback(contentKey, contentText);}} handleDeleteContentCallback={(contentKey)=>{this.handleDeleteContentCallback(contentKey);}} handleSharedBoxChangeCallback={(contentKey, isShared)=>{this.handleSharedBoxChangeCallback(contentKey, isShared)}} />;
    this.setComponentToStateArray();
    // this.setState({contentComponentArray: this.state.contentComponentArray});

    // also have to put content title to state in order to track content and update
    this.contents[newContentKey] = "";
    this.contents[`${newContentKey}-isShared`] = false;
  }

  setComponentToStateArray(){
    // transfor object to array in order to display
    this.state.contentComponentArray=[];
    Object.keys(this.contentIndexs).map((element)=>{
      this.state.contentComponentArray.push(this.contentIndexs[element]);
    });
    this.setState({contentComponentArray: this.state.contentComponentArray});
  }

  handleSubmit(event){
    event.preventDefault();
    // console.log("submit: contents:",this.contents);
    // Assemble a journal object for save
    let readingIdArray = [];
    Object.keys(this.readings).map((key)=>{readingIdArray.push(key)});
    let journal = Object.assign({date: this.state.journalDate, ping_pong_state: this.state.pingPongState, user_id: isLogin(document).userid, readingIds: readingIdArray}, this.contents);

    DatabaseApi.createJournal(journal).then((result)=>{
      this.props.history.push("/reading");
    });
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

  render(){
    return(
      <div className="addReadingDiv">
        {this.state.isWriting && <Loading text="Creating" />}

        <div className="titleDiv">Add a new journal for readings</div>
        <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>

          <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect) || this.state.isEmptyReading}>Submit</button></div>

            <div className="form-group row form-div">
              <label htmlFor="journalDate" className="col-sm-1 col-form-label">Date</label>
              <div className="col-sm-4">

                <input className={this.state.isDateCorrect?"form-control":"form-control form-control-warning"} type="text" placeholder="mm//dd/yyyy" id="journalDate" value={this.state.journalDate} onChange={(event)=>{this.handleChange(event, "journalDate")}} />
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
            <ReadingSearchAndList attachReadingCallback={(readingId)=>{this.handleAttachReadingCallback(readingId);}} detachReadingCallback={(readingId)=>{this.handleDetachAttachReadingCallback(readingId);}} />

            <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.isDateCorrect) ||  this.state.isEmptyReading}>Submit</button></div>
          </form>

        </div>
    );
  }


}
export default AddJournal;
