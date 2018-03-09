import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import DetailedReading from './DetailedReading';
// import api from '../apis/api';
// import DatabaseApi from '../apis/DatabaseApi';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import ImageDescription from './ImageDescription';
// import LoginApi from '../apis/LoginApi';
import Util from '../apis/Util';
// import fetchLinesBigrams from '../actions/BigramsActions';
import styles from '../styles/BriefReading.module.css';
import { outputReadingAndJournals } from '../actions/ReadingActions';
// import { JWT_MESSAGE } from '../config';
// window.html2canvas = html2canvas;

/** The component is used to show the short version of readings. */
export class BriefReading extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    // bigrams: PropTypes.object.isRequired,
    // fetchLinesBigrams: PropTypes.func.isRequired,
    outputReadingAndJournals: PropTypes.func.isRequired,
    reading: PropTypes.object.isRequired,
    isSharedReading: PropTypes.bool,
    deleteReadingCallback: PropTypes.func,
    handleShowModalClick: PropTypes.func,
    outputPdfWindowId: PropTypes.string,
    handleHexagramClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    isSharedReading: false,
    outputPdfWindowId: null,
    deleteReadingCallback: null,
    handleShowModalClick: null
  };
  /** Deprecated
   * Getting bigram line's information from image object.
   * @param {object} object should contain img1 and img2.
   * @returns {int} The sum of the two numbers.
   */
  // static getBigramsIdObject({ img1, img2 }) {
  //   const bigramsIdArray = {
  //     line_13_id_1: img1.line_13_id,
  //     line_25_id_1: img1.line_25_id,
  //     line_46_id_1: img1.line_46_id,
  //     line_13_id_2: img2.line_13_id,
  //     line_25_id_2: img2.line_25_id,
  //     line_46_id_2: img2.line_46_id
  //   };
  //   // console.log("bigramsIdArray:",bigramsIdArray);
  //   return bigramsIdArray;
  // }

  state = {
    isExpand: false, // whether the full information space has expanded.
    isFinishedLoading: false
  };

  /**
 * Setting some other params.
 * @returns {null} No return.
 */
  componentWillMount() {
    // const user = LoginApi.isLogin(document);
    // this.userId = user.userid;
    // this.userRole = user.role;
    this.reading = this.props.reading;
    this.img1 = this.reading.img1Info;
    this.img2 = this.reading.img2Info;
    this.id = this.reading._id;
  }

  /**
   * Handling the click from the delete button
   * and remove the component from the screen.
   * @returns {null} No return.
   */
  handleDelete = () => {
    this.props.deleteReadingCallback({
      readingId: this.reading._id,
      readingName: this.reading.reading_name
    });
  }

  /**
   * Fetch more information about the reading.
   * @returns {null} No return.
   */
  handleClick = () => {
    /* istanbul ignore next */
    if (this.props.user.role < 3 && !this.state.isFinishedLoading) {
      this.setState({
        isExpand: !this.state.isExpand,
        isFinishedLoading: true
      });
    } else if (this.props.user.role < 3 && this.state.isFinishedLoading)
      this.setState({
        isExpand: !this.state.isExpand
      });
  }

  /** When a user click the showJournal button, call the parent's method.
    * @return {null} No return.
  */
  handleShowModalClick = () => this.props.handleShowModalClick(this.props.reading);

  /** Show the outputPdfModal and call the reading action to generate a pdf file for the user. $ will use index.html's jQuery.
    * @return {null} No return.
  */
  outputPdf = () => {
    const outputPdfModal = this.props.outputPdfWindowId ? $(`#${this.props.outputPdfWindowId}`) : null;
    /* istanbul ignore next */
    if (outputPdfModal) outputPdfModal.modal('toggle');
    this.props.outputReadingAndJournals({
      readingHtmlElement: document.getElementById(this.id),
      readingName: this.reading.reading_name,
      readingId: this.id,
      readingDate: this.reading.date
    }).then(() => {
      /* istanbul ignore next */
      if (outputPdfModal) outputPdfModal.modal('toggle');
    });
  }

  /**
   * Render the jsx for page.
   * @returns {null} No return.
   */
  render() {
    // let reading=this.props.reading;
    // let img1=reading.img1Info;
    // let img2=reading.img2Info;
    return (
      <div id={this.id} className={`${styles.briefReadingContainer}`}>
        <div className={`${styles.readingTitle}`}>
          {this.reading.reading_name}{this.reading.user_id === this.props.user._id && (
            <div className="d-inline-block">
              <i role="button" tabIndex="-3" title="Delete this reading" className={`fas fa-trash-alt ${styles.deleteIcon}`} onClick={this.handleDelete} />
              <i role="button" tabIndex="-2" title="Out put this reading and it's journals to a pdf file" className={`fas fa-file-pdf ${styles.addJournalIcon}`} onClick={this.outputPdf} />
            </div>)}
          {!this.props.isSharedReading && this.reading.journal_entries && this.reading.journal_entries.length !== 0 && <div className="d-inline-block text-right float-right"><Link to={{ pathname: '/journalList', search: `?readingId=${this.id}&readingName=${this.reading.reading_name}` }}><i className={`fas fa-list-alt ${styles.addJournalIcon}`} title="Open journal list" /></Link></div>}
          {this.props.isSharedReading && <div className="d-inline-block text-right float-right"><i tabIndex="-1" role="button" className={`fas fa-list-alt ${styles.addJournalIcon}`} title="Open shared journal list" onClick={this.handleShowModalClick} /></div>}
        </div>

        {this.props.isSharedReading && <div><small className="text-muted">{this.reading.userName} shares this with your</small></div>}

        <div role="button" tabIndex="-1" className="mt-2 mb-3" onClick={this.handleClick}><span className="mr-3"><i className="fa fa-calendar mr-1" />{Util.getDateString(this.reading.date)}</span><span className={`mr-3 ${styles.changeLine}`}><i className="fa fa-bell mr-1" />Change lines: {this.reading.change_lines_text}</span>{this.reading.people !== '' && <span className="mr-3"><i className="fa fa-users mr-1" />People: {this.reading.people}</span>}</div>


        <div id="contentDiv" role="button" tabIndex="0" className={`row ${styles.noneOutline}`} onClick={this.handleClick}>
          {this.img1 &&
            <div className={`col-sm-6 ${styles.briefImgC}`}>
              <ImageDescription
                imageInfo={this.img1}
                imageNumber={this.reading.img1}
                isFirstImage
              />
              {this.state.isExpand && <LoadingAnimation />}
                {this.state.isExpand && <DetailedReading
                  hexagram={this.img1}
                  handleHexagramClick={this.props.handleHexagramClick}
                />}
            </div>}

          {this.img2 &&
            <div className={`col-sm-6 ${styles.briefImgC}`}>
              <ImageDescription
                imageInfo={this.img2}
                imageNumber={this.reading.img1}
                isFirstImage={false}
              />
              {this.state.isExpand && <LoadingAnimation />}
              {this.state.isExpand && <DetailedReading
                hexagram={this.img2}
                handleHexagramClick={this.props.handleHexagramClick}
              />}
            </div>}

        </div>

      </div>

    );
  }
}
/*
BriefReading.propTypes = {
  reading: PropTypes.object.isRequired
}; */
/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.user,
  // isLoading: state.isLoading,
  // bigrams: state.bigrams
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  // fetchLinesBigrams: (bigramIdObject, readingId) =>
  // dispatch(fetchLinesBigrams(bigramIdObject, readingId)),
  outputReadingAndJournals: params => dispatch(outputReadingAndJournals(params))
});
export default connect(mapStateToProps, mapDispatchToProps)(BriefReading);
