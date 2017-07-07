import React, {Component} from "react";
// import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import Loading from "./Loading";
import BriefReading from "./BriefReading";
import LoginApi from "../apis/LoginApi";
import QueryString from "query-string";
import { Link } from "react-router-dom";

class Reading extends Component{

  componentWillMount(){
    // console.log(window.user);
    // if no user does not login, direct user back to login page
    let user=LoginApi.isLogin(document);
    // console.log("reading page",user);
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
      console.log("page:",pageInfos);
      this.startNumber=pageInfos.start?pageInfos.start:1;
      // this.endNumber=pageInfos.end?pageInfos.end:5;
      // recieve data from database

      let userId=this.role==1?null:this.userid;
      DatabaseApi.getRecentReadings(userId,this.startNumber).then((results)=>{
        console.log("---Reading Page----",results.data);
        let readingComponentArray=[];
        results.data.map((element)=>{
          readingComponentArray.push(<BriefReading key={element._id} reading={element} />);
        });
        this.setState({readings:readingComponentArray});
      });
    }

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


        <Link to={{pathname:"/addreading"}}><div id="addBtn"><i className="fa fa-plus" /></div></Link>
      </div>
    );
  }

}
export default Reading;
