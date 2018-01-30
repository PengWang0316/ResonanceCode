import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import HexagramImage from '../HexagramImage';
// import DatabaseApi from '../../apis/DatabaseApi';
// import Loading from '../Loading';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import { updateHexagram, clearHexagram } from '../../actions/HexagramActions';

/** The form for updating Hexagram */
class HexagramUpdateForm extends Component {
  /** Initializing state.
    * @returns {null} No return.
  */
  componentWillMount() {
    this.initialStates(this.props);
    // console.log("will mount");
  }

  /**  When receiving new props, using th hexagram object to initializing state for the component.
    * @param {object} nextProps is the object that contains new props objects.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    // console.log("mount");
    this.initialStates(nextProps);
    // this.setState(this.state);
    // console.log("shouldComponentUpdate()");
    return true;
  }
  /** Using th hexagram object to initializing state for the component.
    * @param {object} hexagram is the object for an indiviual hexagram.
    * @returns {null} No return.
  */
  initialStates({ hexagram }) {
    // const hexagram = props.hexagram;
    this.setState({
      isWriting: false,
      imgArr: hexagram.img_arr ? hexagram.img_arr : '',
      chineseName: hexagram.chinese_name ? hexagram.chinese_name : '',
      imageText: hexagram.image_text ? hexagram.image_text : '',
      wilhelmHuangHintleyName: hexagram.wilhelm_huang_hintley_name ? hexagram.wilhelm_huang_hintley_name : '',
      // rcDescription: hexagram.rc_description ? hexagram.rc_description : '',
      question: hexagram.question ? hexagram.question : '',
      particleBigramQuestion: hexagram.particle_bigram_question ? hexagram.particle_bigram_question : '',
      waveBigramQuestion: hexagram.wave_bigram_question ? hexagram.wave_bigram_question : '',
      resonanceBigramQuestion: hexagram.resonance_bigram_question ? hexagram.resonance_bigram_question : '',
      notes: hexagram.notes ? hexagram.notes : ''
    });
  }

  /** Setting the right value to state when a user types in an input element.
    * @param {object} target is a object that represent target input element.
    * @returns {null} No return.
  */
  handleChange = ({ target }) => this.setState({ [target.id]: target.value });

  /** Assembling the hexagram object and call the saving api.
    * @param {object} event is an object that comes from the form.
    * @returns {null} No return.
  */
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isWriting: true });
    // assemble hexagram object
    const hexagramObject = {
      _id: this.props.hexagram._id,
      img_arr: this.state.imgArr,
      chinese_name: this.state.chineseName,
      image_text: this.state.imageText,
      wilhelm_huang_hintley_name: this.state.wilhelmHuangHintleyName,
      // rc_description: this.state.rcDescription,
      question: this.state.question,
      particle_bigram_question: this.state.particleBigramQuestion,
      wave_bigram_question: this.state.waveBigramQuestion,
      resonance_bigram_question: this.state.resonanceBigramQuestion,
      notes: this.state.notes
    };
    this.props.updateHexagram(hexagramObject);
    this.props.clearHexagram();
    /* Deprecated old version.
    DatabaseApi.updateHexagram(hexagramObject).then((result) => {
      this.props.handleUpdateCallback();
    }); */
  };

  /** clearing Hexagram information when a user click cancel button.
    * @returns {null} No return.
  */
  handleCancel = () => this.props.clearHexagram();

  /** Rendering the jsx for the component.
    * @returns {jsx} Return jsx for the component.
  */
  render() {
    return (
      <div className="coinPickUpBgDiv absolute_position">
        <div className="addReadingDiv white_background">
          {this.state.isWriting && <LoadingAnimation />}
          <div>
            <HexagramImage imageNumber={this.props.hexagram.img_arr} isFirstImage isBlack />
            <b> Hexagram #{this.props.hexagram.number}</b>
          </div>
          <form className="form-horizontal" onSubmit={this.handleSubmit}>

            <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting}>Update</button><button type="button" className="btn btn-default loginButton" disabled={this.state.isWriting} onClick={this.handleCancel}>Cancel</button></div>

            <div className="form-group form-div">
              <label htmlFor="imgArr" className="col-form-label">Image Array</label>
              <div>
                <input className="form-control" type="text" value={this.state.imgArr} placeholder="Image array..." id="imgArr" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="chineseName" className="col-form-label">Chinese Name</label>
              <div>
                <input className="form-control" type="text" value={this.state.chineseName} placeholder="Chinese Name..." id="chineseName" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="imageText" className="col-form-label">Image Text</label>
              <div>
                <input className="form-control" type="text" value={this.state.imageText} placeholder="Image Text..." id="imageText" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="wilhelmHuangHintleyName" className="col-form-label">Wilhelm Huang Hintley Name</label>
              <div>
                <input className="form-control" type="text" value={this.state.wilhelmHuangHintleyName} placeholder="Wilhelm Huang Hintley Name..." id="wilhelmHuangHintleyName" onChange={this.handleChange} />
              </div>
            </div>


            <div className="form-group form-div">
              <label htmlFor="particleBigramQuestion" className="col-form-label">Particle Bigram Question</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.particleBigramQuestion} placeholder="Particle Bigram Question..." id="particleBigramQuestion" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="waveBigramQuestion" className="col-form-label">Wave Bigram Question</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.waveBigramQuestion} placeholder="Wave Bigram Question..." id="waveBigramQuestion" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="resonanceBigramQuestion" className="col-form-label">Resonance Bigram Question</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.resonanceBigramQuestion} placeholder="Resonance Bigram Question..." id="resonanceBigramQuestion" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="notes" className="col-form-label">Notes</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.notes} placeholder="Notes..." id="notes" onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-group form-div">
              <label htmlFor="question" className="col-form-label">Question</label>
              <div>
                <textarea className="form-control" rows="3" type="text" value={this.state.question} placeholder="Question..." id="question" onChange={this.handleChange} />
              </div>
            </div>

            <div className="text-right bottom-btn-div"><button type="submit" className="btn btn-info loginButton" disabled={this.state.isWriting}>Update</button><button type="button" className="btn btn-default loginButton" disabled={this.state.isWriting} onClick={() => { this.props.handleCancelCallback(); }}>Cancel</button></div>

          </form>
        </div>
      </div>
    );
  }
}
/*
HexagramUpdateForm.proptypes = {
  hexagram: PropTypes.object.isrequired,
  handleUpdateCallback: PropTypes.func.isrequired,
  handleCancelCallback: PropTypes.func.isrequired
}; */
const mapDispatchToProps = dispatch => ({
  updateHexagram: hexagram => dispatch(updateHexagram(hexagram)),
  clearHexagram: _ => dispatch(clearHexagram())
});
export default connect(null, mapDispatchToProps)(HexagramUpdateForm);
