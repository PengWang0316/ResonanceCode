import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import BigramClockSmall from './BigramClockSmall';
// import BigramBlockSmall from './BigramBlockSmall';
import styles from '../styles/DetailedReading.module.css';
import Bigram from './Bigram';
import BigramExample from './BigramExample';

/** The component shows dtailed information for a reading. */
class DetailedReading extends Component {
  static propTypes = {
    hexagram: PropTypes.object.isRequired,
    handleHexagramClick: PropTypes.func.isRequired
  };
  state = { isShowExample: false };

  /**
   * When a user click the Bigram image, set the isShowExample state to the opposite value.
   * @param {object} event is an object that contains user event information.
   * @return {null} No return.
   */
  handleBigramClick = event => {
    event.stopPropagation();
    this.setState(state => ({ isShowExample: !state.isShowExample }));
  }

  /**
   * Render the jsx for the component.
   * @return {jsx} Return jsx.
   */
  render() {
    const { hexagram, handleHexagramClick } = this.props;
    /* Exchanging the order for line 46 and line 25 */
    // const newArray = [imageInfos[0], imageInfos[2], imageInfos[1]];
    return (
      <div className="mt-3">
        <div id={hexagram.img_arr} className={styles.detailButton} role="button" tabIndex="-1" onClick={handleHexagramClick}><i className="fas fa-book mr-2" />Show Detailed Hexagram</div>
        {/* Changed to use the Bigram component.
          <div className="d-flex">
            <BigramClockSmall lineText="Line 2/5" position={hexagram.line_25} />
            <BigramClockSmall lineText="Line 1/4" position={hexagram.line_14} />
            <BigramClockSmall lineText="Line 3/6" position={hexagram.line_36} />
          </div>
          <div className="d-flex mt-1 mb-4">
            <BigramBlockSmall lineText="Line 1/3" position={hexagram.line_13} />
            <BigramBlockSmall lineText="Line 4/6" position={hexagram.line_46} />
          </div>
          */}
        <div className="d-flex" role="button" tabIndex="-2" onClick={this.handleBigramClick} title="Click to check the explaination">
          <Bigram
            isSimple
            line25={hexagram.line_25}
            line46={hexagram.line_46}
            line13={hexagram.line_13}
          />
        </div>
        {this.state.isShowExample && <BigramExample />}
        <div className="mt-2 font-weight-bold">Overview:</div>
        <div>{hexagram.overview}</div>
        <div className="mt-2 font-weight-bold">Analysis:</div>
        <div>{hexagram.analysis}</div>
        <div className="mt-2 font-weight-bold">Question:</div>
        <div>{hexagram.question}</div>
        {/*
          <AssociatedHexagrams hexagram={hexagram} />
          */}
      </div>
    );
  }
}
export default DetailedReading;
