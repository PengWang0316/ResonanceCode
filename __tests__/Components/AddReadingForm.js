import React from 'react';
import { shallow } from 'enzyme';

import { AddReadingForm } from '../../app/Components/AddReadingForm';
// import Loading from '../../app/Components/Loading';

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
});
