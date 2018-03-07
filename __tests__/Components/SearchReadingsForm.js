import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SearchReadingsForm from '../../app/Components/SearchReadingsForm';

jest.mock('jquery', () => jest.fn().mockReturnValue({ datepicker: jest.fn() }));
jest.mock('../../app/resources/jquery-ui.min', () => {});

describe('SearchReadingsForm test', () => {
  const defaultProps = {
    handleSubmit: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SearchReadingsForm {...props} />);

  test('SearchReadingsForm snapshot', () => expect(renderer.create(<SearchReadingsForm {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('initial states, setDatePicker function and jQuery.datepicker was called', () => {
    jest.useFakeTimers();
    const jQuery = require('jquery');
    jQuery().datepicker = jest.fn();
    const component = getShallowComponent();
    expect(component.state('isSigleDate')).toBe(true);
    expect(component.state('people')).toBe('');
    expect(component.state('startDate')).toBe('');
    expect(component.state('endDate')).toBe('');
    expect(component.state('upper')).toBe(0);
    expect(component.state('lower')).toBe(0);
    expect(component.state('line13')).toBe(0);
    expect(component.state('line25')).toBe(0);
    expect(component.state('line46')).toBe(0);
    expect(component.state('isStartDateCorrect')).toBe(false);
    expect(component.state('isEndDateCorrect')).toBe(false);
    expect(component.instance().setDatePicker).toBeInstanceOf(Function);
    jest.runAllTimers();
    expect(jQuery).toHaveBeenLastCalledWith('#startDate');
    expect(jQuery().datepicker).toHaveBeenCalledTimes(1);
  });

  test('handleRadioChange', () => {
    jest.useFakeTimers();
    const jQuery = require('jquery');
    const component = getShallowComponent();
    const originalIsSigleDate = component.state('isSigleDate');
    component.find('#optionsRadios2').simulate('change');
    jQuery().datepicker = jest.fn();
    expect(component.state('isSigleDate')).not.toBe(originalIsSigleDate);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(jQuery().datepicker).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(jQuery().datepicker).toHaveBeenCalledTimes(1);
  });

  test('handleInputChange', () => {
    const component = getShallowComponent();
    component.setState({ isEndDateCorrect: true, isSigleDate: false });
    component.find('#startDate').simulate('change', { target: { id: 'id', value: 'value' } });
    expect(component.state('id')).toBe('value');
    component.find('#startDate').simulate('change', { target: { id: 'startDate', value: '01/01/2018' } });
    expect(component.state('startDate')).toBe('01/01/2018');
    expect(component.state('isStartDateCorrect')).toBe(true);
    component.find('#startDate').simulate('change', { target: { id: 'endDate', value: 'wrong date format' } });
    expect(component.state('endDate')).toBe('wrong date format');
    expect(component.state('isEndDateCorrect')).toBe(false);
  });

  test('handleSubmit', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn();
    component.find('form').simulate('submit', { preventDefault: mockFunc });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleSubmit).toHaveBeenCalledTimes(1);
  });
});
