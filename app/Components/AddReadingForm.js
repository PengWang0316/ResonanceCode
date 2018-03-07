import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HexagramLine from './HexagramLine';
import { getCurrentDateString, matchDateFormat } from '../apis/Util';
import styles from '../styles/AddReadingForm.module.css';

// Using require and giving jQuery to the window object in order to make sure the jest and enzyme work appropriately.
const jQuery = require('jquery');

window.jQuery = jQuery;
require('../resources/jquery-ui.min');
require('../resources/jquery-ui.min.global.css');

/** The add reading form component.
 * @returns {null} No return;
*/
export class AddReadingForm extends Component {
  static propTypes = { readings: PropTypes.array.isRequired };
  /** Offering some states for the component.
   * @returns {object} Return a object for the initial state.
  */
  static getInitialState = () => ({
    readingName: '',
    people: '',
    date: getCurrentDateString(),
    isDateCorrect: true
  });

  state = Object.assign({}, AddReadingForm.getInitialState());

  /** Setting a variable to control initialzing states.
    * @return {null} No return.
  */
  componentWillMount() {
    this.isCreated = false; // Using this variable to cotrol whether initialize states when the component recieves a new props.
  }

  /** Setting up a datepicker for the Date input.
    * @returns {null} No return.
  */
  componentDidMount() {
    // Setting up datepicker
    jQuery('#date').datepicker({
      onSelect: dateText => this.setState({ date: dateText, isDateCorrect: true })
    });
  }

  /** Setting some state for the component.
   * @param {object} nextProps contains value for next props.
   * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.isCreated && this.props.readings.length !== nextProps.readings.length) {
      this.isCreated = false;
      this.setState(Object.assign({}, AddReadingForm.getInitialState()));
    }
  }

  /** Handle submit function.
   * @param {object} event is the object comes from submit a form.
   * @returns {null} No return;
  */
  handleSubmit = event => {
    event.preventDefault();
    jQuery('button[type=submit]').attr('disabled', 'disabled');
    this.isCreated = true;
    this.props.handleSubmit(this.state);
  }

  /** Controlling the input value for the form.
   * @param {object} event is the object comes from a input's value changing.
   * @param {string} name is the input's id.
   * @returns {null} No return;
  */
  handleInputChange = ({ target }) => {
    this.setState({ [target.id]: target.value });
    if (target.id === 'date') this.setState({ isDateCorrect: matchDateFormat(target.value) });
  }

  /** Call the container's method when a user click a coin icon.
    * @param {int} lineNumber is the number of line.
    * @param {int} coinsPoint is the point that moment this line has based on the calculation.
    * @returns {null} No return.
  */
  handleCoinClickCallback = (lineNumber, coinsPoint) =>
    this.props.handleCoinClick(lineNumber, coinsPoint);

  /** Calling the container's cancel method when a user clicks the cancel button.
    * @returns {null} No return.
  */
  handleCancelCallback = () => this.props.handleCancel();

  /** Render the component.
   * @returns {null} No return;
  */
  render() {
    return (
      <div>
        <div className={`${styles.title}`}>Create A New Reading</div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className="text-right mt-4">
            <button type="submit" className={`btn btn-info ${styles.submitButton}`} disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.readingName.length > 0 && this.state.date.length > 0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className={`btn btn-normal ${styles.submitButton}`} onClick={this.handleCancelCallback}>Cancel</button>
          </div>

          <div className={`form-group row ${styles.formDiv}`}>
            <label htmlFor="readingName" className="col-lg-3 col-form-label">Reading Name</label>
            <div className="col-lg-9">
              <input className="form-control" type="text" placeholder="The name for this reading" id="readingName" value={this.state.readingName} onChange={this.handleInputChange} />
            </div>
          </div>

          <div className={`form-group row ${styles.formDiv}`}>
            <label htmlFor="people" className="col-lg-1 col-form-label">People</label>
            <div className="col-lg-7">
              <input className="form-control" type="text" placeholder="Who is doing this with you" id="people" value={this.state.people} onChange={this.handleInputChange} />
            </div>
            <label htmlFor="date" className="col-lg-1 col-form-label">Date</label>
            <div className="col-lg-3">
              <input className={this.state.isDateCorrect ? 'form-control' : `form-control form-control-warning ${styles.formControlWarning}`} type="text" id="date" value={this.state.date} onChange={this.handleInputChange} />
            </div>
          </div>


          {/* The results of coins */}
          <div className={`${styles.title} ${styles.coinDiv}`}>Throw your coins and record here.</div>

          <div className="row">
            <div className="col-lg-6">
              <div className={`${styles.addreadingImageTitle}`}>The first image:</div>
              {this.props.addReadingTempState.availableArr[5] ? <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side1} middle={this.props.addReadingTempState.line5.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst /> : <div className={`text-center ${styles.noAvailableDiv}`}>Line 6 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[4] ? <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side1} middle={this.props.addReadingTempState.line4.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst /> : <div className={`text-center ${styles.noAvailableDiv}`}>Line 5 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[3] ? <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side1} middle={this.props.addReadingTempState.line3.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst /> : <div className={`text-center ${styles.noAvailableDiv}`}>Line 4 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[2] ? <HexagramLine lineNumber="2" side={this.props.addReadingTempState.line2.side1} middle={this.props.addReadingTempState.line2.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst /> : <div className={`text-center ${styles.noAvailableDiv}`}>Line 3 has not been entered.</div>}

              {this.props.addReadingTempState.availableArr[1] ? <HexagramLine lineNumber="1" side={this.props.addReadingTempState.line1.side1} middle={this.props.addReadingTempState.line1.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst /> : <div className={`text-center ${styles.noAvailableDiv}`}>Line 2 has not been entered.</div>}

              <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side1} middle={this.props.addReadingTempState.line0.middle1} handleCoinClick={this.handleCoinClickCallback} isFirst />
            </div>

            <div className="col-lg-6">
              <div className={`${styles.addreadingImageTitle}`}>The second image:</div>
              {this.props.addReadingTempState.line5.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 6</div> : <HexagramLine lineNumber="5" side={this.props.addReadingTempState.line5.side2} middle={this.props.addReadingTempState.line5.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line4.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 5</div> : <HexagramLine lineNumber="4" side={this.props.addReadingTempState.line4.side2} middle={this.props.addReadingTempState.line4.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line3.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 4</div> : <HexagramLine lineNumber="3" side={this.props.addReadingTempState.line3.side2} middle={this.props.addReadingTempState.line3.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line2.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 3</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line2.side2} middle={this.props.addReadingTempState.line2.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line1.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 2</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line1.side2} middle={this.props.addReadingTempState.line1.middle2} isFirst={false} />}

              {this.props.addReadingTempState.line0.side2 === '' ? <div className={`text-center ${styles.availableDiv}`}>Line 1</div> : <HexagramLine lineNumber="0" side={this.props.addReadingTempState.line0.side2} middle={this.props.addReadingTempState.line0.middle2} isFirst={false} />}
            </div>


          </div>
          <div className={`${styles.changeLineDiv}`}><span>Change Lines: </span>{this.props.addReadingTempState.changeLines}</div>


          <div className="text-left mt-4">
            <button type="submit" className={`btn btn-info ${styles.submitButton}`} disabled={!(this.props.addReadingTempState.availableArr[6] && this.state.readingName.length > 0 && this.state.date.length > 0 && !this.props.addReadingTempState.isLoading)}>Submit</button>
            <button type="button" className={`btn btn-normal ${styles.submitButton}`} onClick={this.handleCancelCallback}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  readings: state.readings
});
export default connect(mapStateToProps, null)(AddReadingForm);
