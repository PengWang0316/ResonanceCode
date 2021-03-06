import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateLib from 'date-format-lib';

import styles from '../styles/JournalForm.module.css';
import { matchDateFormat } from '../apis/Util';
import JournalContent from './JournalContent';
import ReadingSearchAndList from './ReadingSearchAndList';
import { clearJournalState, deleteUploadImages } from '../actions/JournalActions';
import ImageUpload from './ImageUpload';
// Using require and giving jQuery to the window object in order to make sure the jest and enzyme work appropriately.
const jQuery = require('jquery');

window.jQuery = jQuery;
require('../resources/jquery-ui.min');
require('../resources/jquery-ui.min.global.css');

/** The journal form component for adding or modifying a journal. */
export class JournalForm extends Component {
  static propTypes = {
    journalData: PropTypes.object,
    isWriting: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    clearJournalState: PropTypes.func.isRequired
  };
  static defaultProps = { journalData: null };

  /** Initializing states.
    * @param {object} props is an object that contains the props' values.
    * @return {null} No return.
  */
  componentWillMount() {
    const { journalData } = this.props;
    if (journalData) {
      this.lastJournalId = journalData._id;
      this.initialContent(journalData);
    } else this.initialStates(journalData);
  }

  /** Setting up a datepicker for the journalDate input.
    * @returns {null} No return.
  */
  componentDidMount() {
    // Setting up datepicker
    jQuery('#journalDate').datepicker({
      onSelect: dateText => this.setState({ journalDate: dateText, isDateCorrect: true })
    });
  }

  /** Assembling data for readings and the journal and setting up some states for the component.
   * @returns {null} No return.
  */
  componentWillReceiveProps({ journalData }) {
    /* istanbul ignore next */
    if (journalData && (this.lastJournalId !== journalData._id)) {
      this.lastJournalId = journalData._id;
      this.initialContent(journalData);
    }
  }

  /** Reorganizing contentComponentArray.
    * @returns {null} No return.
  */
  setComponentToStateArray() {
    // transfor object to array in order to display
    const contentComponentArray = [];
    Object.keys(this.contentIndexs)
      .forEach(element => contentComponentArray.push(this.contentIndexs[element]));
    this.setState({ contentComponentArray });
  }

  /** Initial some states for the component.
    * @param {object} journalData is an object that represents a Journal.
    * @return {promise} return a promise.
  */
  initialStates(journalData) {
    this.newImages = []; // Keep the new images' url in the array in order to delete them when a user click cancel button.
    this.deleteImages = []; // Keep all delete image's public id here in order to delete them from Cloud when a user submits the form.
    this.contents = {}; // Keep content keys and content.
    this.contentKeyIndex = 0; // Generate keys for different contents.
    this.contentIndexs = {}; // Use to track the index of content component in the array. Delete function needs it. The format is {contentKey: index}.
    this.journalId = journalData ? journalData._id : null; // Keeping journal id for update.
    this.setState({
      journalDate: journalData ?
        DateLib.getDateString(journalData.date, 'mm/dd/yyyy') : DateLib.getCurrentDateString('mm/dd/yyyy'),
      isDateCorrect: true,
      // isEmptyReading: !(props.journalData && props.journalData.pingPongStates),
      contentComponentArray: [], // keep content component
      addJournalContent: 'overview_and_question',
      uploadImages: [], // keep the user's upload images.
      readings: journalData &&
      journalData.pingPongStates ? journalData.pingPongStates : {}, // keep which readings should be attached on. Format is like {readingId: pingPongState}
      readingIds: journalData && journalData.readingIds ? journalData.readingIds : null
    });
  }

  /** Inintial some content for the Journal.
    * @param {object} journalData is an object that contains journal's data.
    * @return {null} No return.
  */
  initialContent(journalData) {
    // If journal data exsit, get content.
    this.initialStates(journalData);
    if (journalData.uploadImages && journalData.uploadImages.length > 0)
      this.setState({ uploadImages: journalData.uploadImages });

    this.oldReadingIds = journalData.readingIds ? Object.keys(journalData.readingIds) : null; // keep original reading ids
    // delete unnecessary properties from journal object
    const journal = Object.assign({}, journalData); /* Making a copy in order to prevent side effects */
    this.journalUserId = journal.user_id;
    delete journal.date;
    delete journal.user_id;
    // delete journal.ping_pong_state;
    delete journal._id;
    delete journal.readingIds;
    delete journal.pingPongStates;
    const keyRegExp = /-(\d+)$/; // The regular expression for subtract suffixs
    Object.keys(journal).forEach((key) => {
      // if key is isPrivate do not do anything
      const matchResult = key.match(keyRegExp);
      if (matchResult) {
        if (this.contentKeyIndex < matchResult[1]) this.contentKeyIndex = matchResult[1]; // keep the max index number and user can contiune add new content
        this.addContent(journal[key], key.replace(keyRegExp, ''), key, matchResult[1], journal[`${key}-isPrivate`]);
      }
    });
    this.contentKeyIndex++;
  }

  /** Handling add content click.
    * @param {string} addJournalContent is a string of content.
    * @param {string} newContentName is the display name of this content.
    * @param {string} newContentKey is the key of this content.
    * @param {int} contentKeyIndex is the index number for this content.
    * @param {boolean} isPrivate is the indicator of whether this content will be shared.
    * @returns {null} No return.
  */
  addContent(
    addJournalContent, newContentName, newContentKey,
    contentKeyIndex, isPrivate
  ) {
    // put component in array in order to show
    const newContentKeyCopy = newContentKey || `${this.state.addJournalContent}-${this.contentKeyIndex}`;
    // put the component in the track object
    this.contentIndexs[newContentKeyCopy] = <JournalContent key={contentKeyIndex || this.contentKeyIndex++} newContent={addJournalContent || ''} newContentName={newContentName || this.state.addJournalContent} newContentKey={newContentKeyCopy} handleChangeCallback={this.handleChangeCallback} handleDeleteContentCallback={this.handleDeleteContentCallback} handleSharedBoxChangeCallback={this.handleSharedBoxChangeCallback} isPrivate={!!isPrivate} />;
    this.setComponentToStateArray();

    // also have to put content title to state in order to track content and update
    this.contents[newContentKeyCopy] = addJournalContent || '';
    this.contents[`${newContentKeyCopy}-isPrivate`] = !!isPrivate;
  }

  /** When a user click add content button, add a new content form to the page.
    * @returns {null} No return.
  */
  handleAddContentClick = () => {
    this.addContent();
  }

  /** The callback for changing input value.
    * @param {string} contentKey is the key of this content.
    * @param {string} contentText is the text content for this content.
    * @returns {null} No return.
  */
  handleChangeCallback = (contentKey, contentText) => {
    this.contents[contentKey] = contentText; // update content in state
  }

  /** The callback for deleting a content.
    * @param {string} contentKey is the key of this content.
    * @returns {null} No return.
  */
  handleDeleteContentCallback = contentKey => {
    // Remove content from state
    /* istanbul ignore next */
    if (Object.prototype.hasOwnProperty.call(this.contents, contentKey)) {
      delete this.contents[contentKey];
      delete this.contents[`${contentKey}-isPrivate`];
    }
    // Remove content component
    delete this.contentIndexs[contentKey];
    this.setComponentToStateArray();
  }

  /** The callback for changing shared box.
    * @param {string} contentKey is the key of this content.
    * @param {boolean} isPrivate is the indicator of whether this content will be shared.
    * @returns {null} No return.
  */
  handleSharedBoxChangeCallback = (contentKey, isPrivate) => {
    this.contents[`${contentKey}-isPrivate`] = isPrivate;
  }

  /** Handling the changing of input value.
    * @param {object} event is the object that comes from input.
    * @param {string} element is a string of input id.
    * @returns {null} No return.
  */
  handleChange = ({ target }) => {
    const newState = {};
    const elementId = target.id;
    newState[elementId] = target.value;
    if (elementId === 'journalDate') newState.isDateCorrect = matchDateFormat(newState[elementId]);
    this.setState(newState);
  }

  /** Prevent submit event is targeted when a user push the enter button.
    * @param {object} event comes from the target input.
    * @returns {null} No return.
  */
  handleKeyPress = event => {
    if (event.charCode === 13) event.preventDefault();
  }

  /** The callback for attach reading.
    * @param {string} readingId is the id of the reading.
    * @returns {null} No return.
  */
  handleAttachReadingCallback = readingId => {
    /* istanbul ignore next */
    if (!this.state.readings[readingId]) this.state.readings[readingId] = 'Neutral';
  }

  /** The callback for changing pingPongState.
    * @param {string} readingId is the id of the reading.
    * @param {object} pingPongState is the object that represents the ping pong state.
    * @returns {null} No return.
  */
  handlePingpongstateChangeCallback = (readingId, pingPongState) => {
    this.state.readings[readingId] = pingPongState;
  }

  /** The callback for detaching a reading.
    * @param {string} readingId is the id of the reading.
    * @returns {null} No return.
  */
  handleDetachAttachReadingCallback = readingId => {
    delete this.state.readings[readingId];
  }

  /** Handling the cancel action.
    * @returns {null} No return.
  */
  handleCancel = () => {
    this.props.clearJournalState(); // Clearing the jouranl state.
    /* istanbul ignore next */
    if (this.newImages.length !== 0) deleteUploadImages(this.newImages);
    this.props.history.push('/reading');
  }

  /** Handling the action of deleting a journal.
    * @param {object} event comes from reacting button.
    * @returns {null} No return.
  */
  handleDelete = event => {
    event.preventDefault();
    this.props.handleDelete(
      this.journalId,
      Object.keys(this.state.readings),
      !this.oldReadingIds
    );
    const imagePbulicIds = this.state.uploadImages.map(image => Object.keys(image)[0]);
    /* istanbul ignore next */
    if (imagePbulicIds !== 0) deleteUploadImages(imagePbulicIds);
  }

  /** Handling the action of submit.
    * @param {object} event comes from reacting form.
    * @returns {null} No return.
  */
  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit({
      isUpdate: !!this.props.journalData,
      journalId: this.journalId,
      journalDate: this.state.journalDate,
      readings: this.state.readings,
      contents: this.contents,
      oldReadingIds: this.oldReadingIds,
      shareList: this.props.journalData && this.props.journalData.shareList ?
        this.props.journalData.shareList : [],
      uploadImages: this.state.uploadImages
    });
    /* istanbul ignore next */
    if (this.deleteImages.length !== 0) deleteUploadImages(this.deleteImages);
  }

  /** Adding new images' url to the state and new image list.
    * @param {array} newImages is an array that contains new images' url.
    * @return {null} No return.
  */
  handleImageDropCallback = newImages => {
    this.setState({ uploadImages: [...this.state.uploadImages, ...newImages] });
    this.newImages = [...this.newImages, ...newImages.map(image => Object.keys(image)[0])];
  };

  /** Put public id of file in the array in order to execute the delete action when a user submit the form
    * @param {string} filePublicId is the Cloudinary's file id.
    * @return {null} No return.
  */
  handleDeleteImageCallback = filePublicId => {
    this.deleteImages.push(filePublicId); // Put it in the array in order to execute the delete action when a user submit the form.
    this.setState({
      uploadImages: this.state.uploadImages.filter(image =>
        !Object.prototype.hasOwnProperty.call(image, filePublicId))
    });
  };

  /** Rendering the component.
    * @returns {jsx} Return the jsx code for the component.
  */
  render() {
    return (
      <div className={`${styles.mainContentDiv}`}>

        <div className={`${styles.title}`}>{this.props.journalData ? 'Update journal for readings' : 'Add a new journal for readings'}</div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          <div className="text-right mt-3">
            {(!this.props.journalData || this.props.user._id === this.journalUserId) &&
            <button type="submit" className={`btn btn-info ${styles.submitButton}`} disabled={this.props.isWriting || !(this.state.journalDate.length > 0) || !(this.state.isDateCorrect)}>{this.props.journalData ? 'Update' : 'Submit'}</button>
              }
            {(this.props.journalData && this.props.user._id === this.journalUserId) &&
            <button onClick={this.handleDelete} type="button" className={`btn btn-danger ${styles.submitButton}`}>Delete</button>
              }
            <button onClick={this.handleCancel} type="button" className={`btn btn-secondary ${styles.submitButton}`}>Cancel</button>
          </div>

          <div className="form-group row mt-2">
            <div className="col-sm-6 row">
              <div className="col-xs-3">
                <label htmlFor="journalDate" className="col-sm-1 col-form-label">Date</label>
              </div>
              <div className="col-xs-9">
                <input className={this.state.isDateCorrect ? 'form-control' : `form-control form-control-warning ${styles.formControlWarning}`} type="text" placeholder="mm/dd/yyyy" id="journalDate" value={this.state.journalDate} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                {!this.state.isDateCorrect && <span className={`glyphicon glyphicon-warning-sign form-control-feedback ${styles.formControlWarningSpan}`} />}
              </div>
            </div>
            <div className="col-sm-6">
                  (The date fromat is mm/dd/yyyy)
            </div>
          </div>


          {/*  Start reading search function */}
          <ReadingSearchAndList
            existReadings={this.props.journalData ? this.state.readingIds : null}
            pingPongStates={this.state.readings}
            attachReadingCallback={this.handleAttachReadingCallback}
            detachReadingCallback={this.handleDetachAttachReadingCallback}
            handlePingpongstateChangeCallback={this.handlePingpongstateChangeCallback}
          />

          {/* New content goes here */}
          {this.state.contentComponentArray}

          {/* Add content button and drop list */}
          <div className={`row ${styles.addJournalContentDiv}`}>

            <div role="button" tabIndex="-1" onClick={this.handleAddContentClick} className={`${styles.addJournalContentBtnDiv} col-sm-6`}><i className="fa fa-plus-square" /> Add one content for your journal</div>
            <div className="col-sm-6">
              <select className="form-control" id="addJournalContent" onChange={this.handleChange}>
                <option value="overview_and_question">Overview and question</option>
                <option value="experience_of_i" disabled>Experience of “I”</option>
                <option value="thinking">&nbsp;&nbsp;&nbsp;&nbsp;Thinking</option>
                <option value="sensing">&nbsp;&nbsp;&nbsp;&nbsp;Sensing</option>
                <option value="feeling">&nbsp;&nbsp;&nbsp;&nbsp;Feeling</option>
                <option value="encoding">&nbsp;&nbsp;&nbsp;&nbsp;Encoding</option>
                <option value="acting_creating">&nbsp;&nbsp;&nbsp;&nbsp;Acting/creating</option>
                <option value="wxperience_of_the_fractal" disabled> Experience of the Fractal Representative</option>
                <option value="personal_relation">&nbsp;&nbsp;&nbsp;&nbsp;Personal relation</option>
                <option value="collective_event">&nbsp;&nbsp;&nbsp;&nbsp;Collective event</option>
                <option value="abstract_entity">&nbsp;&nbsp;&nbsp;&nbsp;Abstract entity</option>
                <option value="Subconscious" disabled>Subconscious</option>
                <option value="physical_environment">&nbsp;&nbsp;&nbsp;&nbsp;Physical environment</option>
                <option value="seasonal_marker">&nbsp;&nbsp;&nbsp;&nbsp;Seasonal marker</option>
                <option value="synchronicity">&nbsp;&nbsp;&nbsp;&nbsp;Synchronicity</option>
                <option value="dream">&nbsp;&nbsp;&nbsp;&nbsp;Dream</option>
                <option value="highlights_from_i_ching">Highlights from I-Ching</option>
                <option value="other">Other</option>
              </select>

            </div>

          </div>

          {/* Adding images section */}
          <ImageUpload
            uploadImages={this.state.uploadImages}
            imageDropCallback={this.handleImageDropCallback}
            deleteImageCallback={this.handleDeleteImageCallback}
          />

          <div className="text-right mt-3">
            {(!this.props.journalData || this.props.user._id === this.journalUserId) &&
              <button type="submit" className={`btn btn-info ${styles.submitButton}`} disabled={this.props.isWriting || !(this.state.journalDate.length > 0) || !(this.state.isDateCorrect)}>{this.props.journalData ? 'Update' : 'Submit'}</button>
                  }
            {(this.props.journalData && this.props.user._id === this.journalUserId) &&
              <button onClick={this.handleDelete} type="button" className={`btn btn-danger ${styles.submitButton}`}>Delete</button>
                  }
            <button onClick={this.handleCancel} type="button" className={`btn btn-secondary ${styles.submitButton}`}>Cancel</button>
          </div>
        </form>

      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  clearJournalState: _ => dispatch(clearJournalState())
});
export default connect(mapStateToProps, mapDispatchToProps)(JournalForm);
