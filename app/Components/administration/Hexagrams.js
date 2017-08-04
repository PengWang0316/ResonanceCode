import React, { Component } from "react";
import DatabaseApi from "../../apis/DatabaseApi";
import HexagramImgTable from "../HexagramImgTable";
import HexagramUpdateForm from "./HexagramUpdateForm";
import LoginApi from "../../apis/LoginApi";

class Hexagrams extends Component {

  componentWillMount(){
    this.state={
      hexagrams:null,
      hexagram:null
    };
    // if no user does not login, direct user back to login page
    let user = LoginApi.isLogin(document);
    if(!user || user.role!=1 ) this.props.history.push("/");
    else {
      this.state={
        hexagrams:null,
        hexagram:null
      };
      DatabaseApi.getHexagrams({}).then((result)=>{
        // console.log(result.data);
        this.setState({hexagrams:result.data});
      });
    }
  }

  handleClickImgCallback(img_arr){
    // console.log("HexagramUpdateForm", img_arr);
    DatabaseApi.getHexagramBasedOnImg(img_arr).then((result)=>{
      // console.log("getHexagramBasedOnImg",result.data);
      this.setState({hexagram:result.data});
    });
  }

  handleHexagramUpdateCallback(){
    this.setState({hexagram:null});
  }

  handleHexagramFormCancelCallback(){
    this.setState({hexagram:null});
  }

  render(){
    return(
      <div>
        {/* Hexagram Imgs */}
        {this.state.hexagrams && <HexagramImgTable hexagramsArray={this.state.hexagrams} onCallback={(img_arr)=>{this.handleClickImgCallback(img_arr);}} />}

        {/* Update form */}
        {this.state.hexagram && <HexagramUpdateForm handleCancelCallback={()=>{this.handleHexagramFormCancelCallback();}} handleUpdateCallback={()=>{this.handleHexagramUpdateCallback();}} hexagram={this.state.hexagram} />}
      </div>
    );
  }


}
export default Hexagrams;
