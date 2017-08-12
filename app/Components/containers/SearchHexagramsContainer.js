import React, { Component } from "react";
import Loading from "../Loading";
import SearchHexagramsForm from "../SearchHexagramsForm";
import HexagramImgTable from "../HexagramImgTable";
import BriefReading from "../BriefReading";
import { isLogin } from "../../apis/LoginApi";

import { connect } from "react-redux";
import { fetchReadingsBaseOnHexagram } from "../../actions/ReadingActions";
import { fetchHexagrams } from "../../actions/HexagramActions";

class SearchHexagramsContainer extends Component {

  componentWillMount(){
    // if no user does not login, direct user back to login page
    if(!isLogin(document)) this.props.history.push("/");
  }

  handleClickImgCallback(img_arr){
    let user = isLogin(document);
    let userId= user.role==1?null:user.userid;
    // console.log(img_arr, userId);
    this.props.fetchReadingsBaseOnHexagram(img_arr, userId);
  }

  render(){
    return (
      <div className="readingContainer">
        <Loading isLoading = {this.props.isLoading} />

        <SearchHexagramsForm handleSubmit = {searchCriterians => {this.props.fetchHexagrams(searchCriterians);}} />

        {/* Hexagram Imgs */}
        {this.props.hexagrams && this.props.hexagrams.length !== 0 && <HexagramImgTable hexagramsArray={this.props.hexagrams} onCallback={(img_arr)=>{this.handleClickImgCallback(img_arr);}} />}

        {/* Reading */}
        {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
        {/* no result message */}
        {this.props.extraMessage != "" && <div className="no_result text-center">{this.props.extraMessage}</div>}

      </div>
    );
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    isLoading: state.isLoading,
    hexagrams: state.hexagrams,
    readings: state.readings,
    extraMessage: state.extraMessage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchReadingsBaseOnHexagram: (imgArr, userId) => {dispatch(fetchReadingsBaseOnHexagram(imgArr, userId));},
    fetchHexagrams: searchCriterias => {dispatch(fetchHexagrams(searchCriterias));}
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchHexagramsContainer);
