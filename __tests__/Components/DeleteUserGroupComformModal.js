import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { DeleteUserGroupComformModal } from '../../app/Components/DeleteUserGroupComformModal';

describe('DeleteUserGroupComformModal test', () => {
  const defaultProps = {
    deleteUserGroupProps: jest.fn(),
    groupName: ''
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<DeleteUserGroupComformModal {...props} />);

  test('handleDelete', () => {
    const component = getShallowComponent();
    component.find('button').at(1).simulate('click');
    expect(defaultProps.deleteUserGroupProps).toHaveBeenCalledTimes(1);
  });

  test('DeleteUserGroupComformModal snapshot', () => expect(renderer.create(<DeleteUserGroupComformModal {...defaultProps} />).toJSON()).toMatchSnapshot());
});
