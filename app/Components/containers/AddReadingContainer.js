import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import jQuery from 'jquery';


import AddReadingForm from '../AddReadingForm';
import { getImageArray } from '../../apis/Util';
import { checkAuthentication } from '../../actions/UserActions';
import { clickCoin, clearAddReadingTempState, createReading } from '../../actions/ReadingActions';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';

/**
 * Add reading container
 * @returns {null} No return
 */
export class AddReadingContainer extends Component {
  static propTypes = {
    addReadingTempState: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    readings: PropTypes.array.isRequired,
    clickCoin: PropTypes.func.isRequired,
    clearAddReadingTempState: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    createReading: PropTypes.func.isRequired
  };
  /**
  * Eliminating empty string from changeLines.
  * @param {string} changeLines is current change lines' string.
  * @returns {string} Return a new string without empty string.
  */
  static eliminateEmptyString(changeLines) {
    return changeLines.split(' ').filter((element) => element.length > 0).join(',');
  }

  /**
   * Handle subcomponent's cancel callback.
   * @returns {null} No return.
   */
  static handleCancelCallback = () =>
    $('#addReadingModal').modal('toggle'); // This method will use the $ that comes from index.html page.

  /**
   * Checking authentication
   * @returns {null} No return
   */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearAddReadingTempState();
    this.isFinishCreating = false;
  }

  /**
   * Clearing addReadingTempState, unlocking submit buttons, and turn off the addReadingForm (modal).
   * @param {nextProps} nextProps is an object that contains new props.
   * @returns {null} No return
   */
  componentWillReceiveProps(nextProps) {
    /* istanbul ignore next */
    if (nextProps.readings.length !== 0 &&
      this.isFinishCreating) {
      this.isFinishCreating = false;
      AddReadingContainer.handleCancelCallback();
      this.props.clearAddReadingTempState();
      // jQuery('button[type=submit]').attr('disabled', '');
    }
  }

  /**
   * Handle subcomponent's coin click callback.
   * @param {string} lineNumber is the number of line.
   * @param {int} coinsPoint is the point that moment this line has based on the calculation.
   * @returns {null} No return.
   */
  handleCoinClickCallback = (lineNumber, coinsPoint) => {
    const changeLinesArr = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    const regExpArr = [/1st/, /2nd/, /3rd/, /4th/, /5th/, /6th/];
    // change the state based on result
    const addReadingTempState = Object.assign({}, this.props.addReadingTempState); /* Making a copy from previous state */
    let side1;
    let middle1;
    let side2;
    let middle2;
    const classSide = 'img-line-side-big';
    const classMiddle = 'img-line-middle-big';
    const classMiddleB = 'img-line-middle-blank-big';
    // const classRed = 'background-red-big';
    const classRedSide = 'img-line-side-red-big';
    const classRedMiddle = 'img-line-middle-red-big';
    // console.log("b:",this.state.changeLines);
    // console.log("r:",this.changeLinesArr[lineNumber]);
    addReadingTempState.changeLines = addReadingTempState.changeLines.replace(regExpArr[lineNumber], '');
    const changeLinesIndex = addReadingTempState.changeLinesNumberArray.indexOf(`${lineNumber}`);
    if (changeLinesIndex !== -1) addReadingTempState.changeLinesNumberArray
      .splice(changeLinesIndex, 1);

    // console.log("cda:",this.state.changeLines);
    switch (coinsPoint) {
      case 6:
        side1 = classRedSide;
        side2 = classRedSide;
        middle1 = classMiddleB;
        middle2 = classRedMiddle;
        // erase the word if it has already exsited
        addReadingTempState.changeLines += addReadingTempState.changeLines.length === 0 ? changeLinesArr[lineNumber] : `  ${changeLinesArr[lineNumber]}`;
        addReadingTempState.changeLinesNumberArray.push(lineNumber);// Also put the line number in an array
        // put number to image array
        addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
        addReadingTempState.imageArrays.img2[lineNumber] = 7;
        break;
      case 7:
        side1 = classSide;
        middle1 = classMiddle;
        side2 = classSide;
        middle2 = classMiddle;
        addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
        addReadingTempState.imageArrays.img2[lineNumber] = coinsPoint;
        break;
      case 9:
        side1 = classRedSide;
        side2 = classRedSide;
        middle1 = classRedMiddle;
        middle2 = classMiddleB;
        // erase the word if it has already exsited
        addReadingTempState.changeLines += addReadingTempState.changeLines.length === 0 ? changeLinesArr[lineNumber] : `  ${changeLinesArr[lineNumber]}`;
        addReadingTempState.changeLinesNumberArray.push(lineNumber);// Also put the line number in an array
        // put number to image array
        addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
        addReadingTempState.imageArrays.img2[lineNumber] = 8;
        break;
      case 8:
        side1 = classSide;
        side2 = classSide;
        middle1 = classMiddleB;
        middle2 = classMiddleB;
        addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
        addReadingTempState.imageArrays.img2[lineNumber] = coinsPoint;
        break;
      default:
        break;
    }
    addReadingTempState[`line${lineNumber}`].side1 = side1;
    addReadingTempState[`line${lineNumber}`].side2 = side2;
    addReadingTempState[`line${lineNumber}`].middle1 = middle1;
    addReadingTempState[`line${lineNumber}`].middle2 = middle2;

    // set next line to be available
    addReadingTempState.availableArr[(lineNumber * 1) + 1] = true;
    this.props.clickCoin(addReadingTempState); /* Make sure addReadingTempState is a new object */
  }

  /**
   * Handle subcomponent's submit callback.
   * @param {object} readingObject is the new reading object.
   * @returns {null} No return.
   */
  handleSubmitCallback = readingObject => {
    const img1 = this.props.addReadingTempState.imageArrays.img1.join();
    const img2 = this.props.addReadingTempState.imageArrays.img2.join();

    const reading = {
      reading_name: readingObject.readingName,
      hexagram_arr_1: getImageArray(img1),
      hexagram_arr_2: getImageArray(img2),
      img1,
      img2,
      date: new Date(readingObject.date), // keeping a date object to mongoDB
      change_lines: this.props.addReadingTempState.changeLinesNumberArray,
      change_lines_text: AddReadingContainer
        .eliminateEmptyString(this.props.addReadingTempState.changeLines),
      people: readingObject.people,
      userName: this.props.user.customName ?
        this.props.user.customName : this.props.user.displayName
    };
    // Before send to the server, setting up the right local time
    const currentTime = new Date();
    reading.date.setHours(currentTime.getHours());
    reading.date.setMinutes(currentTime.getMinutes());
    reading.date.setSeconds(currentTime.getSeconds());
    this.isFinishCreating = true;
    // Calling the action.
    this.props.createReading(reading);
  };

  /**
   * The render method for this component.
   * @returns {null} No return.
   */
  render() {
    return (
      <div className="modal fade" id="addReadingModal" tabIndex="-1" role="dialog" aria-labelledby="addReadingModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addReadingModalLabel">Add a new reading</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <LoadingAnimation />
              <AddReadingForm
                handleSubmit={this.handleSubmitCallback}
                handleCancel={AddReadingContainer.handleCancelCallback}
                handleCoinClick={this.handleCoinClickCallback}
                addReadingTempState={this.props.addReadingTempState}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  addReadingTempState: state.addReadingTempState,
  user: state.user,
  readings: state.readings
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  clickCoin: addReadingTempState => dispatch(clickCoin(addReadingTempState)),
  clearAddReadingTempState: _ => dispatch(clearAddReadingTempState()),
  checkAuthentication: _ => dispatch(checkAuthentication()),
  createReading: reading => dispatch(createReading(reading))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddReadingContainer);
