import React, { Component } from "react";
import PropTypes from "prop-types";

class JournalContent extends Component{

  componentWillMount(){
    this.state = {isShared: false};
    this.state[this.props.newContentKey]="";
  }

  handleChange(event){
    let newState={};
    newState[this.props.newContentKey]=event.target.value;
    this.setState(newState);
    this.props.handleChangeCallback(this.props.newContentKey, newState[this.props.newContentKey]);
  }

  handleClose(){
    // console.log("handleclose:",contentKey);
    this.props.handleDeleteContentCallback(this.props.newContentKey);
  }

  handleSharedBoxChange(){
    let isShared = !this.state.isShared;
    this.setState({isShared: isShared});
    this.props.handleSharedBoxChangeCallback(this.props.newContentKey, isShared);
  }

  render(){
    let contentName = this.props.newContent;
    let contentKey = this.props.newContentKey;
    return(
      <div className="form-group form-div">
        <i onClick={()=>{this.handleClose();}} className="fa fa-window-close closeIconSpan" title={`Remove ${contentName}`} />
        <div className="journalContentTitleDiv">
          <div className="row">
            <div className="col-xs-6 text-left">
              <label htmlFor={contentKey} className="col-form-label">{contentName}</label>
            </div>
            <div className="col-xs-6 text-right">
              <label className="checkbox-inline"><input onChange={()=>{this.handleSharedBoxChange();}} type="checkbox" id="inlineCheckbox1" value={this.state.isShared} /> Share</label>
            </div>
          </div>

        </div>

        <div>
          <textarea className="form-control" rows="3" type="text" value={this.state[contentKey]} placeholder={`${contentName}...`} id={`${contentKey}`} onChange={(event)=>{this.handleChange(event);}} />
        </div>

      </div>
    );
  }

}
JournalContent.propTypes={
  newContent: PropTypes.string.isRequired,
  newContentKey: PropTypes.string.isRequired,
  handleChangeCallback: PropTypes.func.isRequired,
  handleDeleteContentCallback: PropTypes.func.isRequired,
  handleSharedBoxChangeCallback: PropTypes.func.isRequired
};
export default JournalContent;
