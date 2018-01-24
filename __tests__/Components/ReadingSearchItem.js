import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ReadingSearchItem from '../../app/Components/ReadingSearchItem';

describe('ReadingSearchItem test', () => {
  const defaultProps = {
    readingName: 'readingName',
    readingId: 'readingId',
    pingPongStates: {},
    readingIndex: 0,
    handleDeleteCallback: jest.fn(),
    handlePingPongStateChangeCallback: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<ReadingSearchItem {...props} />);

  test('ReadingSearchItem snapshot', () => expect(renderer.create(<ReadingSearchItem {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleDelete', () => {
    const component = getShallowComponent();
    component.find({ role: 'button' }).simulate('click');
    expect(defaultProps.handleDeleteCallback)
      .toHaveBeenLastCalledWith(defaultProps.readingId, defaultProps.readingIndex);
  });

  test('handlePingPongStateChange', () => {
    const component = getShallowComponent({ ...defaultProps, pingPongStates: { readingId: 'pingPongState' } });
    component.find('select').simulate('change', { target: { value: 'newValue' } });
    expect(defaultProps.handlePingPongStateChangeCallback).toHaveBeenLastCalledWith(defaultProps.readingId, 'newValue');
  });
});
