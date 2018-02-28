import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { ReadingsContainer } from '../../../app/Components/containers/ReadingsContainer';

jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/Pagination', () => 'Pagination');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');
jest.mock('../../../app/Components/BriefReading', () => 'BriefReading');
jest.mock('../../../app/Components/AddReadingJournalButton', () => 'AddReadingJournalButton');
jest.mock('../../../app/Components/containers/AddReadingContainer', () => 'AddReadingContainer');
jest.mock('../../../app/Components/DeleteReadingComformModal', () => 'DeleteReadingComformModal');
jest.mock('../../../app/Components/OutputPdfModal', () => 'OutputPdfModal');
jest.mock('../../../app/Components/HexagramDetailModal', () => 'HexagramDetailModal');

describe('ReadingsContainer test', () => {
  const defaultProps = {
    readings: [{ _id: 'readingId' }],
    isLoading: false,
    user: { isAuth: true },
    fetchRecentReadings: jest.fn(),
    checkAuthentication: jest.fn(),
    fetchReadingsAmount: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<ReadingsContainer {...props} />);

  test('componentWillMount user is not authorized', () => {
    const mockFetchReadingsAmountFn = jest.fn();
    const mockCheckAuthenticationFn = jest.fn();
    const mockFetchRecentReadingsFn = jest.fn();
    getShallowComponent({
      ...defaultProps,
      user: { isAuth: false },
      fetchReadingsAmount: mockFetchReadingsAmountFn,
      checkAuthentication: mockCheckAuthenticationFn,
      fetchRecentReadings: mockFetchRecentReadingsFn
    });
    expect(mockFetchReadingsAmountFn).toHaveBeenCalledTimes(1);
    expect(mockCheckAuthenticationFn).toHaveBeenCalledTimes(1);
    expect(mockFetchRecentReadingsFn).not.toHaveBeenCalled();
  });

  test('componentWillMount user is authorized', () => {
    const mockFetchReadingsAmountFn = jest.fn();
    const mockCheckAuthenticationFn = jest.fn();
    const mockFetchRecentReadingsFn = jest.fn();
    getShallowComponent({
      ...defaultProps,
      readings: [],
      fetchReadingsAmount: mockFetchReadingsAmountFn,
      checkAuthentication: mockCheckAuthenticationFn,
      fetchRecentReadings: mockFetchRecentReadingsFn
    });
    expect(mockFetchReadingsAmountFn).toHaveBeenCalledTimes(1);
    expect(mockCheckAuthenticationFn).not.toHaveBeenCalled();
    expect(mockFetchRecentReadingsFn).toHaveBeenLastCalledWith(0);
  });

  test('componentWillReceiveProps', () => {
    const mockFetchRecentReadingsFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      readings: [],
      user: { isAuth: false },
      fetchRecentReadings: mockFetchRecentReadingsFn
    });
    component.setProps({ user: { isAuth: true } });
    expect(mockFetchRecentReadingsFn).toHaveBeenLastCalledWith(0);
  });

  test('handleDeleteCallback', () => {
    const mockModalFn = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFn });
    const component = getShallowComponent();
    component.find('BriefReading').prop('deleteReadingCallback')({ readingId: 'readingIdA', readingName: 'readingNameA' });
    expect(component.instance().state.deleteReadingId).toBe('readingIdA');
    expect(component.instance().state.deleteReadingName).toBe('readingNameA');
    expect(window.$).toHaveBeenLastCalledWith('#deleteReadingConformModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
  });

  test('handleHexagramClick', () => {
    const mockStopPropagationFn = jest.fn();
    const mockModalFn = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFn });
    const component = getShallowComponent();
    component.find('BriefReading').prop('handleHexagramClick')({ stopPropagation: mockStopPropagationFn, target: { id: 'id' } });
    expect(mockStopPropagationFn).toHaveBeenCalledTimes(1);
    expect(component.instance().state.hexagramArr).toBe('id');
    expect(window.$).toHaveBeenLastCalledWith('#hexagramDetailModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
  });

  test('ReadingsContainer has readings snapshot', () => expect(renderer.create(<ReadingsContainer {...{ ...defaultProps, readingsAmount: 2 }} />).toJSON()).toMatchSnapshot());

  test('ReadingsContainer has not reading snapshot', () => expect(renderer.create(<ReadingsContainer {...{ ...defaultProps, readings: [] }} />).toJSON()).toMatchSnapshot());
});
