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

  test('HandleAddBtnClick', () => {
    const jQueryMock = require('jquery');
    const addReadingJournalButton = getShallowComponent();
    // console.log(jQueryFn);
    addReadingJournalButton.find({ role: 'button' }).at(0).simulate('click');
    expect(jQueryMock.mock.calls.length).toBe(3);
    // const cssMockFn = jQueryMock().css.mockReturnValue('1');
    // addReadingJournalButton.find({ role: 'button' }).at(0).simulate('click');

    // expect(cssMockFn.mock.calls.length).toBe(3);
  });

  test('AddReadingJournalButton snapshot', () => {
    const snapshot = renderer.create(<AddReadingJournalButton />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
