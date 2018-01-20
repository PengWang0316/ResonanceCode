import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { DeleteReadingComformModal } from '../../app/Components/DeleteReadingComformModal';

describe('DeleteReadingComformModal test', () => {
  const defaultProps = {
    readingName: 'readingName',
    readingId: 'readingId',
    deleteReadingProps: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<DeleteReadingComformModal {...props} />);

  test('handleDeleteReading', () => {
    const component = getShallowComponent();
    component.find('button').at(1).simulate('click');
    expect(defaultProps.deleteReadingProps).toHaveBeenCalledTimes(1);
  });

  test('DeleteReadingComformModal snapshot', () => expect(renderer.create(<DeleteReadingComformModal {...defaultProps} />).toJSON()).toMatchSnapshot());
});
