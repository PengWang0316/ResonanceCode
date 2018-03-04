import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SharedReadingsContainer } from '../../../app/Components/containers/SharedReadingsContainer';
import AlertPanel from '../../../app/Components/AlertPanel';

jest.mock('../../../app/Components/AlertPanel', () => 'AlertPanel');
jest.mock('../../../app/Components/BriefReading', () => 'BriefReading');
jest.mock('../../../app/Components/HexagramDetailModal', () => 'HexagramDetailModal');
jest.mock('../../../app/Components/SharedJournalListModal', () => 'SharedJournalListModal');
jest.mock('../../../app/Components/SharedComponents/Pagination', () => 'Pagination');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');

jest.mock('jquery', () => jest.fn());
// jest.mock('MessageChannel', () => jest.fn().mockReturnValue({ port1: {}, port2: {} }));
jest.mock('../../../app/apis/PushNotificationUtil', () => () => new Promise(resolve => resolve()));

describe('SharedReadingsContainer test', () => {
  const defaultProps = {
    user: { isAuth: true },
    sharedReadings: [{ _id: 'shareReadingIdA' }],
    isLoading: false,
    checkAuthentication: jest.fn(),
    fetchSharedReadings: jest.fn(),
    fetchSharedReadingsAmount: jest.fn(),
    savePushSubscription: jest.fn(),
    turnOffPushSubscription: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SharedReadingsContainer {...props} />);

  test('constructor the user is authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockFetchSharedReadingsAmountFn = jest.fn();
    const mockFetchSharedReadingsFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      checkAuthentication: mockCheckAuthenticationFn,
      fetchSharedReadings: mockFetchSharedReadingsFn,
      fetchSharedReadingsAmount: mockFetchSharedReadingsAmountFn
    });
    const {
      currentReading, isPushNotification, alertPanel, hexagramArr
    } = component.instance().state;
    expect(currentReading).toBeNull();
    expect(isPushNotification).toBe(false);
    expect(alertPanel).toBe('');
    expect(hexagramArr).toBe('');
    expect(mockCheckAuthenticationFn).not.toHaveBeenCalled();
    expect(mockFetchSharedReadingsFn).toHaveBeenLastCalledWith(0);
    expect(mockFetchSharedReadingsAmountFn).toHaveBeenCalledTimes(1);
  });

  test('constructor the user is not authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockFetchSharedReadingsAmountFn = jest.fn();
    const mockFetchSharedReadingsFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      user: { isAuth: false, settings: { isPushNotification: true } },
      checkAuthentication: mockCheckAuthenticationFn,
      fetchSharedReadings: mockFetchSharedReadingsFn,
      fetchSharedReadingsAmount: mockFetchSharedReadingsAmountFn
    });
    const {
      currentReading, isPushNotification, alertPanel, hexagramArr
    } = component.instance().state;
    expect(currentReading).toBeNull();
    expect(isPushNotification).toBe(true);
    expect(alertPanel).toBe('');
    expect(hexagramArr).toBe('');
    expect(mockCheckAuthenticationFn).toHaveBeenCalledTimes(1);
    expect(mockFetchSharedReadingsFn).not.toHaveBeenCalled();
    expect(mockFetchSharedReadingsAmountFn).not.toHaveBeenCalled();
  });

  test('componentWillReceiveProps', () => {
    const mockFetchSharedReadingsAmountFn = jest.fn();
    const mockFetchSharedReadingsFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      user: { isAuth: false },
      fetchSharedReadings: mockFetchSharedReadingsFn,
      fetchSharedReadingsAmount: mockFetchSharedReadingsAmountFn
    });
    component.setProps({ user: { isAuth: true, settings: { isPushNotification: true } } });
    expect(mockFetchSharedReadingsFn).toHaveBeenLastCalledWith(0);
    expect(mockFetchSharedReadingsAmountFn).toHaveBeenCalledTimes(1);
    expect(component.instance().state.isPushNotification).toBe(true);
  });

  test('handleShowModalClickCallback', () => {
    const mockModalFn = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFn });
    const component = getShallowComponent();
    const reading = { id: 1 };
    component.find('BriefReading').prop('handleShowModalClick')(reading);
    expect(component.instance().state.currentReading).toBe(reading);
    expect(window.$).toHaveBeenLastCalledWith('#sharedJournalListModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
  });

  test('showPermissionResult not granted not turnOn', () => {
    jest.useFakeTimers();
    const jQuery = require('jquery');
    const mockCssFn = jest.fn();
    jQuery.mockReturnValue({ css: mockCssFn });
    const component = getShallowComponent();
    component.instance().savedTimeOut = 1;
    component.instance().setStateTimeOut = 2;
    component.instance().showPermissionResult({ isGranted: false, isTurnOn: false });
    expect(component.instance().state.isPushNotification).toBe(false);
    expect(component.instance().state.alertPanel)
      .toEqual(<AlertPanel id="savedAlert" type="warning" style={{ maxWidth: '250px' }}>
          You blocked the notification permission! Please go to browser's
          setting reset the permission and try it again.
               </AlertPanel>);
    expect(jQuery).toHaveBeenLastCalledWith('#savedAlert');
    expect(mockCssFn).toHaveBeenLastCalledWith({ opacity: 1 });
    expect(clearTimeout).toHaveBeenLastCalledWith(1);
    jest.runAllTimers();
    expect(jQuery).toHaveBeenCalledTimes(1);
    expect(mockCssFn).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenLastCalledWith(2);
    expect(component.instance().state.alertPanel).toBe('');
  });

  test('showPermissionResult has granted and turnOn', () => {
    jest.useFakeTimers();
    const jQuery = require('jquery');
    const mockCssFn = jest.fn();
    jQuery.mockReturnValue({ css: mockCssFn });
    const component = getShallowComponent();
    // component.instance().savedTimeOut = 1;
    // component.instance().setStateTimeOut = 2;
    component.instance().showPermissionResult({ isGranted: true, isTurnOn: true });
    expect(component.instance().state.isPushNotification).toBe(true);
    expect(component.instance().state.alertPanel)
      .toEqual(<AlertPanel id="savedAlert" type="success" style={{ maxWidth: '250px' }}>
          Saved Successfully!
               </AlertPanel>);
    expect(jQuery).toHaveBeenLastCalledWith('#savedAlert');
    expect(mockCssFn).toHaveBeenLastCalledWith({ opacity: 1 });
    expect(clearTimeout).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(jQuery).toHaveBeenCalledTimes(3);
    expect(mockCssFn).toHaveBeenLastCalledWith({ opacity: 0 });
    expect(clearTimeout).not.toHaveBeenCalled();
    expect(component.instance().state.alertPanel).toBe('');
  });

  // In the test enviroment, the service worker does not exsit and MessageChannel object will throw an Error. Have to find a way to stub the MessageChannel Object.
  test('handleTurnOnNotification', () => {
    const mockShowPermissionResultFn = jest.fn();
    const component = getShallowComponent();
    component.instance().showPermissionResult = mockShowPermissionResultFn;
    window.navigator.serviceWorker = { controller: true, MessageChannel: jest.fn() };
    component.instance().handleTurnOnNotification();
    // expect(mockShowPermissionResultFn)
    //   .toHaveBeenLastCalledWith({ isGranted: true, isTurnOn: true });
  });

  test('handleTurnOffNotification', () => {
    const mockShowPermissionResultFn = jest.fn();
    const component = getShallowComponent();
    component.instance().showPermissionResult = mockShowPermissionResultFn;
    component.instance().handleTurnOffNotification();
    expect(defaultProps.turnOffPushSubscription).toHaveBeenCalledTimes(1);
    expect(mockShowPermissionResultFn)
      .toHaveBeenLastCalledWith({ isGranted: true, isTurnOn: false });
  });

  test('handleHexagramClick', () => {
    const mockModalFn = jest.fn();
    const mockStopPropagation = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFn });
    const component = getShallowComponent();
    component.instance().handleHexagramClick({ stopPropagation: mockStopPropagation, target: { id: 'id' } });
    expect(mockStopPropagation).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith('#hexagramDetailModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
    expect(component.instance().state.hexagramArr).toBe('id');
  });

  test('SharedReadingsContainer without push notification support snapshot', () => expect(renderer.create(<SharedReadingsContainer {...{ ...defaultProps, sharedReadingsAmount: 2 }} />).toJSON()).toMatchSnapshot());

  test('SharedReadingsContainer no shared reading snapshot', () => expect(renderer.create(<SharedReadingsContainer {...{ ...defaultProps, sharedReadings: [], isLoading: false }} />).toJSON()).toMatchSnapshot());

  test('SharedReadingsContainer with push notification support isPushNotification snapshot', () => {
    window.PushManager = {};
    window.navigator.serviceWorker = {};
    expect(renderer.create(<SharedReadingsContainer
      {...{
        ...defaultProps,
        sharedReadingsAmount: 2,
        user: { settings: { isPushNotification: true } }
      }}
    />).toJSON()).toMatchSnapshot();
  });

  test('SharedReadingsContainer with push notification support not isPushNotification snapshot', () => {
    window.PushManager = {};
    window.navigator.serviceWorker = {};
    expect(renderer.create(<SharedReadingsContainer
      {...{
        ...defaultProps,
        sharedReadingsAmount: 2,
        user: { settings: { isPushNotification: false } }
      }}
    />).toJSON()).toMatchSnapshot();
  });
});
