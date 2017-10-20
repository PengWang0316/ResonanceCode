import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import Loading from './Loading';
import jQuery from 'jquery';
// import PropTypes from 'prop-types';

import '../resources/jquery-ui.min';
import '../resources/jquery-ui.min.css';
import HexagramLine from './HexagramLine';
import { getCurrentDateString } from '../apis/Util';

/** The add reading form component.
 * @returns {null} No return;
*/
class AddReadingForm extends Component {
  /** Setting some state for the component.
   * @returns {null} No return.
  */
  componentWillMount() {
    this.initialState();
  }

  /** Setting up a datepicker for the Date input.
    * @returns {null} No return.
  */
  componentDidMount() {
    // Setting up datepicker
    jQuery('#date').datepicker({
      onSelect: dateText => this.setState({ date: dateText })
    });
  }

  /** Setting some state for the component.
   * @param {object} nextProps contains value for next props.
   * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.readings.length !== 0 &&
      this.props.readings.length !== nextProps.readings.length) this.initialState();
  }

  /** Initial some states for the component.
   * @returns {null} No return.
  */
  initialState() {
    this.state = {
      readingName: '',
      people: '',
      date: getCurrentDateString()
    };
  }

  /** Handle submit function.
   * @param {object} event is the object comes from submit a form.
   * @returns {null} No return;
  */
  handleSubmit(event) {
    event.preventDefault();
    jQuery('button[type=submit]').attr('disabled', 'disabled');
    this.props.handleSubmit(this.state);
  }

  /** Controlling the input value for the form.
   * @param {object} event is the object comes from a input's value changing.
   * @param {string} name is the input's id.
   * @returns {null} No return;
  */
  handleInputChange(event, name) {
    this.setState({ [name]: event.target.value });
  }

  /** Render the component.
   * @returns {null} No return;
  */
  render() {
    return (
      <div>
        <div className="rcTitle">Create A New Reading</div>
        <form className="form-horizontal" onSubmit={(event) => { this.handleSubmit(event); }}>
          <div className="text-right bottom-btn-div">
            <button type="submit" className="btn btn-info loginButton" disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.people.length > 0 && this.state.readingName.length > 0 && this.state.date.length > 0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className="btn btn-normal loginButton" onClick={() => { this.props.handleCancel(); }}>Cancel</button>
          </div>

          <div className="form-group row form-div">
            <label htmlFor="readingName" className="col-lg-3 col-form-label">Reading Name</label>
            <div className="col-lg-9">
              <input className="form-control" type="text" placeholder="The name for this reading" id="readingName" value={this.state.readingName} onChange={event => { this.handleInputChange(event, 'readingName'); }} />
            </div>
          </div>

          <div className="form-group row form-div">
            <label htmlFor="people" className="col-lg-1 col-form-label">People</label>
            <div className="col-lg-7">
              <input className="form-control" type="text" placeholder="Who is doing this with you" id="people" value={this.state.people} onChange={event => { this.handleInputChange(event, 'people'); }} />
            </div>
            <label htmlFor="date" className="col-lg-1 col-form-label">Date</label>
            <div className="col-lg-3">
              <input className="form-control" type="text" id="date" value={this.state.date} onChange={event => { this.handleInputChange(event, 'date'); }} />
            </div>
          </div>


          {/* The results of coins */}
          <div className="rcTitle coinDiv">Throw your coins and record here.</div>

          <div className="row">
            <div className="col-lg-6">
              <div className="addreading_image_title">The first image:</div>
              {this.props.addReadingTempState.availableArr[5] ? <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side1} middle={this.props.addReadingTempState.line5.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst /> : <div className="noAvailableDiv text-center">Line 6 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[4] ? <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side1} middle={this.props.addReadingTempState.line4.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst /> : <div className="noAvailableDiv text-center">Line 5 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[3] ? <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side1} middle={this.props.addReadingTempState.line3.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst /> : <div className="noAvailableDiv text-center">Line 4 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[2] ? <HexagramLine lineNumber="2" side={this.props.addReadingTempState.line2.side1} middle={this.props.addReadingTempState.line2.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst /> : <div className="noAvailableDiv text-center">Line 3 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[1] ? <HexagramLine lineNumber="1" side={this.props.addReadingTempState.line1.side1} middle={this.props.addReadingTempState.line1.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst /> : <div className="noAvailableDiv text-center">Line 2 has not been entered.</div>}

              <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side1} middle={this.props.addReadingTempState.line0.middle1} handleCoinClick={(lineNumber, coins) => { this.props.handleCoinClick(lineNumber, coins); }} isFirst />
            </div>

            <div className="col-lg-6">
              <div className="addreading_image_title">The second image:</div>
              {this.props.addReadingTempState.line5.side2 == '' ? <div className="availableDiv text-center" >Line 6</div> : <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side2} middle={this.props.addReadingTempState.line5.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line4.side2 == '' ? <div className="availableDiv text-center">Line 5</div> : <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side2} middle={this.props.addReadingTempState.line4.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line3.side2 == '' ? <div className="availableDiv text-center">Line 4</div> : <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side2} middle={this.props.addReadingTempState.line3.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line2.side2 == '' ? <div className="availableDiv text-center">Line 3</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line2.side2} middle={this.props.addReadingTempState.line2.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line1.side2 == '' ? <div className="availableDiv text-center">Line 2</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line1.side2} middle={this.props.addReadingTempState.line1.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line0.side2 == '' ? <div className="availableDiv text-center">Line 1</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side2} middle={this.props.addReadingTempState.line0.middle2} isFirst={false} />}
            </div>


          </div>
          <div className="change-line-div"><span>Change Lines: </span>{this.props.addReadingTempState.changeLines}</div>


          <div className="text-left bottom-btn-div">
            <button type="submit" className="btn btn-info loginButton" disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.people.length > 0 && this.state.readingName.length > 0 && this.state.date.length > 0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className="btn btn-normal loginButton" onClick={() => { this.props.handleCancel(); }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
/*
AddReadingForm.propTypes = {
  addReadingTempState: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleCoinClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}; */
const mapStateToProps = state => ({
  readings: state.readings
});
export default connect(mapStateToProps, null)(AddReadingForm);
