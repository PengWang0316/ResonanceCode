import React, { Component } from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';
import PropTypes from 'prop-types';

import AlertPanel from '../AlertPanel';
import UserGroups from '../UserGroups';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { checkAuthentication, updateSettingCoinMode, saveCustomName } from '../../actions/UserActions';

/** Setting component */
export class SettingsContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    checkAuthentication: PropTypes.func.isRequired,
    updateSettingCoinMode: PropTypes.func.isRequired,
    saveCustomName: PropTypes.func.isRequired
  };
  /** Checking the user authentication if the user's authentication is still false.
    * @param {object} props is an object that contains the vaules of props.
    * @returns {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      coinMode: props.user.settings ? props.user.settings.coinMode : '',
      isShowAlert: false,
      customName: props.user.settings && props.user.settings.customName ?
        props.user.settings.customName : props.user.displayName,
      isNameChanged: false
    };
    this.oldName = props.user.settings && props.user.settings.customName ?
      props.user.settings.customName : props.user.displayName;
    if (!props.user.isAuth) this.props.checkAuthentication();
  }

  /** Setting the initial state when the component receives the user object.
    * @param {object} nextProps is an object that contains props information.
    * @returns {null} No return.
  */
  componentWillReceiveProps({ user }) {
    /* istanbul ignore next */
    if (this.props.user !== user && user.isAuth) {
      // this.hexagramCoinMode = nextProps.user.settings.coinMode;
      this.setState({
        coinMode: user.settings.coinMode,
        customName: user.settings && user.settings.customName ?
          user.settings.customName : user.displayName
      });
      this.oldName = user.settings && user.settings.customName ?
        user.settings.customName : user.displayName;
    }
  }

  /** Setting coinMode state for the component.
    * @param {boolean} coinMode indicate whether a user click the coin mode.
    * @returns {null} No return.
  */
  setCoinModeState(coinMode) {
    this.props.updateSettingCoinMode(coinMode);
    this.setState({ coinMode });
    this.showAlert();
  }

  /**
   * Show the Alert panel.
   * @return {null} No return.
   */
  showAlert() {
    this.setState({ isShowAlert: true }, () => {
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

  /** Handling input content changing.
    * @param {object} event is an object that repersents the element a user just clicked.
    * @return {null} No return.
  */
  handleInputChange = ({ target }) => this.setState({
    isNameChanged: !(target.value === '' || target.value === this.oldName || target.value.length > 20),
    [target.id]: target.value
  });

  /**
   * Call the action to save the name changing when a user click the save button.
   * @return {null} No return.
  */
  handleSaveNameBtnClick = () => {
    this.props.saveCustomName(this.state.customName);
    this.oldName = this.state.customName;
    this.setState({ isNameChanged: false });
    this.showAlert();
  };

  /** The render method for the component.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <UnauthenticatedUserCheck>
        <div className="container">
          {this.state.isShowAlert &&
          <AlertPanel id="savedAlert" type="success">
            Saved Successfully!
          </AlertPanel>}
          {/* User display name setting */}
          <div className="font-weight-bold h5 mb-2">Setup your display name</div>
          <div className="text-muted mb-3"><small>Other users can see it when you share readings to them. (No more than 20 characters.)</small></div>
          <div className="form-group row mb-5" style={{ maxWidth: '470px' }}>
            <label htmlFor="customName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="customName" placeholder="Display name..." value={this.state.customName} onChange={this.handleInputChange} />
            </div>
            <div className="col-sm-1 mt-1 text-right">
              <button type="button" className="btn btn-primary btn-sm" disabled={!this.state.isNameChanged} onClick={this.handleSaveNameBtnClick}>Save</button>
            </div>
          </div>
          {/* Hexagram picking mode */}
          <div className="font-weight-bold h5 mb-3">Default mode to record hexagram</div>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <div className="btn-group mr-4" role="group" aria-label="Hexagram choose mode">
              <button type="button" className={this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleCoinModeClick}>Coin Mode</button>
              <button type="button" className={!this.state.coinMode ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleHexagramModeClick}>Line Mode</button>
            </div>
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
/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.user
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  updateSettingCoinMode: coinMode => dispatch(updateSettingCoinMode(coinMode)),
  saveCustomName: customName => dispatch(saveCustomName(customName))
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
