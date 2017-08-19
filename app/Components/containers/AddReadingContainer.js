import React, { Component } from "react";
import AddReadingForm from "../AddReadingForm";
import Loading from "../Loading";
import LoginApi from "../../apis/LoginApi";
import { getImageArray } from "../../apis/Util";
import { createReading } from "../../apis/DatabaseApi";
import { connect } from "react-redux";

import { clickCoin } from "../../actions/AddReadingActions";
import { isLoading } from "../../actions/LoadingActions";

class AddReadingContainer extends Component {

  handleCoinClickCallback(lineNumber, coinsPoint){
    // console.log("LineNumber:",lineNumber);
    // console.log("coin point:",coinsPoint);
    const changeLinesArr = ["1st","2nd","3rd","4th","5th","6th"];
    const regExpArr = [/1st/,/2nd/,/3rd/,/4th/,/5th/,/6th/];
    // change the state based on result
    let addReadingTempState = Object.assign({}, this.props.addReadingTempState); /* Making a copy from previous state */
    // console.log("Previous state: ", addReadingTempState);
    let side1, middle1, side2, middle2;
    const classSide = "img-line-side-big";
    const classMiddle = "img-line-middle-big";
    const classMiddleB = "img-line-middle-blank-big";
    const classRed = "background-red-big";
    const classRedSide = "img-line-side-red-big";
    const classRedMiddle = "img-line-middle-red-big";
    // console.log("b:",this.state.changeLines);
    // console.log("r:",this.changeLinesArr[lineNumber]);
    addReadingTempState.changeLines = addReadingTempState.changeLines.replace(regExpArr[lineNumber],"");
    let changeLinesIndex = addReadingTempState.changeLinesNumberArray.indexOf(`${lineNumber}`);
    if (changeLinesIndex != -1) addReadingTempState.changeLinesNumberArray.splice(changeLinesIndex, 1);

    // console.log("cda:",this.state.changeLines);
    switch (coinsPoint){
      case 6:
        side1 = side2 = classRedSide;
        middle1 = classMiddleB;
        middle2 = classRedMiddle;
        // erase the word if it has already exsited
        // console.log("changeLinesArr",this.changeLinesArr[lineNumber]);
        // this.state.changelines=this.state.changeLines.replace(this.changeLinesArr[lineNumber],"");
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
          side1 = side2 = classRedSide;
          middle1 = classRedMiddle;
          middle2 = classMiddleB;
          // erase the word if it has already exsited
          // this.state.changelines=this.state.changeLines.replace(this.changeLinesArr[lineNumber],"");
          addReadingTempState.changeLines += addReadingTempState.changeLines.length === 0 ? changeLinesArr[lineNumber] : `  ${changeLinesArr[lineNumber]}`;
          addReadingTempState.changeLinesNumberArray.push(lineNumber);// Also put the line number in an array
          // put number to image array
          addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
          addReadingTempState.imageArrays.img2[lineNumber] = 8;
          break;
        case 8:
          side1 = side2 = classSide;
          middle1 = middle2 = classMiddleB;
          addReadingTempState.imageArrays.img1[lineNumber] = coinsPoint;
          addReadingTempState.imageArrays.img2[lineNumber] = coinsPoint;
          break;
    }
    // console.log(`line${lineNumber}`);
    addReadingTempState[`line${lineNumber}`].side1 = side1;
    addReadingTempState[`line${lineNumber}`].side2 = side2;
    addReadingTempState[`line${lineNumber}`].middle1 = middle1;
    addReadingTempState[`line${lineNumber}`].middle2 = middle2;

    // set next line to be available
    addReadingTempState.availableArr[lineNumber * 1 + 1] = true;
    // console.log(this.eliminateEmptyString(this.state.changeLines));
    // console.log(this.imageArrays);
    this.props.clickCoin(addReadingTempState); /* Make sure addReadingTempState is a new object */
  }

  handleCancelCallback(){
    this.props.history.push("/reading");
  }

  eliminateEmptyString(changeLines){
    return changeLines.split(" ").filter((element)=>{
      return element.length>0;
    }).join(",");
  }

  handleSubmitCallback(readingObject){
    // if (event) event.preventDefault();
    // console.log("Submit");
    // locking screen and call api
    // this.setState({isWriting:true});
    this.props.loading(true);
    let img1=this.props.addReadingTempState.imageArrays.img1.join(), img2=this.props.addReadingTempState.imageArrays.img2.join();

    let reading={
      reading_name: readingObject.readingName,
      hexagram_arr_1: getImageArray(img1),
      hexagram_arr_2: getImageArray(img2),
      img1:img1,
      img2:img2,
      date: new Date(readingObject.date), // keeping a date object to mongoDB
      change_lines: this.props.addReadingTempState.changeLinesNumberArray,
      change_lines_text: this.eliminateEmptyString(this.props.addReadingTempState.changeLines),
      people: readingObject.people,
      user_id: LoginApi.isLogin(document).userid
    };
    // console.log("reading object:",reading);
    createReading(reading).then((result)=>{
      // console.log("result:",result);
      this.props.loading(false);
      this.props.history.push("/reading");
    });
  }

  render(){
    return(
      <div key="key_addReading" className="addReadingDiv">
        <Loading text="Writing" isLoading = {this.props.isLoadingState} />
        <AddReadingForm handleSubmit = {(readingObject) => {this.handleSubmitCallback(readingObject);}} handleCancel = {() => {this.handleCancelCallback();}} handleCoinClick = {(lineNumber, coinsPoint) => {this.handleCoinClickCallback(lineNumber, coinsPoint);}} addReadingTempState = {this.props.addReadingTempState} />
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    addReadingTempState: state.addReadingTempState,
    isLoadingState: state.isLoading
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clickCoin: addReadingTempState => {dispatch(clickCoin(addReadingTempState));},
    loading: isLoadingBool => {dispatch(isLoading(isLoadingBool));}
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddReadingContainer);
