import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/ChooseHexagramLines.module.css';

const ChooseHexagramLines = ({
  handleCoinClick, lineNumber, handleCancel, handleSwitchMode
}) => {
  const handleClick = totalNum => {
    handleCoinClick(lineNumber, totalNum, '');
    handleCancel();
  };
  const handleChengingYangClick = _ => handleClick(9);
  const handleChengingYinClick = _ => handleClick(6);
  const handleChengingFixedYangClick = _ => handleClick(7);
  const handleChengingFixedYinClick = _ => handleClick(8);

  return (
    <div className={`${styles.coinPickUpBgDiv}`}>
      <div className={`${styles.coinPickUpWindowDiv}`}>

        <div className="row mb-2">
          <div className="col"><b>Line {(lineNumber * 1) + 1}</b></div>
          <div className="btn-group col" data-toggle="buttons">
            {/** Putting onClick event on lable because FireFox, Edge, and IE's radio
              * input element does not work appropriatly to fire the click event */}
            <label role="button" tabIndex="-1" className="btn btn-outline-secondary btn-sm" htmlFor="coinMode" onClick={handleSwitchMode}>
              <input type="radio" name="options" id="coinMode" /> Coin Mode
            </label>
            <label className="btn btn-secondary btn-sm active" htmlFor="HexagramMode">
              <input type="radio" name="options" id="HexagramMode" defaultChecked /> Line Mode
            </label>
          </div>
        </div>

        <div className="container">

          <div className="row text-center">
            <div className="col">
              <div>
                <div role="button" tabIndex="-3" onClick={handleChengingYangClick} className={`${styles.hexagramContainer}`}>
                  <div>Changing Yang</div>
                  <div>
                    <div className={`${styles.imgLineSideRed}`} /><div className={`${styles.imgLineMiddleRed}`} /><div className={`${styles.imgLineSideRed}`} />
                  </div>
                </div>
              </div>

              <div>
                <div role="button" tabIndex="-2" onClick={handleChengingYinClick} className={`${styles.hexagramContainer}`}>
                  <div>Changing Yin</div>
                  <div>
                    <div className={`${styles.imgLineSideRed}`} /><div className={`${styles.imgLineMiddleBlank}`} /><div className={`${styles.imgLineSideRed}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div>
                <div role="button" tabIndex="-1" onClick={handleChengingFixedYangClick} className={`${styles.hexagramContainer}`}>
                  <div>Fixed Yang</div>
                  <div>
                    <div className={`${styles.imgLineSide}`} /><div className={`${styles.imgLineMiddle}`} /><div className={`${styles.imgLineSide}`} />
                  </div>
                </div>
              </div>

              <div>
                <div role="button" tabIndex="0" onClick={handleChengingFixedYinClick} className={`${styles.hexagramContainer}`}>
                  <div>Fixed Yin</div>
                  <div>
                    <div className={`${styles.imgLineSide}`} /><div className={`${styles.imgLineMiddleBlank}`} /><div className={`${styles.imgLineSide}`} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="text-right"><button type="button" className="btn btn-info" onClick={handleCancel}>Cancel</button></div>

      </div>
    </div>
  );
};
ChooseHexagramLines.propTypes = {
  handleCoinClick: PropTypes.func.isRequired,
  lineNumber: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSwitchMode: PropTypes.func.isRequired
};
export default ChooseHexagramLines;
