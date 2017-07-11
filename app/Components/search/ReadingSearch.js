import React, { Component } from "react";
// import Login from "../Login";
import DatabaseApi from "../../apis/DatabaseApi";
// import api from "../../apis/api";
import LoginApi from "../../apis/LoginApi";
import BriefReading from "../BriefReading";

class ReadingSearch extends Component {

  componentWillMount(){
    // if no user does not login, direct user back to login page
    if(!LoginApi.isLogin(document)) this.props.history.push("/");

      this.state={
        isSigleDate:true,
        people: "",
        startDate: "",
        endDate: "",
        upper: 0,
        lower: 0,
        line13: 0,
        line25: 0,
        line46:0,
        isStartDateCorrect: false,
        isEndDateCorrect: false,
        readings: null
      };
      // this.setState(this.state);

  }

  handleRadioChange(event){
    this.setState({
      isSigleDate: !this.state.isSigleDate
    });
  }

  handleInputChange(event, inputName){
    let input = event.target.value
    let newStateObject ={}; newStateObject[inputName] = input;
    // checking the format of date
    if(inputName=="startDate"){
      newStateObject.isStartDateCorrect = input.match(/\d\d\/\d\d\/\d\d\d\d$/)?true:false;
    }else if(inputName=="endDate"){
      newStateObject.isEndDateCorrect = input.match(/\d\d\/\d\d\/\d\d\d\d$/)?true:false;
    }
    this.setState(newStateObject);
    // console.log(this.state);
  }

  handleSubmit(event){
    event.preventDefault();
    // assemble for searching
    let user = LoginApi.isLogin(document);
    let searchObject = {
      startDate: this.state.startDate?new Date(this.state.startDate):this.state.startDate,
      endDate: this.state.endDate?new Date(this.state.endDate):this.state.endDate,
      people: this.state.people,
      upperId: this.state.upper,
      lowerId: this.state.lower,
      line13Id: this.state.line13,
      line25Id: this.state.line25,
      line46Id: this.state.line46,
      userId: user.role!="1" ? user.userid : ""
    };

    DatabaseApi.getReadings(searchObject).then((result)=>{
      // console.log("ReadingSearch: ", result.data);
      let readingComponentArray=[];
      result.data.map((element)=>{
        readingComponentArray.push(<BriefReading key={element._id} reading={element} />);
      });
      if(readingComponentArray.length===0) readingComponentArray=<div className="no_result text-center">No reading was found! :( </div>;
      this.setState({readings:readingComponentArray});
    });

  }

  render(){
      return(
        <div className="readingContainer">

          <div className="search-field-container">
            <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>

              {/*search date*/}
              <div className="search-date-container">
                <div>
                  <div className="form-check inlineBlock">
                    <label className="form-check-label dataLabel">
                      <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="singleDate" checked={this.state.isSigleDate} onChange={(event)=>{this.handleRadioChange(event);}} />
                       One specific date
                    </label>
                  </div>
                  <div className="form-check inlineBlock">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="rangeDate" checked={!this.state.isSigleDate} onChange={(event)=>{this.handleRadioChange(event);}} />
                       Between two dates
                    </label>
                  </div>
                </div>
                <div className="form-group row form-div">
                  <label htmlFor="startDate" className="col-sm-3 col-form-label">{this.state.isSigleDate?"Date":"Start date"}</label>
                  <div className={this.state.isSigleDate?"col-sm-9":"col-sm-3"}>
                    <input className={this.state.isStartDateCorrect?"form-control":"form-control form-control-warning"} type="text" placeholder="mm//dd/yyyy" id="startDate" value={this.state.startDate} onChange={(event)=>{this.handleInputChange(event, "startDate")}} />
                    {!this.state.isStartDateCorrect && <span className="glyphicon glyphicon-warning-sign form-control-feedback form-control-warning-span"></span>}
                  </div>
                  {!this.state.isSigleDate && <div className="col-sm-6 row"><label htmlFor="endDate" className="col-sm-5 col-form-label">End date</label>
                  <div className="col-sm-7">
                    <input className={this.state.isEndDateCorrect?"form-control":"form-control form-control-warning"} type="text" placeholder="mm/dd/yyyy" id="endDate" value={this.state.endDate} onChange={(event)=>{this.handleInputChange(event, "endDate")}} />
                    {!this.state.isEndDateCorrect && <span className="glyphicon glyphicon-warning-sign form-control-feedback form-control-warning-span"></span>}
                  </div></div>}
                </div>

                <div>Date format is <b>month/day/year</b> (Example: 06/30/2017)</div>

              </div>
              {/*search date end*/}
              {/*People*/}
              <div className="form-group row form-div">
                <label htmlFor="people" className="col-sm-2 col-form-label">People</label>
                <div className="col-sm-10">
                  <input className="form-control" type="text" placeholder="People..." id="people" value={this.state.people} onChange={(event)=>{this.handleInputChange(event, "people")}} />
                </div>
              </div>

              {/* Trigrams
                All list should be loaded from database when we can solve the limitation of api call. value should also be change to id
                */}
              <div className="form-group row form-div">
                <label htmlFor="upper" className="col-sm-3 col-form-label">Upper Trigrams</label>
                <div className="col-sm-3">
                  <select className="form-control" id="uppper" value={this.state.upper} onChange={(event)=>{this.handleInputChange(event, "upper")}}>
                    <option value="0">--</option>
                    <option value="595a8b17f271190858935906">Qian</option>
                    <option value="595a8b17f271190858935907">Zhen</option>
                    <option value="595a8b17f271190858935908">Kan</option>
                    <option value="595a8b17f271190858935909">Gen</option>
                    <option value="595a8b17f27119085893590a">Kun</option>
                    <option value="595a8b17f27119085893590b">Xun</option>
                    <option value="595a8b17f27119085893590c">Li</option>
                    <option value="595a8b17f27119085893590d">Dui</option>
                  </select>
                </div>
                <label htmlFor="lower" className="col-sm-3 col-form-label">Lower Trigrams</label>
                <div className="col-sm-3">
                  <select className="form-control" id="lower"  value={this.state.lower} onChange={(event)=>{this.handleInputChange(event, "lower")}}>
                    <option value="0">--</option>
                    <option value="595a91252d1ae608c4aa2935">Qian</option>
                    <option value="595a91252d1ae608c4aa2936">Zhen</option>
                    <option value="595a91252d1ae608c4aa2937">Kan</option>
                    <option value="595a91252d1ae608c4aa2938">Gen</option>
                    <option value="595a91252d1ae608c4aa2939">Kun</option>
                    <option value="595a91252d1ae608c4aa293a">Xun</option>
                    <option value="595a91252d1ae608c4aa293b">Li</option>
                    <option value="595a91252d1ae608c4aa293c">Dui</option>
                  </select>
                </div>
              </div>

              {/* Lines 1-3 Bigrams */}
              <div className="form-group row form-div">
                <label htmlFor="line13" className="col-sm-4 col-form-label">Lines 1-3 Bigrams</label>
                <div className="col-sm-8">
                  <select className="form-control" id="line13"  value={this.state.line13} onChange={(event)=>{this.handleInputChange(event, "line13")}}>
                    <option value="0">--</option>
                    <option value="595a99862e3b11095f090968">Emptying/Emerging</option>
                    <option value="595a99862e3b11095f090969">Doing/Producing</option>
                    <option value="595a99862e3b11095f09096a">Embodying/Attuning</option>
                    <option value="595a99862e3b11095f09096b">Shedding/Composting</option>
                  </select>
                </div>
              </div>

              {/* Lines 2-5 Bigrams */}
              <div className="form-group row form-div">
                <label htmlFor="line25" className="col-sm-4 col-form-label">Lines 2-5 Bigrams</label>
                <div className="col-sm-8">
                  <select className="form-control" id="line25" value={this.state.line25} onChange={(event)=>{this.handleInputChange(event, "line25")}}>
                    <option value="0">--</option>
                    <option value="595a9aff5e190009eac339d6">Conception/Potentiation-Manifestation and Possibility fused in pregnancy</option>
                    <option value="595a9aff5e190009eac339d7">Birth/Differentiation-Manifestation takes precedence</option>
                    <option value="595a9aff5e190009eac339d8">Maturation/Cultivation-Manifestation and Possibility exchanges information/energy</option>
                    <option value="595a9aff5e190009eac339d9">Integration/Returning to Source-Possibility takes precedence</option>
                  </select>
                </div>
              </div>

              {/* Lines 4-6 Bigrams */}
              <div className="form-group row form-div">
                <label htmlFor="line46" className="col-sm-4 col-form-label">Lines 4-6 Bigrams</label>
                <div className="col-sm-8">
                  <select className="form-control" id="line46" value={this.state.line46} onChange={(event)=>{this.handleInputChange(event, "line46")}}>
                    <option value="0">--</option>
                    <option value="595a9afa5e190009eac339d2">Emptying/Emerging</option>
                    <option value="595a9afa5e190009eac339d3">Doing/Producing</option>
                    <option value="595a9afa5e190009eac339d4">Embodying/Attuning</option>
                    <option value="595a9afa5e190009eac339d5">Shedding/Composting</option>
                  </select>
                </div>
              </div>

              {/* Search button */}
              <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton">Submit</button></div>

            </form>
          </div>

          {/* start to show result for reading*/}
          {this.state.readings}

        </div>
      );
    // }
  }

}
export default ReadingSearch;
