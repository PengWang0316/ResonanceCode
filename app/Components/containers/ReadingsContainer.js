import React, { Component } from "react";
import { connect } from "react-redux";
import QueryString from "query-string";
import { fetchRecentReadings } from "../../actions/ReadingActions";
// import { isLogin } from "../../actions/LoginActions";

import Loading from "../Loading";
import BriefReading from "../BriefReading";
import AddReadingJournalButton from "../AddReadingJournalButton";
import PageNavigationButton from "../PageNavigationButton";

import LoginApi from "../../apis/LoginApi";
// import DatabaseApi from "../../apis/DatabaseApi";

class ReadingsContainer extends Component{

  componentWillMount(){
    let user=LoginApi.isLogin(document);
    // let user = this.props.user;
    // console.log("user: ", user);
    this.startNumber = "1";
    if(!user){
      this.props.history.push("/");
    }else{
      // get the page number from url
      let pageInfos = QueryString.parse(this.props.location.search);
      if (pageInfos.start) this.startNumber = pageInfos.start;
      // this.startNumber=pageInfos.start ? pageInfos.start : "1";
      this.props.fetchRecentReadings(user.role == 1 ? null : user.userid, this.startNumber);
    }

  }

  render(){

    return(
      <div key="key_reading" className="readingContainer">
        <Loading isLoading={this.props.isLoading} />

        {this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}

        {this.props.readings.length===0 && !this.props.isLoading && <div className="rcTitle">There is no reading yet. Please add your reading.</div>}

        <PageNavigationButton isEmptyContent={this.props.readings.length===0 ? true : false} startNumber={this.startNumber} />

        <AddReadingJournalButton />

      </div>
    );

  }

}
const mapStateToProps = (state, ownProps) => {return {
  readings: state.readings,
  isLoading: state.isLoading
}};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchRecentReadings: (userId, startNumber) => {dispatch(fetchRecentReadings(userId, startNumber));}
  };
};
// const Readings = connect(mapStateToProps, mapDispatchToProps)(Readings);

export default connect(mapStateToProps, mapDispatchToProps)(ReadingsContainer);
