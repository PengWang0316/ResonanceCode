import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import UserGroups from '../../app/Components/UserGroups';

jest.mock('../../app/Components/UserGroupModal', () => 'UserGroupModal');
jest.mock('../../app/Components/DeleteUserGroupComformModal', () => 'DeleteUserGroupComformModal');
const mockOnFunc = jest.fn((functionName, callback) => callback());
// const mockModalFunc = jest.fn();
window.$ = jest.fn().mockReturnValue({ on: mockOnFunc });

describe('UserGroups test', () => {
  const defaultProps = {
    userGroups: { id1: [{ id: 'idA', displayName: 'displayNameA', photo: 'photoA' }] }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<UserGroups {...props} />);

  test('initial states and componentDidMount', () => {
    const component = getShallowComponent();
    expect(component.state('userGroup')).toBeNull();
    expect(component.state('groupName')).toBe('');
    expect(component.state('isUpdate')).toBeFalsy();
    expect(component.state('deleteGroupName')).toBe('');
    expect(window.$).toHaveBeenLastCalledWith('#userGroupModal');
    expect(mockOnFunc).toHaveBeenCalledTimes(1);
  });

  test('UserGroups snapshot', () => expect(renderer.create(<UserGroups {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleClick', () => {
    const mockModalFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ on: mockOnFunc, modal: mockModalFunc });
    const component = getShallowComponent();
    component.find('span').simulate('click', { target: { parentElement: { id: 'id1' } } });
    expect(component.state('userGroup')).toEqual([{ id: 'idA', displayName: 'displayNameA', photo: 'photoA' }]);
    expect(component.state('groupName')).toBe('id1');
    expect(component.state('isUpdate')).toBeTruthy();
    expect(window.$).toHaveBeenLastCalledWith('#userGroupModal');
    expect(mockModalFunc).toHaveBeenLastCalledWith('toggle');
  });

  test('handleAddGroupClick', () => {
    const mockModalFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ on: mockOnFunc, modal: mockModalFunc });
    const component = getShallowComponent();
    component.find('button').simulate('click');
    expect(component.state('userGroup')).toBeNull();
    expect(component.state('groupName')).toBe('');
    expect(component.state('isUpdate')).toBeFalsy();
    expect(window.$).toHaveBeenLastCalledWith('#userGroupModal');
    expect(mockModalFunc).toHaveBeenLastCalledWith('toggle');
  });

  test('handleRemoveGroup', () => {
    const mockModalFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ on: mockOnFunc, modal: mockModalFunc });
    const component = getShallowComponent();
    component.find('i').simulate('click', { target: { parentElement: { id: 'idA' } } });
    expect(component.state('deleteGroupName')).toBe('idA');
    expect(window.$).toHaveBeenLastCalledWith('#deleteUserGroupConformModal');
    expect(mockModalFunc).toHaveBeenLastCalledWith('toggle');
  });
});
