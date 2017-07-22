import React, { Component } from "react";
import LoginApi from "../../apis/LoginApi";
// import api from "../../apis/api";
import DatabaseApi from "../../apis/DatabaseApi";
import HexagramImgTable from "../HexagramImgTable";
import BriefReading from "../BriefReading";

class HexagramsSearch extends Component{

  componentWillMount(){
    // if no user does not login, direct user back to login page
    if(!LoginApi.isLogin(document)) this.props.history.push("/");
    this.state={
      upper: 0,
      lower: 0,
      line13: 0,
      line25: 0,
      line46:0,
      readingResult: null,
      hexagrams: null,
      readings: null
    };
    // this.setState(this.state);
  }

  handleInputChange(event, inputName){
    this.setState({[inputName]: event.target.value});
    // console.log(this.state);
  }


  handleSubmit(event){
    event.preventDefault();
    // assemble for searching

      let searchObject = {
        upperId: this.state.upper,
        lowerId: this.state.lower,
        line13Id: this.state.line13,
        line25Id: this.state.line25,
        line46Id: this.state.line46
      };
      let hexagramsArray=[];
      // console.log("searchObject:", searchObject); 
      DatabaseApi.getHexagrams(searchObject).then((result)=>{
        // console.log(result.data);
        this.setState({hexagrams:result.data, readings:null});
      });

  }

  handleClickImgCallback(img_arr){
    // console.log("handleClickImgCallback img_arr:",img_arr);
    let user = LoginApi.isLogin(document);
    let userId= user.role==1?null:user.userid;
    DatabaseApi.getReadingsBasedOnHexagram(img_arr, userId).then((result)=>{
      // console.log("getReadingsBasedOnHexagram", result);
      let readingComponentArray=[];
      result.data.map((element)=>{
        readingComponentArray.push(<BriefReading key={element._id} reading={element} />);
      });
      if(readingComponentArray.length===0) readingComponentArray=<div className="no_result text-center">No reading was found! :( </div>;
      this.setState({
        hexagrams: null,
        readings: readingComponentArray
      });
    });

    // this.setState({
    //   hexagrams: null
    // });
  }


  render(){
    return (
      <div className="readingContainer">

        <div className="search-field-container">
          <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>


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

        {/* Hexagram Imgs */}
        {this.state.hexagrams && <HexagramImgTable hexagramsArray={this.state.hexagrams} onCallback={(img_arr)=>{this.handleClickImgCallback(img_arr);}} />}

        {/* Reading */}
        {this.state.readings}

      </div>
    );
  }

}
export default HexagramsSearch;
