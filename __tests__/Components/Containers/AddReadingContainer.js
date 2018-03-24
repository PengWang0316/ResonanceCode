import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { AddReadingContainer } from '../../../app/Components/containers/AddReadingContainer';

jest.mock('../../../app/Components/AddReadingForm', () => 'AddReadingForm');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');

sinon.useFakeTimers(new Date(2017, 3, 16));

describe('AddReadingContainer test', () => {
  const defaultProps = {
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
      imageArrays: { img1: [], img2: [] },
      changeLinesNumberArray: ['1']
    },
    user: { displayName: 'displayName' },
    readings: [],
    clickCoin: jest.fn(),
    clearAddReadingTempState: jest.fn(),
    checkAuthentication: jest.fn(),
    createReading: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<AddReadingContainer {...props} />);

  test('component will mount user authorized', () => {
    const mockCheckAuthentication = jest.fn();
    const mockClearAddReadingTempState = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      user: { isAuth: true },
      checkAuthentication: mockCheckAuthentication,
      clearAddReadingTempState: mockClearAddReadingTempState
    });
    expect(mockCheckAuthentication).not.toHaveBeenCalled();
    expect(mockClearAddReadingTempState).toHaveBeenCalledTimes(1);
    expect(component.instance().isFinishCreating).toBe(false);
  });

  test('component will mount user not authorized', () => {
    const mockCheckAuthentication = jest.fn();
    const mockClearAddReadingTempState = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      user: { isAuth: false },
      checkAuthentication: mockCheckAuthentication,
      clearAddReadingTempState: mockClearAddReadingTempState
    });
    expect(mockCheckAuthentication).toHaveBeenCalledTimes(1);
    expect(mockClearAddReadingTempState).toHaveBeenCalledTimes(1);
    expect(component.instance().isFinishCreating).toBe(false);
  });

  test('componentWillReceivedProps', () => {
    const mockClearAddReadingTempState = jest.fn();
    const mockModal = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModal });
    const component = getShallowComponent({
      ...defaultProps,
      user: { isAuth: true },
      clearAddReadingTempState: mockClearAddReadingTempState
    });
    component.instance().isFinishCreating = true;
    component.setProps({ readings: [1, 2] });
    expect(mockClearAddReadingTempState).toHaveBeenCalledTimes(2);
    expect(window.$).toHaveBeenLastCalledWith('#addReadingModal');
    expect(mockModal).toHaveBeenLastCalledWith('toggle');
    expect(component.instance().isFinishCreating).toBe(false);
  });

  test('handleCoinClickCallback line 1 coinPoint 6', () => {
    const component = getShallowComponent();
    component.find('AddReadingForm').prop('handleCoinClick')('1', 6);
    expect(defaultProps.clickCoin).toHaveBeenLastCalledWith({
      availableArr: [true, false, true, false, false, false, false],
      changeLines: '2nd',
      changeLinesNumberArray: ['1'],
      imageArrays: { img1: [undefined, 6], img2: [undefined, 7] },
      line0: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line1: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-red-big', side1: 'img-line-side-red-big', side2: 'img-line-side-red-big'
      },
      line2: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line3: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line4: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line5: {
        middle1: '', middle2: '', side1: '', side2: ''
      }
    });
  });

  test('handleCoinClickCallback line 2 coinPoint 7', () => {
    const component = getShallowComponent();
    component.find('AddReadingForm').prop('handleCoinClick')('2', 7);
    expect(defaultProps.clickCoin).toHaveBeenLastCalledWith({
      availableArr: [true, false, true, true, false, false, false],
      changeLines: '',
      changeLinesNumberArray: ['1'],
      imageArrays: { img1: [undefined, 6, 7], img2: [undefined, 7, 7] },
      line0: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line1: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-red-big', side1: 'img-line-side-red-big', side2: 'img-line-side-red-big'
      },
      line2: {
        middle1: 'img-line-middle-big', middle2: 'img-line-middle-big', side1: 'img-line-side-big', side2: 'img-line-side-big'
      },
      line3: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line4: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line5: {
        middle1: '', middle2: '', side1: '', side2: ''
      }
    });
  });

  test('handleCoinClickCallback line 3 coinPoint 8', () => {
    const component = getShallowComponent();
    component.find('AddReadingForm').prop('handleCoinClick')('3', 8);
    expect(defaultProps.clickCoin).toHaveBeenLastCalledWith({
      availableArr: [true, false, true, true, true, false, false],
      changeLines: '',
      changeLinesNumberArray: ['1'],
      imageArrays: { img1: [undefined, 6, 7, 8], img2: [undefined, 7, 7, 8] },
      line0: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line1: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-red-big', side1: 'img-line-side-red-big', side2: 'img-line-side-red-big'
      },
      line2: {
        middle1: 'img-line-middle-big', middle2: 'img-line-middle-big', side1: 'img-line-side-big', side2: 'img-line-side-big'
      },
      line3: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-blank-big', side1: 'img-line-side-big', side2: 'img-line-side-big'
      },
      line4: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line5: {
        middle1: '', middle2: '', side1: '', side2: ''
      }
    });
  });

  test('handleCoinClickCallback line 4 coinPoint 9', () => {
    const component = getShallowComponent();
    component.find('AddReadingForm').prop('handleCoinClick')('4', 9);
    expect(defaultProps.clickCoin).toHaveBeenLastCalledWith({
      availableArr: [true, false, true, true, true, true, false],
      changeLines: '5th',
      changeLinesNumberArray: ['1', '4'],
      imageArrays: { img1: [undefined, 6, 7, 8, 9], img2: [undefined, 7, 7, 8, 8] },
      line0: {
        middle1: '', middle2: '', side1: '', side2: ''
      },
      line1: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-red-big', side1: 'img-line-side-red-big', side2: 'img-line-side-red-big'
      },
      line2: {
        middle1: 'img-line-middle-big', middle2: 'img-line-middle-big', side1: 'img-line-side-big', side2: 'img-line-side-big'
      },
      line3: {
        middle1: 'img-line-middle-blank-big', middle2: 'img-line-middle-blank-big', side1: 'img-line-side-big', side2: 'img-line-side-big'
      },
      line4: {
        middle1: 'img-line-middle-red-big', middle2: 'img-line-middle-blank-big', side1: 'img-line-side-red-big', side2: 'img-line-side-red-big'
      },
      line5: {
        middle1: '', middle2: '', side1: '', side2: ''
      }
    });
  });

  test('handleSubmitCallback with user displayName', () => {
    const component = getShallowComponent({
      ...defaultProps,
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
        imageArrays: { img1: [7, 6, 7, 6, 7], img2: [7, 7, 7, 6, 6] },
        changeLinesNumberArray: ['1', '4']
      }
    });
    component.find('AddReadingForm').prop('handleSubmit')({ readingName: 'readingName', date: '2018-02-27T08:00:00.000Z', people: 'people' });
    expect(defaultProps.createReading).toHaveBeenLastCalledWith({
      change_lines: ['1', '4'], change_lines_text: '', date: new Date('2018-02-27T08:00:00.000Z'), hexagram_arr_1: '7,9-6,8-7,9-6,8-7,9', hexagram_arr_2: '7,9-7,9-7,9-6,8-6,8', img1: '7,6,7,6,7', img2: '7,7,7,6,6', people: 'people', reading_name: 'readingName', userName: 'displayName'
    });
    expect(component.instance().isFinishCreating).toBe(true);
  });

  test('handleSubmitCallback with user customName', () => {
    const component = getShallowComponent({
      ...defaultProps,
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
        imageArrays: { img1: [7, 6, 7, 6, 7], img2: [7, 7, 7, 6, 6] },
        changeLinesNumberArray: ['1', '4']
      },
      user: { customName: 'customerName' }
    });
    // const component = getShallowComponent({ ...defaultProps, user: { customName: 'customerName' } });
    component.find('AddReadingForm').prop('handleSubmit')({ readingName: 'readingName', date: '2018-02-27T08:00:00.000Z', people: 'people' });
    expect(defaultProps.createReading).toHaveBeenLastCalledWith({
      change_lines: ['1', '4'], change_lines_text: '', date: new Date('2018-02-27T08:00:00.000Z'), hexagram_arr_1: '7,9-6,8-7,9-6,8-7,9', hexagram_arr_2: '7,9-7,9-7,9-6,8-6,8', img1: '7,6,7,6,7', img2: '7,7,7,6,6', people: 'people', reading_name: 'readingName', userName: 'customerName'
    });
    expect(component.instance().isFinishCreating).toBe(true);
  });

  test('AddReadingContainer snapshot', () => expect(renderer.create(<AddReadingContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
