import React, { Component } from "react";
import QueryString from "query-string";
import PropTypes from "prop-types";
import Util from "../apis/Util";
// import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import Loading from "./Loading";
import LoginApi from "../apis/LoginApi";

class AddJournal_oldversion extends Component{

  componentWillMount(){

    if(this.props.location){
      let queryInfo = QueryString.parse(this.props.location.search);
      this.readingId = queryInfo.readingId;
      this.readingName = queryInfo.readingName;
      this.readingDate = Util.getDateString(queryInfo.readingDate);
      // console.log("AddJournal paper readingId, readingName, and readingDate:", `Id: ${this.readingId} Name: ${this.readingName} Date: ${this.readingDate}`);
    }
    this.userId=LoginApi.isLogin(document).userid;

    let journalData = this.props.journalData;
    if(journalData){
      this.journalId=journalData.journalId;
      // this.readingDate=journalData.readingDate;
      this.readingName=journalData.readingName;
    }
    // console.log("AddJournal page:",journalData);
    // setting state
    this.state={
      isWriting: false,
      journalDate: journalData?Util.getDateString(journalData.date):Util.getCurrentDateString(),
      pingPongState: journalData?journalData.pingPongState:"Neutral",
      overview: journalData?journalData.overview:"",
      internalEnvironment: journalData?journalData.internalEnvironment:"",
      relationalEnvironment: journalData?journalData.relationalEnvironment:"",
      physicalEnvironment: journalData?journalData.physicalEnvironment:"",
      creativeVector: journalData?journalData.creativeVector:"",
      synchronicities: journalData?journalData.synchronicities:"",
      dreams: journalData?journalData.dreams:"",
      journalId: journalData?journalData.journalId:"",
      userId: journalData?journalData.userId:"",
      readingId: journalData?journalData.readingId:""
    };
    // if(this.journalId) this.setState(this.state);
  }

  componentDidMount(){
    // console.log("did mount");
    if(this.journalId) this.setState(this.state);
  }

  handleChange(event, element){
    // console.log(event.target.value);
    let newState={};
    newState[element]=event.target.value;
    this.setState(newState);
    // console.log(newState);
  }

  handleSubmit(event){
    event.preventDefault();
    // console.log("**********submit************");

      this.setState({isWriting: true});
      // console.log("submit:",this.state);
      // assemble object for creating
      let journalObject = {
        user_id: this.userid,
        reading_id: this.readingId?this.readingId:this.state.readingId,
        date: new Date(this.state.journalDate),
        overview: this.state.overview,
        internal_environment: this.state.internalEnvironment,
        relational_environment: this.state.relationalEnvironment,
        physical_environment: this.state.physicalEnvironment,
        creative_vector: this.state.creativeVector,
        synchronicities: this.state.synchronicities,
        dreams: this.state.dreams,
        ping_pong_state:this.state.pingPongState
      };
      // console.log("journalId", this.journalId);
      if(this.journalId) DatabaseApi.updateJournal(journalObject, this.state.journalId).then((reault)=>{this.props.history.push("/reading")});
      else DatabaseApi.createJournal(journalObject).then((reault)=>{this.props.history.push("/reading")});

  }

  handleDelete(event){
    event.preventDefault();
    // console.log("**********delete************");
    DatabaseApi.deleteJournal(this.state.readingId, this.state.journalId).then((reault)=>{this.props.history.push("/reading")});
  }

  render(){
    let titleDiv;
    if (this.readingId) titleDiv = <div><span className="rcTitle">Add a new journal to your reading: </span>{this.readingName}  ({this.readingDate})</div>;
      else titleDiv = <div><span className="rcTitle">Update {this.readingName}</span></div>;
    return(
      <div className="addReadingDiv">
        {this.state.isWriting && <Loading text="Creating" />}

        {titleDiv}
        <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>

          <div className="text-right bottom-btn-div">{(!this.readingId && this.state.userId==this.userId) && <button type="button" className="btn btn-danger btn-del" onClick={(event)=>{this.handleDelete(event);}}>Delete</button>}{(this.readingId || this.state.userId==this.userId) && <button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.overview.length>0)}>{this.readingId?"Submit":"Update"}</button>}</div>

            <div className="form-group row form-div">
              <label htmlFor="journalDate" className="col-sm-1 col-form-label">Date</label>
              <div className="col-sm-4">
                <input className="form-control" type="text" value={this.state.journalDate} id="journalDate" onChange={(event)=>{this.handleChange(event,"journalDate");}} />
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

            <div className="form-group form-div">
              <label htmlFor="overview" className="col-form-label">Overview</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.overview} placeholder="Overview..." id="overview" onChange={(event)=>{this.handleChange(event,"overview");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="internalEnvironment" className="col-form-label">Internal Environment</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.internalEnvironment} placeholder="Internal Environment..." id="internalEnvironment" onChange={(event)=>{this.handleChange(event,"internalEnvironment");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="relationalEnvironment" className="col-form-label">Relational Environment</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.relationalEnvironment} placeholder="Relational Environment..." id="relationalEnvironment" onChange={(event)=>{this.handleChange(event,"relationalEnvironment");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="physicalEnvironment" className="col-form-label">Physical Environment</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.physicalEnvironment} placeholder="Physical Environment..." id="physicalEnvironment" onChange={(event)=>{this.handleChange(event,"physicalEnvironment");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="creativeVector" className="col-form-label">Creative Vector</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.creativeVector} placeholder="Creative Vector..." id="creativeVector" onChange={(event)=>{this.handleChange(event,"creativeVector");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="synchronicities" className="col-form-label">Synchronicities</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.synchronicities} placeholder="Synchronicities..." id="synchronicities" onChange={(event)=>{this.handleChange(event,"synchronicities");}} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="dreams" className="col-form-label">Dreams</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.dreams} placeholder="Dreams..." id="dreams" onChange={(event)=>{this.handleChange(event,"dreams");}} />
              </div>
            </div>

          <div className="text-right bottom-btn-div">{(!this.readingId && this.state.userId==this.userId) && <button className="btn btn-danger btn-del" onClick={(event)=>{this.handleDelete(event);}}>Delete</button>}{(this.readingId || this.state.userId==this.userId) && <button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting || !(this.state.journalDate.length>0) || !(this.state.overview.length>0)}>{this.readingId?"Submit":"Update"}</button>}</div>

        </form>

      </div>
    );
  }

}
AddJournal_oldversion.propTypes={
  journalData: PropTypes.object
};
export default AddJournal_oldversion;
