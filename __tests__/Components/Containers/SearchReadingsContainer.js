import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SearchReadingsContainer } from '../../../app/Components/containers/SearchReadingsContainer';

jest.mock('../../../app/Components/SearchReadingsForm', () => 'SearchReadingsForm');
jest.mock('../../../app/Components/BriefReading', () => 'BriefReading');
jest.mock('../../../app/Components/HexagramDetailModal', () => 'HexagramDetailModal');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');

describe('SearchReadingsContainer test', () => {
  const defaultProps = {
    readings: [{ _id: 'readingIdA' }],
    extraMessage: '',
    user: { isAuth: true },
    searchReadings: jest.fn(),
    checkAuthentication: jest.fn(),
    clearSearchReadings: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<SearchReadingsContainer {...props} />);

  test('componentWillMount the user is authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockClearSearchReadingsFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      checkAuthentication: mockCheckAuthenticationFn,
      clearSearchReadings: mockClearSearchReadingsFn
    });
    expect(mockCheckAuthenticationFn).not.toHaveBeenCalled();
    expect(mockClearSearchReadingsFn).toHaveBeenCalledTimes(1);
    expect(component.instance().state.hexagramArr).toBe('');
  });

  test('componentWillMount the user is not authorized', () => {
    const mockCheckAuthenticationFn = jest.fn();
    const mockClearSearchReadingsFn = jest.fn();
    getShallowComponent({
      ...defaultProps,
      user: { isAuth: false },
      checkAuthentication: mockCheckAuthenticationFn,
      clearSearchReadings: mockClearSearchReadingsFn
    });
    expect(mockCheckAuthenticationFn).toHaveBeenCalledTimes(1);
    expect(mockClearSearchReadingsFn).toHaveBeenCalledTimes(1);
  });

  test('handleSubmitCallback endDate and startDate are not false', () => {
    const component = getShallowComponent();
    component.find('SearchReadingsForm').prop('handleSubmit')({
      startDate: '01-10-2018',
      endDate: '01-12-2018',
      people: 'people',
      upper: 'upper',
      lower: 'lower',
      line13: 'line13',
      line25: 'line25',
      line46: 'line46'
    });
    expect(defaultProps.searchReadings).toHaveBeenLastCalledWith({
      endDate: new Date('01-12-2018'), line13Id: 'line13', line25Id: 'line25', line46Id: 'line46', lowerId: 'lower', people: 'people', startDate: new Date('01-10-2018'), upperId: 'upper'
    });
  });

  test('handleSubmitCallback endDate and startDate are false', () => {
    const component = getShallowComponent();
    component.find('SearchReadingsForm').prop('handleSubmit')({
      startDate: false,
      endDate: false,
      people: 'people',
      upper: 'upper',
      lower: 'lower',
      line13: 'line13',
      line25: 'line25',
      line46: 'line46'
    });
    expect(defaultProps.searchReadings).toHaveBeenLastCalledWith({
      endDate: false, line13Id: 'line13', line25Id: 'line25', line46Id: 'line46', lowerId: 'lower', people: 'people', startDate: false, upperId: 'upper'
    });
  });

  test('handleHexagramClick', () => {
    const mockModalFn = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFn });
    const mockStopPropagationFn = jest.fn();
    const component = getShallowComponent();
    component.find('BriefReading').prop('handleHexagramClick')({ stopPropagation: mockStopPropagationFn, target: { id: 'id' } });
    expect(mockStopPropagationFn).toHaveBeenCalledTimes(1);
    expect(component.instance().state.hexagramArr).toBe('id');
    expect(window.$).toHaveBeenLastCalledWith('#hexagramDetailModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
  });

  test('SearchReadingsContainer snapshot', () => expect(renderer.create(<SearchReadingsContainer {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('SearchReadingsContainer with extraMessage snapshot', () => expect(renderer.create(<SearchReadingsContainer {...{ ...defaultProps, extraMessage: 'message' }} />).toJSON()).toMatchSnapshot());
});
