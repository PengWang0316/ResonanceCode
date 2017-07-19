import React, {Component} from "react";
// import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import Loading from "./Loading";
import BriefReading from "./BriefReading";
import LoginApi from "../apis/LoginApi";
import QueryString from "query-string";
import { Link } from "react-router-dom";
import $ from "jQuery";
class Reading extends Component{

  componentWillMount(){
    this.isShowAddBtns = false; // An indicator of whether showing the add reading and add journal buttons
    // console.log(window.user);
    // if no user does not login, direct user back to login page
    let user=LoginApi.isLogin(document);
    if(!user){
      this.props.history.push("/");
    }else{
      this.username=user.username;
      this.userid=user.userid;
      this.role=user.role;
      // set states
      this.state={
        readings:""
      };
      // get the page number from url
      let pageInfos = QueryString.parse(this.props.location.search);
      // console.log("page:",pageInfos);
      this.startNumber=pageInfos.start?pageInfos.start:1;
      // this.endNumber=pageInfos.end?pageInfos.end:5;
      // recieve data from database

      let userId=this.role==1?null:this.userid;
      DatabaseApi.getRecentReadings(userId,this.startNumber).then((results)=>{
        // console.log("---Reading Page----",results.data);
        let readingComponentArray=[];
        results.data.map((element)=>{
          readingComponentArray.push(<BriefReading key={element._id} reading={element} />);
        });
        this.setState({readings:readingComponentArray});
      });
    }

  }

  handleAddBtnClick(){
    let opacity=this.isShowAddBtns?"0":"1";
    let readingBottom=this.isShowAddBtns?"25px":"85px";
    let journalBottom=this.isShowAddBtns?"25px":"145px";
    $("#addReadingBtn").css({"opacity":opacity, "bottom":readingBottom});
    $("#addJournalBtn").css({"opacity":opacity, "bottom":journalBottom});
    this.isShowAddBtns=!this.isShowAddBtns;
  }

  render(){
    return(
      <div key="key_reading" className="readingContainer">
        {!this.state || !this.state.readings?<Loading />:this.state.readings}

        {this.state && this.state.readings && <div className="pageBtnDiv text-right">
          {this.startNumber>1 && <Link className="btn btn-info loginButton pageBtn" to={{
            pathname: "/reading",
            search: `?start=${this.startNumber*1-5>1?this.startNumber*1-5:1}`
          }} ><i className="fa fa-backward" />Previous</Link>}
          <Link className="btn btn-info loginButton pageBtn" to={{
            pathname: "/reading",
            search: `?start=${this.startNumber*1+5}`
          }}>Next<i className="fa fa-forward" /></Link>
        </div>}

        {/*
        <Link to={{pathname:"/addreading"}}><div id="addBtn"><i className="fa fa-plus" /></div></Link>
        */}
        <div className="addBtnDiv" onClick={()=>{this.handleAddBtnClick();}}>
          <Link to={{pathname:"/addreading"}}><div id="addReadingBtn" className="addBtn addReadingBtn text-center">Reading</div></Link>
          <Link to={{pathname:"/addJournal"}}><div id="addJournalBtn" className="addBtn addJournalBtn text-center">Journal</div></Link>
          <div className="addBtn"><i className="fa fa-plus" /></div>
        </div>


      </div>
    );
  }

}
export default Reading;
