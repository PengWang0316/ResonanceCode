import React, { Component } from "react";
import SearchReadingsForm from "../SearchReadingsForm";
import BriefReading from "../BriefReading";
import Loading from "../Loading";
import { isLogin } from "../../apis/LoginApi";

// import { getReadings } from "../../apis/DatabaseApi";

import { connect } from "react-redux";
import { fetchReadings } from "../../actions/ReadingActions";

class SearchReadingsContainer extends Component {

  componentWillMount(){
    if(!isLogin(document)) this.props.history.push("/");
  }

  handleSubmitCallback(searchCriterias){
    // assemble for searching
    let user = isLogin(document);
    let searchObject = {
      startDate: searchCriterias.startDate?new Date(searchCriterias.startDate):searchCriterias.startDate,
      endDate: searchCriterias.endDate?new Date(searchCriterias.endDate):searchCriterias.endDate,
      people: searchCriterias.people,
      upperId: searchCriterias.upper,
      lowerId: searchCriterias.lower,
      line13Id: searchCriterias.line13,
      line25Id: searchCriterias.line25,
      line46Id: searchCriterias.line46,
      userId: user.role!="1" ? user.userid : ""
    };
    this.props.fetchReadings(searchObject);
  }

  render(){
    return (
      <div className="readingContainer">
        <Loading isLoading = {this.props.isLoading} />
        <SearchReadingsForm handleSubmit = {(searchCriterias) => {this.handleSubmitCallback(searchCriterias);}} />
        {/* start to show result for reading */}
        {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
        {/* no result message */}
        {this.props.extraMessage != "" && <div className="no_result text-center">{this.props.extraMessage}</div>}
      </div>
    );
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    readings: state.readings,
    extraMessage: state.extraMessage,
    isLoading: state.isLoading
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {fetchReadings: (searchCriterias) => {dispatch(fetchReadings(searchCriterias));}};
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchReadingsContainer);
