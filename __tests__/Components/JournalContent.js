import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import JournalContent from '../../app/Components/JournalContent';

window.$ = jest.fn(() => ({ tooltip: jest.fn() }));

describe('JournalContent test', () => {
  const defaultProps = {
    newContent: 'newContent',
    newContentName: 'newContentName',
    newContentKey: 'newContentKey',
    handleChangeCallback: jest.fn(),
    handleDeleteContentCallback: jest.fn(),
    handleSharedBoxChangeCallback: jest.fn(),
    isPrivate: true
  };
  const getShallowComponent = (props = defaultProps) => shallow(<JournalContent {...props} />);

  test('initailize states', () => {
    const component = getShallowComponent();
    expect(component.state('isPrivate')).toBeTruthy();
    expect(component.state(defaultProps.newContentKey)).toBe(defaultProps.newContent);
    expect(getShallowComponent({ ...defaultProps, isPrivate: false }).state('isPrivate')).toBeFalsy();
  });

  test('componentDidMount', () => {
    document.getElementsByTagName = jest.fn().mockReturnValue([{ value: 'value', style: {} }]);
    const tooltip = jest.fn();
    window.$ = jest.fn(() => ({ tooltip }));
    getShallowComponent();
    expect(window.$).toHaveBeenLastCalledWith('[data-toggle="tooltip"]');
    expect(tooltip).toHaveBeenCalledTimes(1);

    document.getElementsByTagName = jest.fn().mockReturnValue([{ value: '', style: {} }]);
    getShallowComponent();
  });

  test('handleChange', () => {
    const component = getShallowComponent();
    component.find('textarea').simulate('change', { target: { value: 'newValue' } });
    expect(component.state(defaultProps.newContentKey)).toBe('newValue');
    expect(defaultProps.handleChangeCallback).toHaveBeenLastCalledWith(defaultProps.newContentKey, 'newValue');
  });

  test('handleClose', () => {
    const component = getShallowComponent();
    component.find({ role: 'button' }).simulate('click');
    expect(defaultProps.handleDeleteContentCallback)
      .toHaveBeenLastCalledWith(defaultProps.newContentKey);
  });

  test('handleSharedBoxChange', () => {
    const component = getShallowComponent();
    const originalIsPrivate = component.state('isPrivate');
    component.find('input').simulate('change');
    const newIsPrivate = component.state('isPrivate');
    expect(newIsPrivate).toBe(!originalIsPrivate);
    expect(defaultProps.handleSharedBoxChangeCallback)
      .toHaveBeenLastCalledWith(defaultProps.newContentKey, newIsPrivate);
  });

  test('JournalContent snapshot', () => expect(renderer.create(<JournalContent {...defaultProps} />).toJSON()).toMatchSnapshot());
});
