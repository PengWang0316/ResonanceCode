import React, { Component } from "react";
import PropTypes from "prop-types";
import Loading from "./Loading";
import HexagramLine from "./HexagramLine";
import { getCurrentDateString } from "../apis/Util";

class AddReadingForm extends Component {

  componentWillMount(){
    this.state = {
      readingName: "",
      people: "",
      date: getCurrentDateString()
    };
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.handleSubmit(this.state);
  }

  handleInputChange(event, name){
    this.setState({[name]: event.target.value});
  }

  render(){
    return (
      <div>
        <div className="rcTitle">Create A New Reading</div>
        <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>
          <div className="text-right bottom-btn-div">
            <button type="submit" className="btn btn-info loginButton" disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.people.length>0 && this.state.readingName.length>0 && this.state.date.length>0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className="btn btn-normal loginButton" onClick={()=>{this.props.handleCancel();}}>Cancel</button>
          </div>

          <div className="form-group row form-div">
            <label htmlFor="readingName" className="col-sm-3 col-form-label">Reading Name</label>
            <div className="col-sm-9">
              <input className="form-control" type="text" placeholder="The name for this reading" id="readingName" value = {this.state.readingName} onChange = {event => {this.handleInputChange(event, "readingName");}} />
            </div>
          </div>

          <div className="form-group row form-div">
            <label htmlFor="people" className="col-sm-1 col-form-label">People</label>
            <div className="col-sm-7">
              <input className="form-control" type="text" placeholder="Who is doing this with you" id="people" value = {this.state.people} onChange = {event => {this.handleInputChange(event, "people");}} />
            </div>
            <label htmlFor="date" className="col-sm-1 col-form-label">Date</label>
            <div className="col-sm-3">
              <input className="form-control" type="text" id="date" value = {this.state.date} onChange = {event => {this.handleInputChange(event, "date");}}/>
            </div>
          </div>


          {/*The results of coins*/}
          <div className="rcTitle coinDiv">Throw your coins and record here.</div>

          <div className="row">
            <div className="col-sm-6">
              <div className="addreading_image_title">The first image:</div>
              {this.props.addReadingTempState.availableArr[5] ? <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side1} middle={this.props.addReadingTempState.line5.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} /> :<div className="noAvailableDiv text-center">Line 6 has not been entered yet.</div>}

              {this.props.addReadingTempState.availableArr[4] ? <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side1} middle={this.props.addReadingTempState.line4.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} /> :<div className="noAvailableDiv text-center">Line 5 has not been entered yet.</div>}

              {this.props.addReadingTempState.availableArr[3] ? <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side1} middle={this.props.addReadingTempState.line3.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} /> :<div className="noAvailableDiv text-center">Line 4 has not been entered yet.</div>}

              {this.props.addReadingTempState.availableArr[2] ? <HexagramLine lineNumber="2" side={this.props.addReadingTempState.line2.side1} middle={this.props.addReadingTempState.line2.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} /> :<div className="noAvailableDiv text-center">Line 3 has not been entered yet.</div>}

              {this.props.addReadingTempState.availableArr[1] ? <HexagramLine lineNumber="1" side={this.props.addReadingTempState.line1.side1} middle={this.props.addReadingTempState.line1.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} /> :<div className="noAvailableDiv text-center">Line 2 has not been entered yet.</div>}

              <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side1} middle={this.props.addReadingTempState.line0.middle1} handleCoinClick={(lineNumber,coins)=>{this.props.handleCoinClick(lineNumber,coins);}} isFirst={true} />
            </div>

            <div className="col-sm-6">
              <div className="addreading_image_title">The second image:</div>
              {this.props.addReadingTempState.line5.side2=="" ? <div className="availableDiv text-center" >Line 6</div> : <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side2} middle={this.props.addReadingTempState.line5.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line4.side2=="" ? <div className="availableDiv text-center">Line 5</div> : <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side2} middle={this.props.addReadingTempState.line4.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line3.side2=="" ? <div className="availableDiv text-center">Line 4</div> : <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side2} middle={this.props.addReadingTempState.line3.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line2.side2=="" ? <div className="availableDiv text-center">Line 3</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line2.side2} middle={this.props.addReadingTempState.line2.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line1.side2=="" ? <div className="availableDiv text-center">Line 2</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line1.side2} middle={this.props.addReadingTempState.line1.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line0.side2=="" ? <div className="availableDiv text-center">Line 1</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side2} middle={this.props.addReadingTempState.line0.middle2} isFirst={false} />}
            </div>


          </div>
          <div className="change-line-div"><span>Change Lines: </span>{this.props.addReadingTempState.changeLines}</div>


          <div className="text-left bottom-btn-div">
            <button type="submit" className="btn btn-info loginButton" disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.people.length>0 && this.state.readingName.length>0 && this.state.date.length>0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className="btn btn-normal loginButton" onClick={()=>{this.props.handleCancel();}}>Cancel</button>
          </div>
          </form>
        </div>
      );
  }

}
AddReadingForm.propTypes = {
  addReadingTempState: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleCoinClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
export default AddReadingForm;
