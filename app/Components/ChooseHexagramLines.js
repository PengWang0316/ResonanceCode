import React from 'react';

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
    <div className="coinPickUpBgDiv">
      <div className="coinPickUpWindowDiv">

        <div className="row mb-2">
          <div className="col"><b>Line {(lineNumber * 1) + 1}</b></div>
          <div className="btn-group col" data-toggle="buttons">
            {/** Putting onClick event on lable because FireFox, Edge, and IE's radio
              * input element does not work appropriatly to fire the click event */}
            <label role="button" tabIndex="-1" className="btn btn-outline-secondary btn-sm" htmlFor="coinMode" onClick={handleSwitchMode}>
              <input type="radio" name="options" id="coinMode" /> Coin Mode
            </label>
            <label className="btn btn-secondary btn-sm active" htmlFor="HexagramMode">
              <input type="radio" name="options" id="HexagramMode" defaultChecked /> Hexagram Mode
            </label>
          </div>
        </div>

        <div className="container">

          <div className="row text-center">
            <div className="col">
              <div>
                <div role="button" tabIndex="-3" onClick={handleChengingYangClick} className="hexagram-container">
                  <div>Chenging Yang</div>
                  <div>
                    <div className="img-line-side-red" /><div className="img-line-middle-red" /><div className="img-line-side-red" />
                  </div>
                </div>
              </div>

              <div>
                <div role="button" tabIndex="-2" onClick={handleChengingYinClick} className="hexagram-container">
                  <div>Chenging Yin</div>
                  <div>
                    <div className="img-line-side-red" /><div className="img-line-middle-blank" /><div className="img-line-side-red" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div>
                <div role="button" tabIndex="-1" onClick={handleChengingFixedYangClick} className="hexagram-container">
                  <div>Chenging Fiexed Yang</div>
                  <div>
                    <div className="img-line-side" /><div className="img-line-middle" /><div className="img-line-side" />
                  </div>
                </div>
              </div>

              <div>
                <div role="button" tabIndex="0" onClick={handleChengingFixedYinClick} className="hexagram-container">
                  <div>Chenging Fixed Yin</div>
                  <div>
                    <div className="img-line-side" /><div className="img-line-middle-blank" /><div className="img-line-side" />
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
export default ChooseHexagramLines;
