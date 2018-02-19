import React, { Component } from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';

import SharedJournalListModal from '../SharedJournalListModal';
import LoadingAnimation from '../SharedComponents/LoadingAnimation';
import BriefReading from '../BriefReading';
import Pagination from '../SharedComponents/Pagination';
import { checkAuthentication, savePushSubscription, turnOffPushSubscription } from '../../actions/UserActions';
import { fetchHexagrams, clearHexagrams } from '../../actions/HexagramActions';
import { fetchSharedReadings, fetchSharedReadingsAmount } from '../../actions/ReadingActions';
import UnauthenticatedUserCheck from '../SharedComponents/UnauthenticatedUserCheck';
import { NUMBER_OF_READING_PER_PAGE_RECENT_READINGS, JWT_MESSAGE, TOTAL_NUMBER_HEXAGRAM } from '../../config';
import subscriptNotification from '../../apis/PushNotificationUtil';
import AlertPanel from '../AlertPanel';
import HexagramDetailModal from '../HexagramDetailModal';
import HexagramListContainer from './HexagramListContainer';

/** The component that uses to show the shared readings. */
export class SharedReadingsContainer extends Component {
  /** Checking a user's anthentication status.
    * @param {object} props is an object that contains the vaules of props.
    * @return {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      currentReading: null,
      isPushNotification: props.user.settings ? props.user.settings.isPushNotification : false,
      alertPanel: '',
      hexagram: null
    };
    if (this.props.hexagrams.length !== TOTAL_NUMBER_HEXAGRAM) {
      this.props.clearHexagrams();
      this.props.fetchHexagrams();
    } else
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(this.props.hexagrams);
    if (!props.user.isAuth) props.checkAuthentication();
    else {
      props.fetchSharedReadingsAmount();
      props.fetchSharedReadings(0);
    }
  }

  /** Fetching the shared readings after a user passes the authentication check.
    * @param {object} nextProps is an object that contains the new props vaule.
    * @return {null} No return.
  */
  componentWillReceiveProps({ user, hexagrams }) {
    if (!this.props.user.isAuth && user.isAuth) {
      this.props.fetchSharedReadingsAmount();
      this.props.fetchSharedReadings(0);
      this.setState({ isPushNotification: user.settings.isPushNotification });
    }
    /* istanbul ignore next */
    if (this.props.hexagrams !== hexagrams &&
      hexagrams.length === TOTAL_NUMBER_HEXAGRAM && !this.hexagramsImgArrMap)
      this.hexagramsImgArrMap = HexagramListContainer.getHexagramImgArrMap(hexagrams);
  }

  /** Showing the shared journal list modal when a user click the open button.
    * @param {object} reading is an object that contains reading's and journal information.
    * @return {null} No return.
  */
  handleShowModalClickCallback = reading => {
    this.setState({ currentReading: reading });
    $('#sharedJournalListModal').modal('toggle'); // $ will use the jQuery from index.html.
  }

  /** Show the alert panel to a user in order to confrom the result of turning on push notification.
  After showing the alertPanel, set the alertPanel state to '' in order to hide the element from dom.
  If the permission did not grant, showing the alert panel longer in order to allow the user to read the message.
    * @param {boolen} isGranted is a indicator of whether the user granted the push notification permission.
    * @return {null} No return.
  */
  showPermissionResult({ isGranted, isTurnOn }) {
    const text = isGranted ? 'Saved Successfully!' : 'You blocked the notification permission! Please go to browser\'s setting reset the permission and try it again.';
    this.setState({
      isPushNotification: isTurnOn,
      alertPanel: (
        <AlertPanel id="savedAlert" type={isGranted ? 'success' : 'warning'} style={{ maxWidth: '250px' }}>
          {text}
        </AlertPanel>)
    }, () => {
      jQuery('#savedAlert').css({ opacity: 1 });
      if (this.savedTimeOut) clearTimeout(this.savedTimeOut);
      this.savedTimeOut = setTimeout(() => {
        if (isGranted) jQuery('#savedAlert').css({ opacity: 0 });
        if (this.setStateTimeOut) clearTimeout(this.setStateTimeOut);
        this.setStateTimeOut = setTimeout(() => this.setState({ alertPanel: '' }), isGranted ? 1000 : 4000);
      }, 2000);
    });
  }

  /**
   * Put all hexagram to an object and use id as the key.
   * @return {object} return an object with number key and hexagrams inside.
   */
  initailHexagramNumbersMap() {
    if (!this.hexagramNumbersMap) {
      this.hexagramNumbersMap = {};
      this.props.hexagrams.forEach(hexagram => {
        this.hexagramNumbersMap[hexagram.number] = hexagram;
      });
    }
  }

  /** Sending a message to serviceWorker in order to call the subscript method in the service worker.
  This method will not work in development enviroment due to the service worker will not be registered in the development mode.
    * @return {null} No return.
  */
  handleTurnOnNotification = () => {
    if (navigator.serviceWorker.controller)
      subscriptNotification()
        .then(_ => {
          // Show the saving successful alert panel and call the serviceworker's subscribeUser method.
          this.showPermissionResult({ isGranted: true, isTurnOn: true });
          // Create a Message Channel
          const messageChannel = new MessageChannel();

          /* Handler for recieving message reply from service worker
             When receive the pushSubscription, save it to the user's account.
          */
          messageChannel.port1.onmessage = event => {
            if (!event.data.error) this.props.savePushSubscription(JSON.parse(event.data));
          };
          navigator.serviceWorker.controller.postMessage({
            subscribeUser: {
              userId: this.props.user._id, jwtMessage: localStorage.getItem(JWT_MESSAGE)
            }
          }, [messageChannel.port2]);
        }).catch(err => this.showPermissionResult({ isGranted: false, isTurnOn: false }));
  };

  /** Turn a user's push notification.
    * @return {null} No return.
  */
  handleTurnOffNotification = () => {
    this.props.turnOffPushSubscription();
    this.showPermissionResult({ isGranted: true, isTurnOn: false });
  };

  /**
   * When a user clicks the show detail button, find the hexagram and show the modal.
   * @param {object} event comes from the element a user is clicking.
   * @return {null} No return.
   */
  handleHexagramClick = event => {
    event.stopPropagation();
    this.initailHexagramNumbersMap();
    this.setState({ hexagram: this.hexagramNumbersMap[event.target.id] });
    $('#hexagramDetailModal').modal('toggle'); // $ will use jQuery from the index.html
  };

  /**
   * When the user click a hexagram in the table, change the state.hexagram to that one.
   * @param {object} target is the hexagram number.
   * @return {null} No return.
   */
  handleAssociatedHexagramClick = ({ target }) => {
    this.initailHexagramNumbersMap();
    this.setState({ hexagram: HexagramListContainer.getHexagramBaseOnTarget(target, 'number', this.hexagramNumbersMap) });
  }

  /** Rendering the jsx for the component.
    * @return {jsx} Returning the jsx for the component.
  */
  render() {
    const { sharedReadings, isLoading, sharedReadingsAmount } = this.props;
    return (
      <UnauthenticatedUserCheck>
        <div>
          <div><h4>Other people are sharing these readings with you:</h4></div>
          <LoadingAnimation />
          {/* If the browser support both serviceWorker and PushManager,
              show the user push notification option. */}
          {'serviceWorker' in navigator && 'PushManager' in window &&
          <div className="text-right mt-5">
            <div className="h6 font-weight-bold">Sharing Notification</div>
            <div className="text-muted mb-2">
            Receiving a message when other users share a reading with you
            </div>
            <div className="btn-group" role="group" aria-label="Notification choose mode">
              <button type="button" className={this.state.isPushNotification ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleTurnOnNotification}>Turn on</button>
              <button type="button" className={!this.state.isPushNotification ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-outline-secondary'} onClick={this.handleTurnOffNotification}>Turn off</button>
            </div>
            {this.state.alertPanel}
          </div>
          }

          {sharedReadings.map(reading => (<BriefReading
            key={reading._id}
            reading={reading}
            deleteReadingCallback={this.handleDeleteCallback}
            isSharedReading
            handleShowModalClick={this.handleShowModalClickCallback}
            handleHexagramClick={this.handleHexagramClick}
          />))}

          {sharedReadings.length === 0 && !isLoading && <div className="rcTitle">No shared reading yet.</div>}

          {sharedReadingsAmount !== null && sharedReadings.length !== 0 &&
            <div className="mt-3 w-100 d-flex justify-content-end">
              <Pagination
                amount={sharedReadingsAmount}
                fetchContent={fetchSharedReadings}
                numberPerpage={NUMBER_OF_READING_PER_PAGE_RECENT_READINGS}
              />
            </div>}
        </div>
        <HexagramDetailModal
          hexagram={this.state.hexagram}
          handleHexagramClick={this.handleAssociatedHexagramClick}
          hexagramsImgArrMap={this.hexagramsImgArrMap}
        />
        {/* Shared journal list modal */}
        <SharedJournalListModal reading={this.state.currentReading} />
      </UnauthenticatedUserCheck>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  sharedReadings: state.sharedReadings,
  isLoading: state.isLoading,
  sharedReadingsAmount: state.sharedReadingsAmount,
  hexagrams: state.hexagrams
});
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  fetchSharedReadings: _ => dispatch(fetchSharedReadings()),
  fetchSharedReadingsAmount: _ => dispatch(fetchSharedReadingsAmount()),
  savePushSubscription: pushSubscription => dispatch(savePushSubscription(pushSubscription)),
  turnOffPushSubscription: _ => dispatch(turnOffPushSubscription()),
  fetchHexagrams: () => dispatch(fetchHexagrams({})),
  clearHexagrams: () => dispatch(clearHexagrams())
});
export default connect(mapStateToProps, mapDispatchToProps)(SharedReadingsContainer);
