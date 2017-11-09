import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** Show the journal content in the adding or editing journal page. */
class JournalContent extends Component {
  /** Initializing states.
    * @param {object} props is an object that contains props' values.
    * @returns {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      isShared: props.isShared,
      [this.props.newContentKey]: this.props.newContent
    };
    // this.state[this.props.newContentKey] = this.props.newContent;
    // console.log("isShared: ",this.state.isShared);
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
    const isShared = !this.state.isShared;
    this.setState({ isShared });
    this.props.handleSharedBoxChangeCallback(this.props.newContentKey, isShared);
  }

  /** Rendering the jsx for the component.
    * @returns {jsx} Return jsx.
  */
  render() {
    const contentName = this.props.newContentName.replace(/_/g, ' ');
    const contentKey = this.props.newContentKey;
    return (
      <div className="form-group form-div">
        <i role="button" tabIndex="-1" onClick={this.handleClose} className="fa fa-window-close closeIconSpan" title={`Remove ${contentName}`} />
        <div>
          <div className="row d-flex justify-content-between">
            <div className="col-xs-6">
              <label htmlFor={contentKey} className="col-form-label text-capitalize pl-4"><b>{contentName}</b></label>
            </div>
            <div className="col-xs-6">
              <label className="col-form-label checkbox-inline" htmlFor="sharedCheckbox"><input onChange={this.handleSharedBoxChange} type="checkbox" id="sharedCheckbox" checked={this.state.isShared} /> Share</label>
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
JournalContent.propTypes = {
  newContent: PropTypes.string.isRequired,
  newContentName: PropTypes.string.isRequired,
  newContentKey: PropTypes.string.isRequired,
  handleChangeCallback: PropTypes.func.isRequired,
  handleDeleteContentCallback: PropTypes.func.isRequired,
  handleSharedBoxChangeCallback: PropTypes.func.isRequired,
  isShared: PropTypes.bool.isRequired
};
export default JournalContent;
