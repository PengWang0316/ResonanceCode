import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import sinon from 'sinon';

import { AddReadingForm } from '../../app/Components/AddReadingForm';
// import Unit from '../../app/apis/Util';

jest.mock('../../app/Components/HexagramLine', () => 'HexagramLine');
// Unit.getCurrentDateString = jest.fn(() => '01/13/2018');
jest.mock('../../app/apis/Util', () => ({ getCurrentDateString: jest.fn(() => '01/13/2018') }));
jest.mock('../../app/resources/jquery-ui.min');

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

  test('handleSubmit', () => {
    const addReadingForm = addReadingFormShallow();
    addReadingForm.find('form').simulate('submit', { preventDefault() {} });
    expect(addReadingForm.instance().props.handleSubmit).toHaveBeenCalled();
  });

  test('Snapshot test', () => {
    const tree = renderer.create(<AddReadingForm {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
