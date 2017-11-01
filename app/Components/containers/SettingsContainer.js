import React, { Component } from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';

import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { checkAuthentication, updateSettingCoinMode } from '../../actions/UserActions';

/** Setting component */
class SettingsContainer extends Component {
  state = {
    // coinMode: 'btn btn-sm btn-secondary',
    // hexagramMode: 'btn btn-sm btn-outline-secondary'
    coinMode: ''
  };
  /** Checking the user authentication if the user's authentication is still false.
    * @returns {null} No return.
  */
  componentWillMount() {
    if (!this.props.user.isAuth) this.props.checkAuthentication();
  }

  /** Setting the initial state when the component receives the user object.
    * @param {object} nextProps is an object that contains props information.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.state.coinMode === '' && nextProps.user.isAuth) {
      // this.hexagramCoinMode = nextProps.user.settings.coinMode;
      this.setState({ coinMode: nextProps.user.settings.coinMode });
      // this.setCoinModeState();
    }
  }

  /** Setting coinMode state for the component.
    * @param {boolean} coinMode indicate whether a user click the coin mode.
    * @returns {null} No return.
  */
  setCoinModeState(coinMode) {
    this.setState({ coinMode });
    this.props.updateSettingCoinMode(coinMode);
    jQuery('#savedAlert').css({ opacity: 1 });
    if (this.savedTimeOut) clearTimeout(this.savedTimeOut);
    this.savedTimeOut = setTimeout(_ => jQuery('#savedAlert').css({ opacity: 0 }), 2000);
  }

  /** Changing the hexagram choose mode to coinMode.
    * @returns {null} No return.
  */
  handleCoinModeClick = () => {
    if (!this.state.coinMode) this.setCoinModeState(true);
  }

  /** Changing the hexagram choose mode to hexagramMode.
    * @returns {null} No return.
  */
  handleHexagramModeClick = () => {
    if (this.state.coinMode) this.setCoinModeState(false);
  }

  /** The render method for the component.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className="container">
          <div className="font-weight-bold mb-4"><h5>Default mode to record hexagram</h5></div>

          <div className="btn-group" role="group" aria-label="Hexagram choose mode">
            <button type="button" className={this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleCoinModeClick}>Coin Mode</button>
            <button type="button" className={!this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleHexagramModeClick}>Line Mode</button>
          </div>

          <div id="savedAlert" className="alert alert-success saved-alert mt-3" role="alert">
            Saved Successfully!
          </div>

        </div>
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  updateSettingCoinMode: coinMode => dispatch(updateSettingCoinMode(coinMode))
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
