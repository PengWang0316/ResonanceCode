import React, { Component } from "react";
import PropTypes from "prop-types";

class JournalContent extends Component{

  componentWillMount(){
    this.state = {isShared: this.props.isShared};
    this.state[this.props.newContentKey]=this.props.newContent;
    // console.log("isShared: ",this.state.isShared);
  }

  handleChange(event){
    // let newState={};
    // newState[this.props.newContentKey]=event.target.value;
    this.setState({
      [this.props.newContentKey]: event.target.value
    });
    this.props.handleChangeCallback(this.props.newContentKey, event.target.value);
  }

  handleClose(){
    // console.log("handleclose:",contentKey);
    this.props.handleDeleteContentCallback(this.props.newContentKey);
  }

  handleSharedBoxChange(){
    // console.log("isShared", this.state.isShared);
    let isShared = !this.state.isShared;
    this.setState({isShared: isShared});
    this.props.handleSharedBoxChangeCallback(this.props.newContentKey, isShared);
  }

  render(){
    let contentName = this.props.newContentName.replace(/_/g, " ");
    let contentKey = this.props.newContentKey;
    return(
      <div className="form-group form-div">
        <i onClick={()=>{this.handleClose();}} className="fa fa-window-close closeIconSpan" title={`Remove ${contentName}`} />
        <div>
          <div className="row d-flex justify-content-between">
            <div className="col-xs-6">
              <label htmlFor={contentKey} className="col-form-label text-capitalize pl-4"><b>{contentName}</b></label>
            </div>
            <div className="col-xs-6">
              <label className="col-form-label checkbox-inline"><input onChange={()=>{this.handleSharedBoxChange();}} type="checkbox" id="inlineCheckbox1" checked={this.state.isShared} /> Share</label>
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
  newContentName: PropTypes.string.isRequired,
  newContentKey: PropTypes.string.isRequired,
  handleChangeCallback: PropTypes.func.isRequired,
  handleDeleteContentCallback: PropTypes.func.isRequired,
  handleSharedBoxChangeCallback: PropTypes.func.isRequired,
  isShared: PropTypes.bool.isRequired
};
export default JournalContent;
