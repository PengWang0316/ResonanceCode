import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { AddReadingForm } from '../../app/Components/AddReadingForm';
// import Unit from '../../app/apis/Util';

jest.mock('../../app/Components/HexagramLine', () => 'HexagramLine');
// Unit.getCurrentDateString = jest.fn(() => '01/13/2018');
jest.mock('../../app/apis/Util', () => ({
  matchDateFormat: jest.fn(value => {
    if (value === 'wrong date') return false;
    return true;
  })
}));
jest.mock('date-format-lib', () => ({
  getCurrentDateString: jest.fn(() => '01/13/2018')
}));
jest.mock('jquery', () => jest.fn().mockReturnValue({ datepicker: jest.fn(), attr: jest.fn() }));
jest.mock('../../app/resources/jquery-ui.min', () => {});

describe('Test AddReadingForm', () => {
  let props;
  let shallowAddReadingForm;
  // let mountAddReadingForm;
  const addReadingFormShallow = () => {
    if (!shallowAddReadingForm) shallowAddReadingForm = shallow(<AddReadingForm {... props} />);
    return shallowAddReadingForm;
  };

  // const addReadingFormMount = () => {
  //   if (!mountAddReadingForm) mountAddReadingForm = mount(<AddReadingForm {... props} />);
  //   return mountAddReadingForm;
  // };

  beforeEach(() => {
    props = {
      readings: [],
      addReadingTempState: {
        line0: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        line1: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        line2: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        line3: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        line4: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        line5: {
          side1: '', middle1: '', side2: '', middle2: ''
        },
        changeLines: '',
        availableArr: [true, false, false, false, false, false, false],
        /* readingName: "",
      date: Util.getCurrentDateString(),
      people: "",
      isWriting: false, */
        imageArrays: { img1: [], img2: [] },
        changeLinesNumberArray: []
      },
      handleCancel: jest.fn(),
      handleCoinClick: jest.fn(),
      handleSubmit: jest.fn()
    };
    shallowAddReadingForm = undefined;
  });

  test('Has a form element', () => {
    const forms = addReadingFormShallow().find('form');
    expect(forms.length).toBeGreaterThan(0);
  });

  test('componentWillReceiveProps', () => {
    const addReadingForm = addReadingFormShallow();
    addReadingForm.find('form').simulate('submit', { preventDefault() {} });
    addReadingForm.setState({ // Manually set up state to values that are differetn with inintail state.
      readingName: 'aa',
      people: 'aa',
      date: null,
      isDateCorrect: false
    });
    addReadingForm.setProps({ readings: [1, 2] });
    const newState = addReadingForm.state();
    expect(newState.readingName).toBe('');
    expect(newState.people).toBe('');
    expect(newState.isDateCorrect).toBe(true);
  });

  test('componentDidMount', () => {
    const mockDatepickerFn = jest.fn();
    const jQuery = require('jquery');
    jQuery.mockReturnValue({ datepicker: mockDatepickerFn });
    addReadingFormShallow();
    expect(jQuery).toHaveBeenLastCalledWith('#date');
    expect(mockDatepickerFn).toHaveBeenCalledTimes(1);
  });

  test('handleSubmit', () => {
    const mockAttrFn = jest.fn();
    const jQuery = require('jquery');
    jQuery.mockReturnValue({ datepicker: jest.fn(), attr: mockAttrFn });
    const addReadingForm = addReadingFormShallow();
    addReadingForm.find('form').simulate('submit', { preventDefault() {} });
    expect(addReadingForm.instance().props.handleSubmit).toHaveBeenCalled();
    expect(jQuery).toHaveBeenLastCalledWith('button[type=submit]');
    expect(mockAttrFn).toHaveBeenLastCalledWith('disabled', 'disabled');
  });

  test('handleCancelCallback', () => {
    const addReadingForm = addReadingFormShallow();
    addReadingForm.find({ type: 'button' }).at(0).simulate('click');
    expect(addReadingForm.instance().props.handleCancel).toHaveBeenCalled();
  });

  test('HexagramLine display', () => {
    const addReadingForm = addReadingFormShallow();
    // Initially just show one HexagramLine component.
    expect(addReadingForm.find('HexagramLine').length).toBe(1);
    addReadingForm.setProps({
      addReadingTempState: {
        ...addReadingForm.instance().props.addReadingTempState,
        ...{ availableArr: [true, true, true, true, true, true, true] }
      }
    });
    expect(addReadingForm.find('HexagramLine').length).toBe(6);

    // Test when side2 props has values.
    addReadingForm.setProps({
      addReadingTempState: {
        ...addReadingForm.instance().props.addReadingTempState,
        ...{ line0: { side2: 'side2' } },
        ...{ line1: { side2: 'side2' } },
        ...{ line2: { side2: 'side2' } },
        ...{ line3: { side2: 'side2' } },
        ...{ line4: { side2: 'side2' } },
        ...{ line5: { side2: 'side2' } }
      }
    });
    expect(addReadingForm.find('HexagramLine').length).toBe(12);
  });

  test('submit button disable', () => {
    const addReadingForm = addReadingFormShallow();
    expect(addReadingForm.find({ type: 'submit' }).at(0).prop('disabled')).toBe(true);
    expect(addReadingForm.find({ type: 'submit' }).at(1).prop('disabled')).toBe(true);
    // Change state and props to make it undisabled.
    addReadingForm.setState({
      date: '01-01-2018',
      readingName: 'Name'
    });
    addReadingForm.setProps({
      addReadingTempState: {
        ...addReadingForm.instance().props.addReadingTempState,
        ...{ isLoading: false },
        availableArr: [true, true, true, true, true, true, true]
      }
    });
    expect(addReadingForm.find({ type: 'submit' }).at(0).prop('disabled')).toBe(false);
  });

  test('handleInputChange', () => {
    const addReadingForm = addReadingFormShallow();
    addReadingForm.find('#readingName').simulate('change', { target: { id: 'readingName', value: 'new name' } });
    expect(addReadingForm.state('readingName')).toBe('new name');
    addReadingForm.find('#date').simulate('change', { target: { id: 'date', value: 'wrong date' } });
    expect(addReadingForm.state('isDateCorrect')).toBe(false);
    addReadingForm.find('#date').simulate('change', { target: { id: 'date', value: '01-01-2018' } });
    expect(addReadingForm.state('isDateCorrect')).toBe(true);
  });

  test('handleCoinClickCallback', () => {
    const component = addReadingFormShallow();
    component.instance().handleCoinClickCallback(1, 2);
    expect(props.handleCoinClick).toHaveBeenLastCalledWith(1, 2);
  });

  test('Snapshot test', () => {
    // jest.resetModules();
    // const util = require('../../app/apis/Util');
    // util.getCurrentDateString = jest.fn(() => '01/13/2018');
    const tree = renderer.create(<AddReadingForm {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
