import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { ReadingSearchAndList } from '../../app/Components/ReadingSearchAndList';

jest.mock('../../app/Components/ReadingSearchResult', () => 'ReadingSearchResult');
jest.mock('../../app/Components/ReadingSearchItem', () => 'ReadingSearchItem');
jest.mock('../../app/Components/AllReadingList', () => 'AllReadingList');

describe('ReadingSearchAndList test', () => {
  const defaultProps = {
    existReadings: { readingIdA: {} },
    pingPongStates: { readingIdA: 'pingPongStateA' },
    searchReadings: [{ _id: 'readingA', reading_name: 'readingNameA' }],
    allReadingList: [],
    // readingsAmount: PropTypes.number,
    attachReadingCallback: jest.fn(),
    detachReadingCallback: jest.fn(),
    handlePingpongstateChangeCallback: jest.fn(),
    fetchReadingBasedOnName: jest.fn(),
    fetchAllReadingList: jest.fn(),
    fetchReadingsAmount: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<ReadingSearchAndList {...props} />);

  test('ReadingSearchAndList snapshot', () => expect(renderer.create(<ReadingSearchAndList {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('initial state and functions were called', () => {
    const mockFunc = jest.fn();
    const component = getShallowComponent({ ...defaultProps, fetchReadingsAmount: mockFunc });
    expect(component.state('searchReading')).toBe('');
    expect(component.state('readingArray').length).toBe(1);
    expect(component.state('searchResults')).toEqual([]);
    const {
      readingIndexTracker, readingIndex, searchFunction, pingPongStates
    } = component.instance();
    expect(Object.keys(readingIndexTracker).length).toBe(1);
    expect(readingIndex).toBe(1);
    expect(searchFunction).toBeNull();
    expect(pingPongStates).toBe(component.instance().props.pingPongStates);
    expect(defaultProps.handlePingpongstateChangeCallback).toHaveBeenLastCalledWith('readingIdA', 'pingPongStateA');
    expect(defaultProps.attachReadingCallback).toHaveBeenLastCalledWith('readingIdA');
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    expect(component.find('ReadingSearchResult').length).toBe(0);
    component.setProps({
      searchReadings: [
        ...defaultProps.searchReadings,
        { _id: 'readingB', reading_name: 'readingNameB' }
      ]
    });
    expect(component.find('ReadingSearchResult').length).toBe(2);
  });

  test('componentWillReceiveProps with zero search result', () => {
    const component = getShallowComponent();
    component.setProps({ searchReadings: [] });
    expect(component.find('ReadingSearchResult').length).toBe(0);
    expect(component.state('searchResults')).toEqual([<div key="noResult" className="readingSearchItem">No Result</div>]);
  });

  test('handleChange and searchKeyWord', () => {
    jest.useFakeTimers();
    const component = getShallowComponent();
    component.find('input').simulate('change', { target: { value: '12', id: 'newId' } });
    expect(component.state('searchResults')).toEqual([]);
    expect(component.state('newId')).toBe('12');
    expect(clearTimeout).not.toHaveBeenCalled();
    expect(setTimeout).not.toHaveBeenCalled();
    expect(defaultProps.fetchReadingBasedOnName).not.toHaveBeenCalled();
    component.instance().searchFunction = jest.fn();
    component.find('input').simulate('change', { target: { value: '123', id: 'newId' } });
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(defaultProps.fetchReadingBasedOnName).toHaveBeenLastCalledWith('123');
    expect(component.instance().keyWord).toBe('123');
  });

  test('handleResultClickCallback', () => {
    const component = getShallowComponent();
    component.instance().readingIndex = 1;
    component.find('AllReadingList').prop('handleClick')('readingIdAAA', 'readingNameAAA');
    expect(component.state('searchResults')).toEqual([]);
    expect(component.state('searchReading')).toBe('');
    expect(component.instance().readingIndex).toBe(2);
  });

  test('handlePingPongStateChangeCallback', () => {
    const component = getShallowComponent();
    component.find('ReadingSearchItem').prop('handlePingPongStateChangeCallback')('readingIdAA', 'optionValue');
    expect(defaultProps.handlePingpongstateChangeCallback).toHaveBeenLastCalledWith('readingIdAA', 'optionValue');
  });

  test('handleDeleteCallback', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn();
    component.instance().setReadingToStateArray = mockFunc;
    component.instance().readingIndexTracker.readingIndex = {};
    component.find('ReadingSearchItem').prop('handleDeleteCallback')('readingIdAA', 'readingIndex');
    expect(component.instance().readingIndexTracker.readingIndex).toBeUndefined();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(defaultProps.detachReadingCallback).toHaveBeenLastCalledWith('readingIdAA');
  });

  test('handleShowReadingListClick', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockFunc });
    component.setProps({ allReadingList: [] });
    component.find('button').simulate('click');
    expect(defaultProps.fetchAllReadingList).toHaveBeenLastCalledWith(0);
    expect(window.$).toHaveBeenLastCalledWith('#readingListModal');
    expect(mockFunc).toHaveBeenLastCalledWith('toggle');
  });

  test('preventSubmit', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn();
    component.find('input').simulate('keyPress', { charCode: 13, preventDefault: mockFunc });
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  // test('handleChange', () => {
  //   const component = getShallowComponent();
  //   component.find('input').simulate('change', { target: { id: 'newId', value: 'newValue' } });
  //   expect(component.state('searchResults')).toEqual([]);
  //   epect()
  // });
});
