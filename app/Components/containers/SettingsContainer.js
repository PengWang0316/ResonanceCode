import React, { Component } from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';

// import styles from '../../styles/SettingsContainer.module.css';
import AlertPanel from '../AlertPanel';
import UserGroups from '../UserGroups';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { checkAuthentication, updateSettingCoinMode } from '../../actions/UserActions';

/** Setting component */
class SettingsContainer extends Component {
  /** Checking the user authentication if the user's authentication is still false.
    * @param {object} props is an object that contains the vaules of props.
    * @returns {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      coinMode: props.user.settings ? props.user.settings.coinMode : '',
      isShowAlert: false
    };
    if (!props.user.isAuth) this.props.checkAuthentication();
  }

  /** Setting the initial state when the component receives the user object.
    * @param {object} nextProps is an object that contains props information.
    * @returns {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user && nextProps.user.isAuth) {
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
    this.props.updateSettingCoinMode(coinMode);
    this.setState({ coinMode, isShowAlert: true }, () => {
      jQuery('#savedAlert').css({ opacity: 1 });
      if (this.savedTimeOut) clearTimeout(this.savedTimeOut);
      this.savedTimeOut = setTimeout(_ => {
        jQuery('#savedAlert').css({ opacity: 0 });
        if (this.cancleAlertTimeOut) clearTimeout(this.cancleAlertTimeOut);
        this.cancleAlertTimeOut = setTimeout(() => this.setState({ isShowAlert: false }), 1000);
      }, 2000);
    });
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
          <div className="font-weight-bold h5 mb-3">Default mode to record hexagram</div>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <div className="btn-group mr-4" role="group" aria-label="Hexagram choose mode">
              <button type="button" className={this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleCoinModeClick}>Coin Mode</button>
              <button type="button" className={!this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleHexagramModeClick}>Line Mode</button>
            </div>
            {this.state.isShowAlert &&
              <AlertPanel id="savedAlert" type="success" style={{ maxWidth: '250px' }}>
                Saved Successfully!
              </AlertPanel>}
          </div>
          {/* User groups component */}
          <div className="font-weight-bold h5 mt-5">Manage your user groups</div>
          <div className="text-muted mb-3"><small>You can share your readings with all group people after you setup your own group.</small></div>
          {this.props.user.settings &&
            <UserGroups userGroups={this.props.user.settings.userGroups} />}

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
