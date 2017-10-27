import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as headsImage from '../imgs/heads.gif';
import * as tailsImage from '../imgs/tails.gif';
// import $ from "jQuery";

/** The component that allows a user to choose the coins' retult. */
class ChooseCoin extends Component {
  /** Setting some initial variables and states for the component.
    * @returns {null} No return.
  */
  componentWillMount() {
    // setup the image file and put it in state
    this.headsImg = headsImage.default;
    this.tailsImg = tailsImage.default;
    this.state = {
      0: [this.headsImg, '-', false], // [image, title message, have content yet]
      1: [this.headsImg, '-', false],
      2: [this.headsImg, '-', false]
    };
    // setup the inintial value array for coins
    this.coinsArray = [2, 2, 2];
    // this.isHeadsArray=[true]
    // console.log(this.props.lineNumber,this.props.isAvailable);
  }

  /** Calculating the points for coins and setting the state.
    * @param {number} coinNum tells witch coin was clicked. (Head counts 3 points and tail counts as 2 points.)
    * @returns {null} No return.
  */
  onClickCoin(coinNum) {
    if (this.coinsArray[coinNum] === 3) {
      this.coinsArray[coinNum] = 2;
      this.state[coinNum][0] = this.tailsImg;
      this.state[coinNum][1] = 'T';
    } else {
      this.coinsArray[coinNum] = 3;
      this.state[coinNum][0] = this.headsImg;
      this.state[coinNum][1] = 'H';
      this.state[coinNum][2] = true;
    }
    this.setState(this.state);
    // console.log(this.state);
  }

  /** The method that will be called when a user click the first coin image.
    * @return {null} No return.
  */
  handleClickFirstCoin = () => this.onClickCoin(0);

  /** The method that will be called when a user click the second coin image.
    * @return {null} No return.
  */
  handleClickSecondCoin = () => this.onClickCoin(1);

  /** The method that will be called when a user click the third coin image.
    * @return {null} No return.
  */
  handleClickThirdCoin = () => this.onClickCoin(2);

  /** Handle the submit event when a user click submit button.
    * @return {null} No return.
  */
  handleSubmit = () => {
    let totalNum = 0;
    this.coinsArray.forEach(element => { totalNum += element; });
    // prepare heads and tails text
    const headsTails = `${this.state['0'][1]} ${this.state['1'][1]} ${this.state['2'][1]}`;
    this.props.handleCoinClick(this.props.lineNumber, totalNum, headsTails);
    this.props.handleCancel();
  }

  /** Calling the cancel method when a user click the cancel button.
    * @returns {null} No return.
   */
  handleCancel = () => this.props.handleCancel();

  /** The render method of the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div className="coinPickUpBgDiv">
        <div className="coinPickUpWindowDiv">

          <div><b>Coins for line {(this.props.lineNumber * 1) + 1}</b></div>
          <div className="container">
            <div className="row text-center">
              <div className="col">
                <div role="button" tabIndex="-2" onClick={this.handleClickFirstCoin}>{this.state['0'][2] ? <img src={this.state['0'][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_0">{this.state['0'][1]}</div>
              </div>
              <div className="col">
                <div role="button" tabIndex="-1" onClick={this.handleClickSecondCoin}>{this.state['1'][2] ? <img src={this.state['1'][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_1">{this.state['1'][1]}</div>
              </div>
              <div className="col">
                <div role="button" tabIndex="0" onClick={this.handleClickThirdCoin}>{this.state['2'][2] ? <img src={this.state['2'][0]} className="coinImg" alt="Coin" title="Click this coin" /> : <div className="emptyCoinDiv">Click</div>}</div>
                <div id="coin_2">{this.state['2'][1]}</div>
              </div>
            </div>
          </div>


          <div className="text-right"><button type="button" className="btn btn-primary" disabled={!this.state['0'][2] || !this.state['1'][2] || !this.state['2'][2]} onClick={this.handleSubmit}>Submit</button><button type="button" className="btn btn-info" onClick={this.handleCancel}>Cancel</button></div>

        </div>
      </div>
    );
  }
}
ChooseCoin.propTypes = {
  lineNumber: PropTypes.string.isRequired,
  handleCoinClick: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default ChooseCoin;
