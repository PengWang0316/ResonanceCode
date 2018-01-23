import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ReadingListRow from '../../app/Components/ReadingListRow';

describe('ReadingListRow test', () => {
  const defaultProps = {
    reading: { _id: 'readingId', reading_name: 'readingName', date: new Date(2018, 0, 1) },
    handleClick: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<ReadingListRow {...props} />);

  test('ReadingListRow snapshot', () => expect(renderer.create(<ReadingListRow {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleClick', () => {
    const component = getShallowComponent();
    const mockModal = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModal });
    component.find('div').simulate('click');
    expect(defaultProps.handleClick)
      .toHaveBeenLastCalledWith(defaultProps.reading._id, defaultProps.reading.reading_name);
    expect(window.$).toHaveBeenLastCalledWith('#readingListModal');
    expect(mockModal).toHaveBeenLastCalledWith('toggle');
  });
});
