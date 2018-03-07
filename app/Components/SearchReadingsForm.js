import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { matchDateFormat } from '../apis/Util';
import styles from '../styles/SearchReadingsForm.module.css';

// Using require and giving jQuery to the window object in order to make sure the jest and enzyme work appropriately.
const jQuery = require('jquery');

window.jQuery = jQuery;
require('../resources/jquery-ui.min');
require('../resources/jquery-ui.min.global.css');

/** The component for reading search form. */
class SearchReadingsForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  };

  state = {
    isSigleDate: true,
    people: '',
    startDate: '',
    endDate: '',
    upper: 0,
    lower: 0,
    line13: 0,
    line25: 0,
    line46: 0,
    isStartDateCorrect: false,
    isEndDateCorrect: false,
  };
  /** Setting up states and a function that will be used to set up datapicker for the endDate input for the component.
    * Here just definded a function for other function's calling.
    * @returns {null} No return.
  */
  componentWillMount() {
    // The function for setting up datapicker for endDate input.
    this.setDatePicker = _ => setTimeout(() => {
      /* istanbul ignore next */
      if (jQuery('#endDate'))
        jQuery('#endDate').datepicker({
          onSelect: dateText => this.setState({ endDate: dateText, isEndDateCorrect: true })
        });
      else this.setDatePicker();
    }, 200);
  }

  /** Bingding the datepicker to date inputs. Showing the datapicker when a user click data input.
    * @returns {null} No return.
  */
  componentDidMount() {
    jQuery('#startDate').datepicker({
      onSelect: dateText => this.setState({ startDate: dateText, isStartDateCorrect: true })
    });
  }

  /** Setting state in order to swith bewteen signle date input and double date input when a user click radio button.
    * @returns {null} No return.
  */
  handleRadioChange = () => {
    this.setState({
      isSigleDate: !this.state.isSigleDate
    });
    this.setDatePicker();
  }

  /** Handling input value changing
    * @param {object} event is an object that comes from input click event.
    * @param {string} inputName is the id of the input.
    * @returns {null} No return.
  */
  handleInputChange = ({ target }) => {
    const input = target.value;
    const newStateObject = {};
    newStateObject[target.id] = input;
    // checking the format of date
    if (target.id === 'startDate')
      newStateObject.isStartDateCorrect = matchDateFormat(input);
    else if (target.id === 'endDate')
      newStateObject.isEndDateCorrect = matchDateFormat(input);
    this.setState(newStateObject);
  }

  /** Calling the submit method from parent's callback.
    * @param {object} event is an object that comes from user's click object.
    * @return {null} No return.
  */
  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit(this.state);
  };

  /** Rendering the jsx for the component.
    * @returns {jsx} Return the jsx for the comnponent.
  */
  render() {
    return (
      <div className={`${styles.searchFieldContainer}`}>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          {/* search date */}
          <div className={`${styles.searchDateContainer}`}>
            <div>
              <div className="form-check d-inline-block">
                <label htmlFor="optionsRadios1" className="form-check-label mr-2">
                  <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="singleDate" checked={this.state.isSigleDate} onChange={this.handleRadioChange} />
                   One specific date
                </label>
              </div>
              <div className="form-check d-inline-block">
                <label htmlFor="optionsRadios2" className="form-check-label">
                  <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="rangeDate" checked={!this.state.isSigleDate} onChange={this.handleRadioChange} />
                   Between two dates
                </label>
              </div>
            </div>
            <div className="form-group row mt-2">
              <label htmlFor="startDate" className="col-sm-3 col-form-label">{this.state.isSigleDate ? 'Date' : 'Start date'}</label>
              <div className={this.state.isSigleDate ? 'col-sm-9' : 'col-sm-3'}>
                <input
                  className={this.state.isStartDateCorrect ? 'form-control' : `form-control form-control-warning ${styles.formControlWarning}`}
                  type="text"
                  placeholder="mm/dd/yyyy"
                  id="startDate"
                  value={this.state.startDate}
                  onChange={this.handleInputChange}
                />
                {!this.state.isStartDateCorrect && <span className={`glyphicon glyphicon-warning-sign form-control-feedback ${styles.formControlWarningSpan}`} />}
              </div>
              {!this.state.isSigleDate &&
                <div className="col-sm-6 row"><label htmlFor="endDate" className="col-sm-5 col-form-label">End date</label>
                  <div className="col-sm-7">
                    <input
                      className={this.state.isEndDateCorrect ? 'form-control' : `form-control form-control-warning ${styles.formControlWarning}`}
                      type="text"
                      placeholder="mm/dd/yyyy"
                      id="endDate"
                      value={this.state.endDate}
                      onChange={this.handleInputChange}
                    />
                    {!this.state.isEndDateCorrect && <span className={`glyphicon glyphicon-warning-sign form-control-feedback ${styles.formControlWarningSpan}`} />}
                  </div>
                </div>}
            </div>

            <div>Date format is <b>month/day/year</b> (Example: 06/30/2017)</div>

          </div>
          {/* search date end */}
          {/* People */}
          <div className="form-group row mt-4">
            <label htmlFor="people" className="col-sm-2 col-form-label">People</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" placeholder="People..." id="people" value={this.state.people} onChange={this.handleInputChange} />
            </div>
          </div>

          {/* Trigrams
            All list should be loaded from database when we can solve the limitation of api call. value should also be change to id
            */}
          <div className="form-group row form-div">
            <label htmlFor="upper" className="col-sm-3 col-form-label">Upper Trigrams</label>
            <div className="col-sm-3">
              <select className="form-control" id="upper" value={this.state.upper} onChange={this.handleInputChange}>
                <option value="0">--</option>
                <option value="595a8b17f271190858935906">Qian</option>
                <option value="595a8b17f271190858935907">Zhen</option>
                <option value="595a8b17f271190858935908">Kan</option>
                <option value="595a8b17f271190858935909">Gen</option>
                <option value="595a8b17f27119085893590a">Kun</option>
                <option value="595a8b17f27119085893590b">Xun</option>
                <option value="595a8b17f27119085893590c">Li</option>
                <option value="595a8b17f27119085893590d">Dui</option>
              </select>
            </div>
            <label htmlFor="lower" className="col-sm-3 col-form-label">Lower Trigrams</label>
            <div className="col-sm-3">
              <select className="form-control" id="lower" value={this.state.lower} onChange={this.handleInputChange}>
                <option value="0">--</option>
                <option value="595a91252d1ae608c4aa2935">Qian</option>
                <option value="595a91252d1ae608c4aa2936">Zhen</option>
                <option value="595a91252d1ae608c4aa2937">Kan</option>
                <option value="595a91252d1ae608c4aa2938">Gen</option>
                <option value="595a91252d1ae608c4aa2939">Kun</option>
                <option value="595a91252d1ae608c4aa293a">Xun</option>
                <option value="595a91252d1ae608c4aa293b">Li</option>
                <option value="595a91252d1ae608c4aa293c">Dui</option>
              </select>
            </div>
          </div>

          {/* Lines 1-3 Bigrams */}
          <div className="form-group row mt-2">
            <label htmlFor="line13" className="col-sm-4 col-form-label">Lines 1-3 Bigrams</label>
            <div className="col-sm-8">
              <select className="form-control" id="line13" value={this.state.line13} onChange={this.handleInputChange}>
                <option value="0">--</option>
                <option value="595a99862e3b11095f090968">Emptying/Emerging</option>
                <option value="595a99862e3b11095f090969">Doing/Producing</option>
                <option value="595a99862e3b11095f09096a">Embodying/Attuning</option>
                <option value="595a99862e3b11095f09096b">Shedding/Composting</option>
              </select>
            </div>
          </div>

          {/* Lines 2-5 Bigrams */}
          <div className="form-group row mt-2">
            <label htmlFor="line25" className="col-sm-4 col-form-label">Lines 2-5 Bigrams</label>
            <div className="col-sm-8">
              <select className="form-control" id="line25" value={this.state.line25} onChange={this.handleInputChange}>
                <option value="0">--</option>
                <option value="595a9aff5e190009eac339d6">Conception/Potentiation-Manifestation and Possibility fused in pregnancy</option>
                <option value="595a9aff5e190009eac339d7">Birth/Differentiation-Manifestation takes precedence</option>
                <option value="595a9aff5e190009eac339d8">Maturation/Cultivation-Manifestation and Possibility exchanges information/energy</option>
                <option value="595a9aff5e190009eac339d9">Integration/Returning to Source-Possibility takes precedence</option>
              </select>
            </div>
          </div>

          {/* Lines 4-6 Bigrams */}
          <div className="form-group row mt-2">
            <label htmlFor="line46" className="col-sm-4 col-form-label">Lines 4-6 Bigrams</label>
            <div className="col-sm-8">
              <select className="form-control" id="line46" value={this.state.line46} onChange={this.handleInputChange}>
                <option value="0">--</option>
                <option value="595a9afa5e190009eac339d2">Emptying/Emerging</option>
                <option value="595a9afa5e190009eac339d3">Doing/Producing</option>
                <option value="595a9afa5e190009eac339d4">Embodying/Attuning</option>
                <option value="595a9afa5e190009eac339d5">Shedding/Composting</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <div className="text-right mt-3"><button type="submit" className={`btn btn-info ${styles.submitButton}`}>Submit</button></div>

        </form>
      </div>
    );
  }
}
export default SearchReadingsForm;
