import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SharedReadingsContainer } from '../../../app/Components/containers/SharedReadingsContainer';

jest.mock('../../../app/Components/AlertPanel', () => 'AlertPanel');
jest.mock('../../../app/Components/BriefReading', () => 'BriefReading');
jest.mock('../../../app/Components/HexagramDetailModal', () => 'HexagramDetailModal');
jest.mock('../../../app/Components/SharedJournalListModal', () => 'SharedJournalListModal');
jest.mock('../../../app/Components/SharedComponents/Pagination', () => 'Pagination');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');

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

  // test('SharedReadingsContainer snapshot', () => expect(renderer.create(<SharedReadingsContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
