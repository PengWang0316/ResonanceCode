import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DetialedReading from "./DetailedReading";
import api from "../apis/api";
import DatabaseApi from "../apis/DatabaseApi";
import Loading from "./Loading";
import ImageDescription from "./ImageDescription";
import $ from "jQuery";
import LoginApi from "../apis/LoginApi";
import Util from "../apis/Util";


class BriefReading extends Component{

  // constructor(props){
  //   super(props);
  //   this.props=props;
  // }
  // handle to get full information

  componentWillMount(){
    this.state = {
      isExpand:false, // whether the full information space has expanded.
      isFinishedLoading:false
    };
    const user = LoginApi.isLogin(document);
    this.userId = user.userid;
    this.userRole = user.role;
    this.reading = this.props.reading;
    this.img1 = this.reading.img1Info;
    this.img2 = this.reading.img2Info;
    this.id = this.reading._id;
    // console.log("8**********",this.reading);
    // this.readingId=`Reading${this.id}`;

    // getting jounal data


  /*  api.getJournalBasedOnReading(LoginApi.isLogin(document).userid,this.id).then((result)=>{
      console.log("getJournal:",result);
      let showJournalBtn=[];
      if(result.data){
        result.data.map((element)=>{
          showJournalBtn.push(<Link key={element.id} to={{pathname:"/showJournal",search:`?journalId=${element.id}`}}><i className="fa fa-address-book-o addJournal-icon" title={`Open journal ${element.date}`}  /></Link>);
        });
        this.setState({showJournalBtns: showJournalBtn});
    }
    // assemble array for showing journal buttons

  });*/

    // console.log("BriefReading page lines_1_3_bigrams:", this.img1.lines_1_3_bigrams);
  }

  handleDelete(){
    DatabaseApi.deleteReading(this.id,this.userId).then((result)=>{
      // console.log("Deleted!",result);
      $(`#${this.id}`).hide();
    });
  }

  getBigramsIdObject(){
    /*let bigramsIdArray=[{id:this.img1.line_13_id, line:1, img_num:1}, {id:this.img1.line_25_id,line:2, img_num:1},{id:this.img1.line_46_id,line:4, img_num:1}, {id:this.img2.line_13_id,line:1, img_num:2}, {id:this.img2.line_25_id,line:2, img_num:2}, {id:this.img2.line_46_id, line:4, img_num:2}];*/
    let bigramsIdArray={line_13_id_1:this.img1.line_13_id, line_25_id_1:this.img1.line_25_id,line_46_id_1:this.img1.line_46_id, line_13_id_2:this.img2.line_13_id, line_25_id_2:this.img2.line_25_id, line_46_id_2:this.img2.line_46_id};
    // console.log("bigramsIdArray:",bigramsIdArray);
    return bigramsIdArray;
  }

/*  parseTheResult(result){
    this.imageInformationObject={"1":[],"2":[]};

    result.map((element)=>{
      // if(element.img_num===1){}
      let imageInformation={data:element.data};

      if(element.line_name==1) imageInformation.title="Lines 1-3 Bigrams";
      else if(element.line_name==2) imageInformation.title="Lines 2-5 Bigrams";
      else imageInformation.title="Lines 4-6 Bigrams";

      this.imageInformationObject[element.img_num].push(imageInformation);
    });
  }
*/
  handleClick(){
    console.log(this.userRole);
    if(this.userRole < 3){
      if(!this.state.isExpand && !this.state.isFinishedLoading){
        // fetch date from three lines bigrams database
        // console.log("bigramsIdArray:",this.getBigramsIdObject());
        DatabaseApi.getLinesBigrams(this.getBigramsIdObject()).then((result)=>{
          // console.log("briefReading page:",result);
          this.imageInformationObject=result.data;
          // console.log("this.imageInformationObject",this.imageInformationObject);
          this.setState({
            isFinishedLoading: true
          });
        });

      }

      this.setState({
        isExpand: !this.state.isExpand
      });
    }
  }

  render(){
    // let reading=this.props.reading;
    // let img1=reading.img1Info;
    // let img2=reading.img2Info;
    return(

      <div id={this.id} className="briefReadingContainer">

          <div className="readingTitle">{this.reading.reading_name}{this.reading.user_id==this.userId && <i title="Delete this reading" className="fa fa-trash delete-icon" onClick={()=>{this.handleDelete();}} />}{this.reading.journal_entries && this.reading.journal_entries.length!==0 && <div className="inlineBlock text-right showJournalBtnsDiv"><Link  to={{pathname:"/journalList",search:`?readingId=${this.id}&readingName=${this.reading.reading_name}`}}><i className="fa fa-address-book-o addJournal-icon" title={`Open journal list`}  /></Link></div>}</div>

          <div className="dateContainer"  onClick={()=>{this.handleClick();}}><span><i className="fa fa-calendar"></i>{Util.getDateString(this.reading.date)}</span><span className="changeLine"><i className="fa fa-bell"></i>Change lines: {this.reading.change_lines_text}</span><span><i className="fa fa-users"></i>People: {this.reading.people}</span></div>


          <div className="row" onClick={()=>{this.handleClick();}}>
            {this.img1 && <div className="col-sm-6 briefImgC">
              <ImageDescription imageInfo={this.img1} imageNumber={this.reading.img1} isFirstImage={true}/>
              {this.state.isExpand && !this.state.isFinishedLoading && <Loading />}
              {this.state.isExpand && this.state.isFinishedLoading && <DetialedReading imageInfos={this.imageInformationObject["1"]} />}
            </div>}

            {this.img2 && <div className="col-sm-6 briefImgC">
              <ImageDescription imageInfo={this.img2} imageNumber={this.reading.img1} isFirstImage={false}/>
              {this.state.isExpand && !this.state.isFinishedLoading && <Loading />}
              {this.state.isExpand && this.state.isFinishedLoading && <DetialedReading imageInfos={this.imageInformationObject["2"]} />}
            </div>}

          </div>

      </div>

    );
  }

}

BriefReading.propTypes={
  reading: PropTypes.object.isRequired
};

export default BriefReading;
