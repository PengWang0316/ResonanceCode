import React, {Component} from "react";
import PropTypes from "prop-types";
import HexagramImage from "../HexagramImage";
import DatabaseApi from "../../apis/DatabaseApi";
import Loading from "../Loading";

class HexagramUpdateForm extends Component{

  componentWillMount(){
    this.initialStates(this.props);
    // console.log("will mount");
  }

  componentWillReceiveProps(nextProps){
    // console.log("mount");
    this.initialStates(nextProps);
    this.setState(this.state);
    // console.log("shouldComponentUpdate()");
    return true;
  }

  initialStates(props){
    let hexagram = props.hexagram;
    this.state={
      isWriting: false,
      imgArr: hexagram.img_arr?hexagram.img_arr:"",
      chineseName: hexagram.chinese_name?hexagram.chinese_name:"",
      imageText: hexagram.image_text?hexagram.image_text:"",
      wilhelmHuangHintleyName: hexagram.wilhelm_huang_hintley_name?hexagram.wilhelm_huang_hintley_name:"",
      rcDescription: hexagram.rc_description?hexagram.rc_description:"",
      question: hexagram.question?hexagram.question:""
    };
  }

  handleChange(event, inputName){
    let newObject = {};
    newObject[inputName]=event.target.value;
    this.setState(newObject);
  }

  handleSubmit(event){
    event.preventDefault();
    this.setState({isWriting: true});
    // assemble hexagram object
    let hexagramObject = {
      _id: this.props.hexagram._id,
      img_arr: this.state.imgArr,
      chinese_name: this.state.chineseName,
      image_text: this.state.imageText,
      wilhelm_huang_hintley_name: this.state.wilhelmHuangHintleyName,
      rc_description: this.state.rcDescription,
      question: this.state.question
    };
    DatabaseApi.updateHexagram(hexagramObject).then((result)=>{
      this.props.handleUpdateCallback();
    });
  }


  render(){
    return(
      <div className="coinPickUpBgDiv absolute_position">
        <div className="addReadingDiv white_background">
          {this.state.isWriting && <Loading text="Updating" />}
          <div><HexagramImage imageNumber={this.props.hexagram.img_arr} isFirstImage={true} isBlack={true}/><b> Hexagram #{this.props.hexagram.number}</b></div>
          <form className="form-horizontal" onSubmit={(event) => {this.handleSubmit(event);}}>

            <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting}>Update</button><button type="button" className="btn btn-default loginButton" disabled={this.state.isWriting} onClick={()=>{this.props.handleCancelCallback();}}>Cancel</button></div>

              <div className="form-group form-div">
                <label htmlFor="img_arr" className="col-form-label">Image Array</label>
                <div>
                  <input className="form-control" type="text" value={this.state.imgArr} placeholder="Image array..." id="img_arr" onChange={(event)=>{this.handleChange(event,"imgArr")}} />
                </div>
              </div>

              <div className="form-group form-div">
                <label htmlFor="chinese_name" className="col-form-label">Chinese Name</label>
                <div>
                  <input className="form-control" type="text" value={this.state.chineseName} placeholder="Chinese Name..." id="chinese_name" onChange={(event)=>{this.handleChange(event,"chineseName")}} />
                </div>
              </div>

              <div className="form-group form-div">
                <label htmlFor="image_text" className="col-form-label">Image Text</label>
                <div>
                  <input className="form-control" type="text" value={this.state.imageText} placeholder="Image Text..." id="image_text" onChange={(event)=>{this.handleChange(event,"imageText")}} />
                </div>
              </div>

              <div className="form-group form-div">
                <label htmlFor="wilhelm_huang_hintley_name" className="col-form-label">Wilhelm Huang Hintley Name</label>
                <div>
                  <input className="form-control" type="text" value={this.state.wilhelmHuangHintleyName} placeholder="Wilhelm Huang Hintley Name..." id="wilhelm_huang_hintley_name" onChange={(event)=>{this.handleChange(event,"wilhelmHuangHintleyName")}} />
                </div>
              </div>


              <div className="form-group form-div">
                <label htmlFor="rc_description" className="col-form-label">RC Description</label>
                <div>
                  <textarea className="form-control" rows="3" type="text" value={this.state.rcDescription} placeholder="RC Description..." id="rc_description" onChange={(event)=>{this.handleChange(event,"rcDescription");}} />
                </div>
              </div>

              <div className="form-group form-div">
                <label htmlFor="question" className="col-form-label">Question</label>
                <div>
                  <textarea className="form-control" rows="3" type="text" value={this.state.question} placeholder="Question..." id="question" onChange={(event)=>{this.handleChange(event,"question");}} />
                </div>
              </div>

            <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting}>Update</button><button type="button" className="btn btn-default loginButton" disabled={this.state.isWriting} onClick={()=>{this.props.handleCancelCallback();}}>Cancel</button></div>

          </form>
        </div>
      </div>
    );
  }


};
HexagramUpdateForm.proptypes={
  hexagram: PropTypes.object.isrequired,
  handleUpdateCallback: PropTypes.func.isrequired,
  handleCancelCallback: PropTypes.func.isrequired
};
export default HexagramUpdateForm;
