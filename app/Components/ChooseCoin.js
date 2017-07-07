import React, { Component } from "react";
import PropTypes from "prop-types";
// import $ from "jQuery";

class ChooseCoin extends Component{

  componentWillMount(){
    // setup the image file and put it in state
    this.headsImg=require("../imgs/heads.gif");
    this.tailsImg=require("../imgs/tails.gif");
    this.state={
      0: [this.headsImg,"Heads"],
      1: [this.headsImg,"Heads"],
      2: [this.headsImg,"Heads"]
    }
    // setup the inintial value array for coins
    this.coinsArray=[3,3,3];
    // this.isHeadsArray=[true]
    // console.log(this.props.lineNumber,this.props.isAvailable);
  }

  onClickCoin(coinNum){
    if(this.coinsArray[coinNum]===3){
      this.coinsArray[coinNum]=2;
      this.state[coinNum][0]=this.tailsImg;
      this.state[coinNum][1]="Tails";
    }else{
      this.coinsArray[coinNum]=3;
      this.state[coinNum][0]=this.headsImg;
      this.state[coinNum][1]="Heads";
    }
    this.setState(this.state);
    // console.log(this.state);
    let totalNum=0;
    this.coinsArray.map((element)=>{
      totalNum+=element;
    });
    this.props.handleCoinClick(this.props.lineNumber,totalNum);
  }

  render(){

    return(
      <div>
        <div><b>Coins for line {this.props.lineNumber*1+1}</b></div>
        <div className="row">
          <div className="col-xs-4">
            <div onClick={()=>{this.onClickCoin(0)}}><img src={this.state["0"][0]} className="coinImg" alt="Heads" title="Heads" /></div>
            <div id="coin_0">{this.state["0"][1]}</div>
          </div>
          <div className="col-xs-4">
            <div onClick={()=>{this.onClickCoin(1)}}><img src={this.state["1"][0]} className="coinImg" alt="Heads" title="Heads" /></div>
            <div id="coin_1">{this.state["1"][1]}</div>
          </div>
          <div className="col-xs-4">
            <div onClick={()=>{this.onClickCoin(2)}}><img src={this.state["2"][0]} className="coinImg" alt="Heads" title="Heads" /></div>
            <div id="coin_2">{this.state["2"][1]}</div>
          </div>
        </div>
      </div>
    );
  }

}
ChooseCoin.propTypes={
  lineNumber: PropTypes.string.isRequired,
  handleCoinClick: PropTypes.func.isRequired
};
export default ChooseCoin;
