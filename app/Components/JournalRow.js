import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Util from '../apis/Util';
import styles from '../styles/JournalRow.module.css';

/** The component for a signal journal. */
export class JournalRow extends Component {
  state = {
    isExpand: false // Tracking whether the journal is expanded
  };

  /** Assembling some data for the journal.
    * @returns {null} No return;
  */
  componentWillMount() {
    // Finding a content to show
    const journalContentKeys = Object.keys(this.props.journal);
    this.firstContentKey = '';
    // const firstContentName = 'No content';
    // let keyLength = journalContentKeys.length;
    const keyExpression = /(.*)-\d+$/; // Using this to pick up the content field
    this.journalContentArray = [];
    journalContentKeys.forEach(key => {
      const result = key.match(keyExpression);
      if (result && (!this.props.isSharedJournal || this.props.journal[`${key}-isShared`])) // Making sure just show the user shared contents.
        this.journalContentArray.push((
          <div key={key}>
            <div><b>{result[1].replace('_', ' ')}:</b></div>
            <div className={this.props.isSharedJournal ? '' : `${styles.journalBriefOverview}`}>{this.props.journal[result[0]]}</div>
          </div>));
    });
    this.firstJournalContentArray = [];
    if (this.journalContentArray.length === 0)
      this.firstJournalContent = <div><b>No Content</b></div>;
    else
      this.firstJournalContent = this.journalContentArray.shift();
  }

  /** Expanding journal information.
    * @returns {null} No return;
  */
  handleExpandClick = () => this.setState({ isExpand: !this.state.isExpand });

  /** Call the share button click callback.
    * @return {null} No return.
  */
  handleClickShareButton = () => this.props.handleClickShareButton({
    readingId: this.props.readingId, journalId: this.props.journal._id
  });

  /** Rendering jsx for the component.
    * @returns {jsx} Return jsx for the component;
  */
  render() {
    /* // Finding a content to show
    let journalContentKeys = Object.keys(this.props.journal);
    let firstContentKey = "";
    let firstContentName = "No content";
    let keyLength = journalContentKeys.length;
    let keyExpression = /(.*)-\d+/;
    for (let i=0;i<keyLength;i++){
      let result = journalContentKeys[i].match(keyExpression);
      if (result){
        firstContentKey = result[0];
        firstContentName = result[1].replace("_", " ");
        break;
      }
    }
*/
    return (
      <div role="button" tabIndex="-1" className={`${styles.journalRowDiv} ${styles.noneOutline}`} onClick={this.handleExpandClick}>

        <div><b>{Util.getDateString(this.props.journal.date)}</b>{this.props.user._id === this.props.journal.user_id && <Link to={{ pathname: '/showJournal', search: `?journalId=${this.props.journal._id}&isAttachedJournal=${this.props.readingId}` }}><i className="fa fa-pencil-square-o" title="Edit this journal" /></Link>}{this.props.readingId && <i role="button" tabIndex="-2" onClick={this.handleClickShareButton} className={`fa fa-share-alt ${styles.colorBlue}`} title="Share options" />}</div>
        {this.props.readingId && <div>Phase of dialogue: {this.props.journal.pingPongStates[this.props.readingId]}</div>}

        {this.firstJournalContent}

        {this.state.isExpand && this.journalContentArray}

      </div>
    );
  }
}
/*
JournalRow.proptypes = {
  journal: PropTypes.object.isrequired
}; */
const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, null)(JournalRow);
