import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SearchHexagramsContainer } from '../../../app/Components/containers/SearchHexagramsContainer';

jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');
jest.mock('../../../app/Components/BriefReading', () => 'BriefReading');
jest.mock('../../../app/Components/HexagramImgTable', () => 'HexagramImgTable');
jest.mock('../../../app/Components/SearchHexagramsForm', () => 'SearchHexagramsForm');

describe('SearchHexagramsContainer test', () => {
  const defaultProps = {
    hexagrams: [{ _id: 1 }],
    searchReadings: [{ _id: 'readingIdA' }],
    extraMessage: '',
    user: { isAuth: true },
    fetchReadingsBaseOnHexagram: jest.fn(),
    fetchHexagrams: jest.fn(),
    checkAuthentication: jest.fn(),
    clearSearchReadings: jest.fn(),
    clearHexagrams: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<SearchHexagramsContainer {...props} />);

  test('componentWillMount user is authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockClearSearchReadingsFn = jest.fn();
    const mockClearHexagramsFn = jest.fn();
    getShallowComponent({
      ...defaultProps,
      checkAuthentication: mockCheckAuthenticationFn,
      clearSearchReadings: mockClearSearchReadingsFn,
      clearHexagrams: mockClearHexagramsFn
    });
    expect(mockCheckAuthenticationFn).not.toHaveBeenCalled();
    expect(mockClearSearchReadingsFn).toHaveBeenCalledTimes(1);
    expect(mockClearHexagramsFn).toHaveBeenCalledTimes(1);
  });

  test('componentWillMount user is not authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockClearSearchReadingsFn = jest.fn();
    const mockClearHexagramsFn = jest.fn();
    getShallowComponent({
      ...defaultProps,
      user: { isAuth: false },
      checkAuthentication: mockCheckAuthenticationFn,
      clearSearchReadings: mockClearSearchReadingsFn,
      clearHexagrams: mockClearHexagramsFn
    });
    expect(mockCheckAuthenticationFn).toHaveBeenCalledTimes(1);
    expect(mockClearSearchReadingsFn).toHaveBeenCalledTimes(1);
    expect(mockClearHexagramsFn).toHaveBeenCalledTimes(1);
  });

  test('handleClickImgCallback', () => {
    const component = getShallowComponent();
    const imgArr = 'imgArr';
    component.find('HexagramImgTable').prop('onCallback')(imgArr);
    expect(defaultProps.fetchReadingsBaseOnHexagram).toHaveBeenLastCalledWith(imgArr);
  });

  test('handleSubmit', () => {
    const component = getShallowComponent();
    const searchCriterians = 'searchCriterians';
    component.find('SearchHexagramsForm').prop('handleSubmit')(searchCriterians);
    expect(defaultProps.fetchHexagrams).toHaveBeenLastCalledWith(searchCriterians);
  });

  test('SearchHexagramsContainer no result message snapshot', () => expect(renderer.create(<SearchHexagramsContainer {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('SearchHexagramsContainer has result message snapshot', () => expect(renderer.create(<SearchHexagramsContainer {... { ...defaultProps, extraMessage: 'extra message' }} />).toJSON()).toMatchSnapshot());
});
