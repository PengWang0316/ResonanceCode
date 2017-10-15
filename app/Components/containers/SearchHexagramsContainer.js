import React, { Component } from "react";
// import Loading from "../Loading";
import LoadingAnimation from "../SharedComponents/LoadingAnimation";
import SearchHexagramsForm from "../SearchHexagramsForm";
import HexagramImgTable from "../HexagramImgTable";
import BriefReading from "../BriefReading";
// import { isLogin } from "../../apis/LoginApi";

import { connect } from "react-redux";
import { checkAuthentication } from "../../actions/UserActions";
import UnauthenticatedUserCheck from "../SharedComponents/UnauthenticatedUserCheck";
import { fetchReadingsBaseOnHexagram, clearReadings } from "../../actions/ReadingActions";
import { fetchHexagrams } from "../../actions/HexagramActions";

class SearchHexagramsContainer extends Component {

  componentWillMount(){
    // if no user does not login, direct user back to login page
    // if(!isLogin(document)) this.props.history.push("/");
    if(!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearReadings();
  }

  handleClickImgCallback(img_arr){
    // let user = isLogin(document);
    // let userId= user.role==1?null:user.userid;
    // console.log(img_arr, userId);
    this.props.fetchReadingsBaseOnHexagram(img_arr);
  }

  render(){
    return (
      <UnauthenticatedUserCheck>
        <div className="readingContainer">

          <SearchHexagramsForm handleSubmit = {searchCriterians => {this.props.fetchHexagrams(searchCriterians);}} />

          <LoadingAnimation />

          {/* Hexagram Imgs */}
          {this.props.hexagrams && this.props.hexagrams.length !== 0 && <HexagramImgTable hexagramsArray={this.props.hexagrams} onCallback={(img_arr)=>{this.handleClickImgCallback(img_arr);}} />}

          {/* Reading */}
          {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
          {/* no result message */}
          {this.props.extraMessage != "" && <div className="no_result text-center">{this.props.extraMessage}</div>}

        </div>
      </UnauthenticatedUserCheck>
    );
  }

}
const mapStateToProps = state => ({
    isLoading: state.isLoading,
    hexagrams: state.hexagrams,
    readings: state.readings,
    extraMessage: state.extraMessage,
    user: state.user
});
const mapDispatchToProps = dispatch => ({
    fetchReadingsBaseOnHexagram: (imgArr, userId) => dispatch(fetchReadingsBaseOnHexagram(imgArr, userId)),
    fetchHexagrams: searchCriterias => dispatch(fetchHexagrams(searchCriterias)),
    checkAuthentication: _ => dispatch(checkAuthentication()),
    clearReadings: _ => dispatch(clearReadings())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchHexagramsContainer);
