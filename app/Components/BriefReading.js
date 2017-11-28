import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import $ from 'jquery';
import DetailedReading from './DetailedReading';
// import api from '../apis/api';
// import DatabaseApi from '../apis/DatabaseApi';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import ImageDescription from './ImageDescription';
// import LoginApi from '../apis/LoginApi';
import Util from '../apis/Util';
import fetchLinesBigrams from '../actions/BigramsActions';
import styles from '../styles/BriefReading.module.css';
// import { deleteReading } from '../actions/ReadingActions';
// import { JWT_MESSAGE } from '../config';

/** The component is used to show the short version of readings. */
class BriefReading extends Component {
  /**
   * Getting bigram line's information from image object.
   * @param {object} object should contain img1 and img2.
   * @returns {int} The sum of the two numbers.
   */
  static getBigramsIdObject({ img1, img2 }) {
    const bigramsIdArray = {
      line_13_id_1: img1.line_13_id,
      line_25_id_1: img1.line_25_id,
      line_46_id_1: img1.line_46_id,
      line_13_id_2: img2.line_13_id,
      line_25_id_2: img2.line_25_id,
      line_46_id_2: img2.line_46_id
    };
    // console.log("bigramsIdArray:",bigramsIdArray);
    return bigramsIdArray;
  }

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
    // console.log(this.userRole);
    if (this.props.user.role < 3 && !this.state.isFinishedLoading) {
      this.props.fetchLinesBigrams(BriefReading.getBigramsIdObject({
        img1: this.img1,
        img2: this.img2
      }), this.reading._id);

      this.setState({
        isExpand: !this.state.isExpand,
        isFinishedLoading: true
      });
    } else if (this.props.user.role < 3 && this.state.isFinishedLoading)
      this.setState({
        isExpand: !this.state.isExpand
      });
  }

  handleShowModalClick = () => this.props.handleShowModalClick(this.props.reading);

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
          {this.reading.reading_name}{this.reading.user_id === this.props.user._id && <i role="button" tabIndex="-2" title="Delete this reading" className={`fa fa-trash ${styles.deleteIcon}`} onClick={this.handleDelete} />}{!this.props.isSharedReading && this.reading.journal_entries && this.reading.journal_entries.length !== 0 && <div className="d-inline-block text-right float-right"><Link to={{ pathname: '/journalList', search: `?readingId=${this.id}&readingName=${this.reading.reading_name}` }}><i className={`fa fa-address-book-o ${styles.addJournalIcon}`} title="Open journal list" /></Link></div>}
          {this.props.isSharedReading && <div className="d-inline-block text-right float-right"><i tabIndex="-1" role="button" className={`fa fa-address-book-o ${styles.addJournalIcon}`} title="Open shared journal list" onClick={this.handleShowModalClick} /></div>}
        </div>

        {this.props.isSharedReading && <div><small className="text-muted">{this.reading.userName} shares this with your</small></div>}

        <div role="button" tabIndex="-1" className="mt-2 mb-3" onClick={this.handleClick}><span className="mr-3"><i className="fa fa-calendar mr-1" />{Util.getDateString(this.reading.date)}</span><span className={`mr-3 ${styles.changeLine}`}><i className="fa fa-bell mr-1" />Change lines: {this.reading.change_lines_text}</span>{this.reading.people !== '' && <span className="mr-3"><i className="fa fa-users mr-1" />People: {this.reading.people}</span>}</div>


        <div role="button" tabIndex="0" className={`row ${styles.noneOutline}`} onClick={this.handleClick}>
          {this.img1 &&
            <div className={`col-sm-6 ${styles.briefImgC}`}>
              <ImageDescription
                imageInfo={this.img1}
                imageNumber={this.reading.img1}
                isFirstImage
                isShowRc={this.props.user.role < 3}
              />
              {this.state.isExpand && <LoadingAnimation />}
                {this.state.isExpand && this.props.bigrams[this.reading._id] && <DetailedReading imageInfos={this.props.bigrams[this.reading._id]['1']} />}
            </div>}

          {this.img2 &&
            <div className={`col-sm-6 ${styles.briefImgC}`}>
              <ImageDescription
                imageInfo={this.img2}
                imageNumber={this.reading.img1}
                isFirstImage={false}
                isShowRc={this.props.user.role < 3}
              />
              {this.state.isExpand && <LoadingAnimation />}
              {this.state.isExpand && this.props.bigrams[this.reading._id] && <DetailedReading imageInfos={this.props.bigrams[this.reading._id]['2']} />}
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
const mapStateToProps = state => ({
  user: state.user,
  isLoading: state.isLoading,
  bigrams: state.bigrams
});
const mapDispatchToProps = dispatch => ({
  fetchLinesBigrams: (bigramIdObject, readingId) =>
    dispatch(fetchLinesBigrams(bigramIdObject, readingId))
});
export default connect(mapStateToProps, mapDispatchToProps)(BriefReading);
