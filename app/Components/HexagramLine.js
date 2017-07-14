import React, { Component } from "react";
import PropTypes from "prop-types";
import ChooseCoin from "./ChooseCoin";

class HexagramLine extends Component{

  componentWillMount(){
    this.state={
      isShowCoins: false,
      isRecorded: false,
      headsTails: ""
    }
    // console.log("HexagramLine()",this.state.isRecorded, this.props.isFirst);
  }

  handleDivClick(){
    this.setState({
      isShowCoins:!this.state.isShowCoins
    });
  }

/*  handleCoinClick(){
    this.props.
  }*/

  handleCancel(){
    this.setState({isShowCoins: false});
  }

  handleCoinClick(lineNumber, coins, headsTails){
    if(this.props.isFirst) {
      this.props.handleCoinClick(lineNumber,coins);
      this.setState({isRecorded:true, headsTails:headsTails});
    }
  }

  render(){
    return (
      <div>
        {/* Show blank div before users click and record the result */}
        {(!this.state.isRecorded && this.props.isFirst) ?
          <div className="availableDiv text-center" onClick={()=>{this.handleDivClick();}}>Click here to enter Line {this.props.lineNumber*1+1}</div> :
          <div className="image-line-big" onClick={()=>{this.handleDivClick();}}><div className={this.props.side}></div><div className={this.props.middle}></div><div className={`${this.props.side} text-right`}><span>{this.state.headsTails}</span></div></div>
        }




        {/*  The coins pick up window  */}
        {this.state.isShowCoins &&

              <ChooseCoin lineNumber={this.props.lineNumber} handleCoinClick={(lineNumber,coins, headsTails)=>{this.handleCoinClick(lineNumber,coins, headsTails);}} handleCancel={()=>{this.handleCancel();}} />

        }


      </div>

    );
  }

}
HexagramLine.propTypes={
  lineNumber: PropTypes.string.isRequired,
  handleCoinClick: PropTypes.func,
  side: PropTypes.string.isRequired,
  middle: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired
};
export default HexagramLine;
