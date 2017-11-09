import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import $ from 'jquery';
import DetialedReading from './DetailedReading';
// import api from '../apis/api';
// import DatabaseApi from '../apis/DatabaseApi';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
import ImageDescription from './ImageDescription';
// import LoginApi from '../apis/LoginApi';
import Util from '../apis/Util';
import fetchLinesBigrams from '../actions/BigramsActions';
// import { deleteReading } from '../actions/ReadingActions';
// import { JWT_MESSAGE } from '../config';

/**
 * The component that is used to show the short version of readings.
 */
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
      /*
      if (!this.state.isExpand && !this.props.isLoading) {
        // fetch date from three lines bigrams database
        // console.log("bigramsIdArray:",this.getBigramsIdObject());
        DatabaseApi.getLinesBigrams(BriefReading.getBigramsIdObject({
          img1: this.img1,
          img2: this.img2
        })).then((result) => {
          // console.log("briefReading page:",result);
          this.imageInformationObject = result.data;
          // console.log("this.imageInformationObject",this.imageInformationObject);
          this.setState({
            isFinishedLoading: true
          });
        });
      } */
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

  /**
   * Render the jsx for page.
   * @returns {null} No return.
   */
  render() {
    // let reading=this.props.reading;
    // let img1=reading.img1Info;
    // let img2=reading.img2Info;
    return (
      <div id={this.id} className="briefReadingContainer">
        <div className="readingTitle">{this.reading.reading_name}{this.reading.user_id === this.props.user._id && <i role="button" tabIndex="-2" title="Delete this reading" className="fa fa-trash delete-icon" onClick={this.handleDelete} />}{this.reading.journal_entries && this.reading.journal_entries.length !== 0 && <div className="inlineBlock text-right showJournalBtnsDiv"><Link to={{ pathname: '/journalList', search: `?readingId=${this.id}&readingName=${this.reading.reading_name}` }}><i className="fa fa-address-book-o addJournal-icon" title="Open journal list" /></Link></div>}</div>

        <div role="button" tabIndex="-1" className="dateContainer" onClick={this.handleClick}><span><i className="fa fa-calendar" />{Util.getDateString(this.reading.date)}</span><span className="changeLine"><i className="fa fa-bell" />Change lines: {this.reading.change_lines_text}</span><span><i className="fa fa-users" />People: {this.reading.people}</span></div>


        <div role="button" tabIndex="0" className="row none-outline" onClick={this.handleClick}>
          {this.img1 &&
            <div className="col-sm-6 briefImgC">
              <ImageDescription
                imageInfo={this.img1}
                imageNumber={this.reading.img1}
                isFirstImage
                isShowRc={this.props.user.role < 3}
              />
              {this.state.isExpand && <LoadingAnimation />}
                {this.state.isExpand && this.props.bigrams[this.reading._id] && <DetialedReading imageInfos={this.props.bigrams[this.reading._id]['1']} />}
            </div>}

          {this.img2 &&
            <div className="col-sm-6 briefImgC">
              <ImageDescription
                imageInfo={this.img2}
                imageNumber={this.reading.img1}
                isFirstImage={false}
                isShowRc={this.props.user.role < 3}
              />
              {this.state.isExpand && <LoadingAnimation />}
              {this.state.isExpand && this.props.bigrams[this.reading._id] && <DetialedReading imageInfos={this.props.bigrams[this.reading._id]['2']} />}
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
