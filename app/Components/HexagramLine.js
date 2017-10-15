import React, { Component } from 'react';
// import PropTypes from "prop-types";
import { connect } from 'react-redux';
import ChooseCoin from './ChooseCoin';

/** The component for every hexagram line.
 * @returns {null} No return.
 */
class HexagramLine extends Component {
  /** Initialize the states when the component is mounted.
   * @returns {null} No return.
   */
  componentWillMount() {
    this.initialStates();
  }

  /** After add a new reading, set the states to initial values.
   * @param {object} nextProps contains new props.
   * @returns {null} No return.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.readings.length !== 0 &&
      this.props.readings.length !== nextProps.readings.length) this.initialStates();
  }

  /** Setting the initial states for the component.
   * @returns {null} No return.
   */
  initialStates() {
    this.state = {
      isShowCoins: false,
      isRecorded: false,
      headsTails: ''
    };
  }

  /** Showing the coin picking up interface when a user click it.
   * @returns {null} No return.
   */
  handleDivClick() {
    this.setState({
      isShowCoins: !this.state.isShowCoins
    });
  }

  /*  handleCoinClick(){
    this.props.
  } */

  /** Hiding the coin picking up interface when a user click the cancel button.
   * @returns {null} No return.
   */
  handleCancel() {
    this.setState({ isShowCoins: false });
  }

  /** Calling back the method when a user click a coin icon.
   * @param {number} lineNumber is the number of hexagram line.
   * @param {number} coins is the total point for three coins.
   * @param {string} headsTails is a string for three coins.
   * @returns {null} No return.
   */
  handleCoinClick(lineNumber, coins, headsTails) {
    if (this.props.isFirst) {
      this.props.handleCoinClick(lineNumber, coins);
      this.setState({ isRecorded: true, headsTails });
    }
  }

  /** The render method for the component.
   * @returns {jsx} return jsx for the component.
   */
  render() {
    return (
      <div>
        {/* Show blank div before users click and record the result */}
        {(!this.state.isRecorded && this.props.isFirst) ?
          <div role="button" tabIndex="-1" className="availableDiv text-center" onClick={_ => this.handleDivClick()}>Click here to enter Line {(this.props.lineNumber * 1) + 1}</div> :
          <div role="button" tabIndex="-2" className="image-line-big" onClick={_ => this.handleDivClick()}><div className={this.props.side} /><div className={this.props.middle} /><div className={`${this.props.side} text-right`}><span>{this.state.headsTails}</span></div></div>
        }


        {/*  The coins pick up window  */}
        {this.state.isShowCoins &&

        <ChooseCoin
          lineNumber={this.props.lineNumber}
          handleCoinClick={(lineNumber, coins, headsTails) =>
             this.handleCoinClick(lineNumber, coins, headsTails)}
          handleCancel={() => { this.handleCancel(); }}
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
  readings: state.readings
});
export default connect(mapStateToProps, null)(HexagramLine);
