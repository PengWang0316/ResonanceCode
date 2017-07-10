import React, {Component} from "react";
import ChooseCoin from "./ChooseCoin";
// import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import LoginApi from "../apis/LoginApi";
import Loading from "./Loading";
import Util from "../apis/Util";

class AddReading extends Component {

  componentWillMount(){
    this.imageArrays={img1:[],img2:[]};
    this.changeLinesArr=["1st","2nd","3rd","4th","5th","6th"];
    this.regExpArr=[/1st/,/2nd/,/3rd/,/4th/,/5th/,/6th/];
    this.changeLinesNumberArray=[];
    // getting current date
    // let currentDate = new Date();
    let dateString = Util.getCurrentDateString();
    // console.log("current date:", dateString);
    this.state={
      line0:{side1:"", middel1:"",side2:"", middel2:""},
      line1:{side1:"", middel1:"",side2:"", middel2:""},
      line2:{side1:"", middel1:"",side2:"", middel2:""},
      line3:{side1:"", middel1:"",side2:"", middel2:""},
      line4:{side1:"", middel1:"",side2:"", middel2:""},
      line5:{side1:"", middel1:"",side2:"", middel2:""},
      changeLines: "",
      availableArr: [true,false,false,false,false,false,false],
      readingName:"",
      date:dateString,
      people:"",
      isWriting: false
    };
  }

  handleCoinClick(lineNumber,coinsPoint){
    // console.log("LineNumber:",lineNumber);
    // console.log("coin point:",coinsPoint);
    // change the state based on result
    let side1, middle1, side2, middle2;
    let classSide="img-line-side";
    let classMiddle="img-line-middle";
    let classMiddleB="img-line-middle-blank";
    let classRed="background-red";
    let classRedSide="img-line-side-red";
    let classRedMiddle="img-line-middle-red";
    // console.log("b:",this.state.changeLines);
    // console.log("r:",this.changeLinesArr[lineNumber]);
    this.state.changeLines=this.state.changeLines.replace(this.regExpArr[lineNumber],"");

    // console.log("a:",this.state.changeLines);
    switch (coinsPoint){
      case 6:
        side1=side2=classRedSide;
        middle1=classMiddleB;
        middle2=classRedMiddle;
        // erase the word if it has already exsited
        // console.log("changeLinesArr",this.changeLinesArr[lineNumber]);
        // this.state.changelines=this.state.changeLines.replace(this.changeLinesArr[lineNumber],"");
        this.state.changeLines+=this.state.changeLines.length===0?this.changeLinesArr[lineNumber]:`  ${this.changeLinesArr[lineNumber]}`;
        this.changeLinesNumberArray.push(lineNumber);// Also put the line number in an array
        // put number to image array
        this.imageArrays.img1[lineNumber]=coinsPoint;
        this.imageArrays.img2[lineNumber]=7;
        break;
      case 7:
        side1=classSide;
        middle1=classMiddle;
        side2=classSide;
        middle2=classMiddle;
        this.imageArrays.img1[lineNumber]=coinsPoint;
        this.imageArrays.img2[lineNumber]=coinsPoint;
        break;
        case 9:
          side1=side2=classRedSide;
          middle1=classRedMiddle;
          middle2=classMiddleB;
          // erase the word if it has already exsited
          // this.state.changelines=this.state.changeLines.replace(this.changeLinesArr[lineNumber],"");
          this.state.changeLines+=this.state.changeLines.length===0?this.changeLinesArr[lineNumber]:`  ${this.changeLinesArr[lineNumber]}`;
          this.changeLinesNumberArray.push(lineNumber);// Also put the line number in an array
          // put number to image array
          this.imageArrays.img1[lineNumber]=coinsPoint;
          this.imageArrays.img2[lineNumber]=8;
          break;
        case 8:
          side1=side2=classSide;
          middle1=middle2=classMiddleB;
          this.imageArrays.img1[lineNumber]=coinsPoint;
          this.imageArrays.img2[lineNumber]=coinsPoint;
          break;
    }
    // console.log(`line${lineNumber}`);
    this.state[`line${lineNumber}`].side1=side1;
    this.state[`line${lineNumber}`].side2=side2;
    this.state[`line${lineNumber}`].middle1=middle1;
    this.state[`line${lineNumber}`].middle2=middle2;

    // set next line to be available
    this.state.availableArr[lineNumber*1+1]=true;
    // console.log(this.eliminateEmptyString(this.state.changeLines));
    this.setState(this.state);
  }

  eliminateEmptyString(changeLines){
    return changeLines.split(" ").filter((element)=>{
      return element.length>0;
    }).join(",");
  }

  handleSubmit(event){
    if (event) event.preventDefault();
    // console.log("Submit");
    // locking screen and call api
    this.setState({isWriting:true});
    let img1=this.imageArrays.img1.join(), img2=this.imageArrays.img2.join();

    let reading={
      reading_name: this.state.readingName,
      hexagram_arr_1: Util.getImageArray(img1),
      hexagram_arr_2: Util.getImageArray(img2),
      img1:img1,
      img2:img2,
      date: new Date(this.state.date), // keeping a date object to mongoDB
      change_lines: this.changeLinesNumberArray,
      change_lines_text: this.eliminateEmptyString(this.state.changeLines),
      people: this.state.people,
      user_id: LoginApi.isLogin(document).userid
    };
    // console.log("reading object:",reading);
    DatabaseApi.createReading(reading).then((result)=>{
      // console.log("result:",result);
      this.props.history.push("/reading");
    });
  }

  handleChange(event, inputName){
    if(inputName=="readingName") this.setState({readingName: event.target.value});
    else if(inputName=="people") this.setState({people: event.target.value});
    else if(inputName=="date") this.setState({date: event.target.value});
  }

  render() {
    return (
      <div key="key_addReading" className="addReadingDiv">
        {this.state.isWriting && <Loading text="Writing" />}
        <div className="rcTitle">Create A New Reading</div>
        <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>
          <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={!(this.state.availableArr[6] && this.state.people.length>0 && this.state.readingName.length>0 && this.state.date.length>0 && !this.state.isWriting)}>Submit</button></div>
          <div className="form-group row form-div">
            <label htmlFor="readingName" className="col-sm-3 col-form-label">Reading Name</label>
            <div className="col-sm-9">
              <input className="form-control" type="text" placeholder="The name for this reading" id="readingName" onChange={(event)=>{this.handleChange(event,"readingName")}} />
            </div>
          </div>

          <div className="form-group row form-div">
            <label htmlFor="people" className="col-sm-1 col-form-label">People</label>
            <div className="col-sm-7">
              <input className="form-control" type="text" placeholder="Who are doing this with you" id="people" onChange={(event)=>{this.handleChange(event,"people")}} />
            </div>
            <label htmlFor="date" className="col-sm-1 col-form-label">Date</label>
            <div className="col-sm-3">
              <input className="form-control" type="text" value={this.state.date} id="date"  onChange={(event)=>{this.handleChange(event,"date")}}/>
            </div>
          </div>
          </form>

          {/*The results of coins*/}
          <div className="rcTitle coinDiv">What is the best title here?</div>
          <div className="row">
            <div className="col-sm-8">

              {this.state.availableArr[5] ? <ChooseCoin lineNumber="5" handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} /> :<div className="noAvailableDiv text-center">Line 6 has not been available yet.</div>}

              {this.state.availableArr[4] ? <ChooseCoin lineNumber="4" handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} /> :<div className="noAvailableDiv text-center">Line 5 has not been available yet.</div>}

              {this.state.availableArr[3] ? <ChooseCoin lineNumber="3" handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} /> :<div className="noAvailableDiv text-center">Line 4 has not been available yet.</div>}

              {this.state.availableArr[2] ? <ChooseCoin lineNumber="2" handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} /> :<div className="noAvailableDiv text-center">Line 3 has not been available yet.</div>}

              {this.state.availableArr[1] ? <ChooseCoin lineNumber="1" handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} /> :<div className="noAvailableDiv text-center">Line 2 has not been available yet.</div>}

              <ChooseCoin lineNumber="0" isAvailable={this.state.availableArr[0]} handleCoinClick={(lineNumber,coins)=>{this.handleCoinClick(lineNumber,coins);}} />

            </div>

            <div className="col-sm-4">
              {/*Two images div*/}
              <div>
                {/*The first image*/}
                <div className="inlineBlock">
                  <div className="image-line"><div className={this.state.line5.side1}></div><div className={this.state.line5.middle1}></div><div className={this.state.line5.side1}></div></div>
                  <div className="image-line"><div className={this.state.line4.side1}></div><div className={this.state.line4.middle1}></div><div className={this.state.line4.side1}></div></div>
                  <div className="image-line"><div className={this.state.line3.side1}></div><div className={this.state.line3.middle1}></div><div className={this.state.line3.side1}></div></div>
                  <div className="image-line"><div className={this.state.line2.side1}></div><div className={this.state.line2.middle1}></div><div className={this.state.line2.side1}></div></div>
                  <div className="image-line"><div className={this.state.line1.side1}></div><div className={this.state.line1.middle1}></div><div className={this.state.line1.side1}></div></div>
                  <div className="image-line"><div className={this.state.line0.side1}></div><div className={this.state.line0.middle1}></div><div className={this.state.line0.side1}></div></div>
                </div>
                {/*The second image*/}
                <div className="inlineBlock img-second-div">
                  <div className="image-line"><div className={this.state.line5.side2}></div><div className={this.state.line5.middle2}></div><div className={this.state.line5.side2}></div></div>
                  <div className="image-line"><div className={this.state.line4.side2}></div><div className={this.state.line4.middle2}></div><div className={this.state.line4.side2}></div></div>
                  <div className="image-line"><div className={this.state.line3.side2}></div><div className={this.state.line3.middle2}></div><div className={this.state.line3.side2}></div></div>
                  <div className="image-line"><div className={this.state.line2.side2}></div><div className={this.state.line2.middle2}></div><div className={this.state.line2.side2}></div></div>
                  <div className="image-line"><div className={this.state.line1.side2}></div><div className={this.state.line1.middle2}></div><div className={this.state.line1.side2}></div></div>
                  <div className="image-line"><div className={this.state.line0.side2}></div><div className={this.state.line0.middle2}></div><div className={this.state.line0.side2}></div></div>
                </div>
              </div>
              {/*Two images div end*/}

              <div className="change-line-div"><span>Change Lines: </span>{this.state.changeLines}</div>
            </div>

          </div>

          <div className="text-left bottom-btn-div"><button type="submit" className="btn btn-info loginButton" onClick={()=>{this.handleSubmit();}} disabled={!(this.state.availableArr[6] && this.state.people.length>0 && this.state.readingName.length>0 && this.state.date.length>0 && !this.state.isWriting)}>Submit</button></div>
        </div>
      );
    }
  }
  export default AddReading;
