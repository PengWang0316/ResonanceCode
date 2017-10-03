import React, { Component } from "react";
import PropTypes from "prop-types";
// import $ from "jQuery";

class ChooseCoin extends Component{

  componentWillMount(){
    // setup the image file and put it in state
    this.headsImg=require("../imgs/heads.gif");
    this.tailsImg=require("../imgs/tails.gif");
    this.state={
      0: [this.headsImg,"-",false], //[image, title message, have content yet]
      1: [this.headsImg,"-",false],
      2: [this.headsImg,"-",false]
    }
    // setup the inintial value array for coins
    this.coinsArray=[2,2,2];
    // this.isHeadsArray=[true]
    // console.log(this.props.lineNumber,this.props.isAvailable);
  }

  onClickCoin(coinNum){
    if(this.coinsArray[coinNum]===3){
      this.coinsArray[coinNum]=2;
      this.state[coinNum][0]=this.tailsImg;
      this.state[coinNum][1]="T";
    }else{
      this.coinsArray[coinNum]=3;
      this.state[coinNum][0]=this.headsImg;
      this.state[coinNum][1]="H";
      this.state[coinNum][2]=true;
    }
    this.setState(this.state);
    // console.log(this.state);

  }

  handleSubmit(){
    let totalNum=0;
    this.coinsArray.map((element)=>{
      totalNum+=element;
    });
    // prepare heads and tails text
    let headsTails=`${this.state["0"][1]} ${this.state["1"][1]} ${this.state["2"][1]}`;
    this.props.handleCoinClick(this.props.lineNumber, totalNum, headsTails);
    this.props.handleCancel();
  }

  // handleCancel(){
  //   this.props.handleCancel();
  // }

  render(){

    return(
      <div className="coinPickUpBgDiv">
        <div className="coinPickUpWindowDiv">

          <div><b>Coins for line {this.props.lineNumber*1+1}</b></div>
          <div className="container">
            <div className="row text-center">
              <div className="col">
                <div onClick={()=>{this.onClickCoin(0)}}>{this.state["0"][2] ? <img src={this.state["0"][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_0">{this.state["0"][1]}</div>
              </div>
              <div className="col">
                <div onClick={()=>{this.onClickCoin(1)}}>{this.state["1"][2] ? <img src={this.state["1"][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_1">{this.state["1"][1]}</div>
              </div>
              <div className="col">
                <div onClick={()=>{this.onClickCoin(2)}}>{this.state["2"][2] ? <img src={this.state["2"][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_2">{this.state["2"][1]}</div>
              </div>
            </div>
          </div>


          <div className="text-right"><button type="button" className="btn btn-primary" disabled={!this.state["0"][2] || !this.state["1"][2] || !this.state["2"][2]} onClick={()=>{this.handleSubmit();}}>Submit</button><button type="button" className="btn btn-info" onClick={()=>{this.props.handleCancel();}}>Cancel</button></div>

        </div>
      </div>
    );
  }

}
ChooseCoin.propTypes={
  lineNumber: PropTypes.string.isRequired,
  handleCoinClick: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default ChooseCoin;
