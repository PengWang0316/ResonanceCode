import React, { Component } from 'react';
// import PropTypes from "prop-types";
import { connect } from 'react-redux';

import ChooseCoin from './ChooseCoin';
import ChooseHexagramLines from './ChooseHexagramLines';
import styles from '../styles/HexagramLine.module.css';

/** The component for every hexagram line.
 * @returns {null} No return.
 */
class HexagramLine extends Component {
  /** Initialize the states when the component is mounted.
    * @param {object} props is an object that contains props' values.
    * @returns {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = this.getInitialStates();
  }

  /** After add a new reading, set the states to initial values.
    * TODO this method will initialize state twice when the first time loads the compoenent. But using this.props.readings.length !== 0 will cause the component fail to initialize state when the use adds the first reading.
   * @param {object} nextProps contains new props.
   * @returns {null} No return.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.readings.length !== nextProps.readings.length)
      this.setState(this.getInitialStates());
  }

  /** Setting the initial states for the component.
   * @returns {null} No return.
   */
  getInitialStates = () => Object.assign({}, {
    isShowCoins: false,
    isRecorded: false,
    headsTails: '',
    coinMode: this.props.user.settings.coinMode
  });

  /** Showing the coin picking up interface when a user click it.
   * @returns {null} No return.
   */
  handleDivClick = () => this.setState({ isShowCoins: !this.state.isShowCoins });

  /*  handleCoinClick(){
    this.props.
  } */

  /** Hiding the coin picking up interface when a user click the cancel button.
   * @returns {null} No return.
   */
  handleCancel = () => this.setState({ isShowCoins: false });

  /** Calling back the method when a user click a coin icon.
   * @param {number} lineNumber is the number of hexagram line.
   * @param {number} coins is the total point for three coins.
   * @param {string} headsTails is a string for three coins.
   * @returns {null} No return.
   */
  handleCoinClick = (lineNumber, coins, headsTails) => {
    if (this.props.isFirst) {
      this.props.handleCoinClick(lineNumber, coins);
      this.setState({ isRecorded: true, headsTails });
    }
  }

  /** Switch the input mode when a user clicks the switch button.
    * @returns {null} No return.
  */
  handleSwitchModeCallback = () => this.setState({ coinMode: !this.state.coinMode });

  /** The render method for the component.
   * @returns {jsx} return jsx for the component.
   */
  render() {
    return (
      <div>
        {/* Show blank div before users click and record the result */}
        {(!this.state.isRecorded && this.props.isFirst) ?
          <div role="button" tabIndex="-1" className={`text-center ${styles.availableDiv}`} onClick={this.handleDivClick}>Click here to enter Line {(this.props.lineNumber * 1) + 1}</div> :
          <div role="button" tabIndex="-2" className={`${styles.imageLineBig}`} onClick={this.handleDivClick}><div className={`${styles[this.props.side]}`} /><div className={`${styles[this.props.middle]}`} /><div className={`${styles[this.props.side]} text-right`}><span>{this.state.headsTails}</span></div></div>
        }


        {/*  The coins pick up window  */}
        {this.state.isShowCoins && this.state.coinMode &&
        <ChooseCoin
          lineNumber={this.props.lineNumber}
          handleCoinClick={this.handleCoinClick}
          handleCancel={this.handleCancel}
          handleSwitchMode={this.handleSwitchModeCallback}
        />
        }

        {/*  The hexagram lines pick up window  */}
        {this.state.isShowCoins && !this.state.coinMode &&
        <ChooseHexagramLines
          lineNumber={this.props.lineNumber}
          handleCoinClick={this.handleCoinClick}
          handleCancel={this.handleCancel}
          handleSwitchMode={this.handleSwitchModeCallback}
        />
        }


      </div>

    );
  }
}
/*
HexagramLine.propTypes={
  lineNumber: PropTypes.string.isRequired,
  handleCoinClick: PropTypes.func,
  side: PropTypes.string.isRequired,
  middle: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired
}; */
const mapStateToProps = state => ({
  readings: state.readings,
  user: state.user
});
export default connect(mapStateToProps, null)(HexagramLine);
