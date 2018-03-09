import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import AddReadingJournalButton from '../../app/Components/AddReadingJournalButton';

jest.mock('react-router-dom', () => ({ Link: 'Link' }));

// const jQueryCssMock = jest.fn();
// const jQueryMock = jest.fn(() => ({ css: jQueryCssMock }));
jest.mock('jquery', () => jest.fn(() => ({ css: jest.fn() })));

describe('Test AddReadingJournalButton', () => {
  let shallowComponent;
  const getShallowComponent = () => {
    if (!shallowComponent) shallowComponent = shallow(<AddReadingJournalButton />);
    return shallowComponent;
  };

  beforeEach(() => { shallowComponent = undefined; });

  test('Has two button role divs', () => {
    const addReadingJournalButton = getShallowComponent();
    expect(addReadingJournalButton.find({ role: 'button' }).length).toBe(2);
  });

  test('HandleAddBtnClick opacity not equal 0', () => {
    const jQueryMock = require('jquery');
    const mockCssFn = jest.fn().mockReturnValue('1');
    jQueryMock.mockReturnValue({ css: mockCssFn });
    const addReadingJournalButton = getShallowComponent();
    // console.log(jQueryFn);
    addReadingJournalButton.find({ role: 'button' }).at(0).simulate('click');
    expect(jQueryMock.mock.calls.length).toBe(3);
    expect(mockCssFn).toHaveBeenCalledTimes(3);
    expect(mockCssFn).toHaveBeenLastCalledWith({ opacity: '0', bottom: '25px' });
  });

  test('HandleAddBtnClick opacity equal 0', () => {
    const jQueryMock = require('jquery');
    const mockCssFn = jest.fn().mockReturnValue('0');
    jQueryMock.mockReturnValue({ css: mockCssFn });
    const addReadingJournalButton = getShallowComponent();
    // console.log(jQueryFn);
    addReadingJournalButton.find({ role: 'button' }).at(0).simulate('click');
    expect(jQueryMock.mock.calls.length).toBe(6);
    expect(mockCssFn).toHaveBeenCalledTimes(3);
    expect(mockCssFn).toHaveBeenLastCalledWith({ opacity: '1', bottom: '145px' });
  });

  test('handleAddReadingButtonClick ', () => {
    const mockModalFn = jest.fn();
    window.$ = jest.fn(() => ({ modal: mockModalFn }));
    const component = getShallowComponent();
    component.find({ role: 'button' }).at(1).simulate('click');
    expect(window.$).toHaveBeenLastCalledWith('#addReadingModal');
    expect(mockModalFn).toHaveBeenLastCalledWith('toggle');
  });

  test('AddReadingJournalButton snapshot', () => {
    const snapshot = renderer.create(<AddReadingJournalButton />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
