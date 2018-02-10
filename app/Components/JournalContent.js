import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/JournalContent.module.css';

/** Show the journal content in the adding or editing journal page. */
class JournalContent extends Component {
  static propTypes = {
    newContent: PropTypes.string.isRequired,
    newContentName: PropTypes.string.isRequired,
    newContentKey: PropTypes.string.isRequired,
    handleChangeCallback: PropTypes.func.isRequired,
    handleDeleteContentCallback: PropTypes.func.isRequired,
    handleSharedBoxChangeCallback: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired
  };
  /** Initializing states.
    * @param {object} props is an object that contains props' values.
    * @returns {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      isPrivate: props.isPrivate,
      [this.props.newContentKey]: this.props.newContent
    };
    // this.state[this.props.newContentKey] = this.props.newContent;
    // console.log("isShared: ",this.state.isShared);
  }

  /** Initializing Bootstrap's tooltip.
    * @return {null} No return.
  */
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip(); // $ will use the jQuery from index.html.
    // Setting up the textareas' height to fit the content.
    const textarea = document.getElementsByTagName('textarea')[0];
    if (textarea) textarea.style.height = textarea.value === '' ? '85px' : `${textarea.scrollHeight + 15}px`;
  }

  /** Setting state when a user change the value in a input element.
    * @param {object} event is an object that comes from the input element.
    * @returns {null} No return.
  */
  handleChange = ({ target }) => {
    // let newState={};
    // newState[this.props.newContentKey]=event.target.value;
    this.setState({
      [this.props.newContentKey]: target.value
    });
    this.props.handleChangeCallback(this.props.newContentKey, target.value);
  }

  /** Closing a content form when a user clicks delete icon.
    * @returns {null} No return.
  */
  handleClose = () => {
    // console.log("handleclose:",contentKey);
    this.props.handleDeleteContentCallback(this.props.newContentKey);
  }

  /** Setting the state when a user clicks the share box.
    * @returns {null} No return.
  */
  handleSharedBoxChange = () => {
    // console.log("isShared", this.state.isShared);
    const isPrivate = !this.state.isPrivate;
    this.setState({ isPrivate });
    this.props.handleSharedBoxChangeCallback(this.props.newContentKey, isPrivate);
  }

  /** Rendering the jsx for the component.
    * @returns {jsx} Return jsx.
  */
  render() {
    const contentName = this.props.newContentName.replace(/_/g, ' ');
    const contentKey = this.props.newContentKey;
    return (
      <div className="form-group mt-3">
        <i role="button" tabIndex="-1" onClick={this.handleClose} className={`fa fa-window-close ${styles.closeIconSpan}`} title={`Remove ${contentName}`} />
        <div>
          <div className="row d-flex justify-content-between">
            <div className="col-xs-6">
              <label htmlFor={contentKey} className="col-form-label text-capitalize mt-2 pl-4"><b>{contentName}</b></label>
            </div>
            <div className="col-xs-6">
              <label className={`col-form-label ${styles.checkboxInline}`} htmlFor="privateCheckbox" data-toggle="tooltip" data-placement="top" title="Checking this box can keep this content invisible after you share this journal to someone else."><input onChange={this.handleSharedBoxChange} type="checkbox" id="privateCheckbox" checked={this.state.isPrivate} /> Private</label>
            </div>
          </div>
        </div>

        <div>
          <textarea className="form-control" rows="3" type="text" value={this.state[contentKey]} placeholder={`${contentName}...`} id={`${contentKey}`} onChange={this.handleChange} />
        </div>

      </div>
    );
  }
}
// JournalContent.propTypes = {
//   newContent: PropTypes.string.isRequired,
//   newContentName: PropTypes.string.isRequired,
//   newContentKey: PropTypes.string.isRequired,
//   handleChangeCallback: PropTypes.func.isRequired,
//   handleDeleteContentCallback: PropTypes.func.isRequired,
//   handleSharedBoxChangeCallback: PropTypes.func.isRequired,
//   isPrivate: PropTypes.bool.isRequired
// };
export default JournalContent;
