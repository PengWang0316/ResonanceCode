import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { UserGroupModal } from '../../app/Components/UserGroupModal';

jest.mock('../../app/Components/UserPicker', () => 'UserPicker');

describe('UserGroupModal test', () => {
  const defaultProps = {
    userGroup: [{ id: 'id1' }, { id: 'id2' }],
    groupName: '',
    isUpdate: false,
    user: { settings: { userGroups: { id1: [{ id: 'idA', displayName: 'displayNameA', photo: 'photoA' }] } } },
    fetchUsersAmount: jest.fn(),
    fetchAllUserList: jest.fn(),
    updateUserGroup: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<UserGroupModal {...props} />);

  test('componentWillMount and initial states', () => {
    const component = getShallowComponent();
    expect(defaultProps.fetchUsersAmount).toHaveBeenCalledTimes(1);
    expect(defaultProps.fetchAllUserList).toHaveBeenLastCalledWith(0);
    expect(component.state('userList')).toEqual({});
    expect(component.state('userList')).toEqual({});
    expect(component.state('groupName')).toBe('');
    expect(component.state('isUpdate')).toBeFalsy();
  });

  test('UserGroupModal snapshot', () => expect(renderer.create(<UserGroupModal {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    component.setState({ userList: {}, groupName: 'aaa', isUpdate: false });
    component.setProps({ userGroup: [{ id: 'idA' }, { id: 'idB' }], groupName: 'newGroupName', isUpdate: true });
    expect(component.state('userList')).toEqual({ idA: { id: 'idA' }, idB: { id: 'idB' } });
    expect(component.state('groupName')).toBe('newGroupName');
    expect(component.state('isUpdate')).toBeTruthy();
  });

  test('handleInputChange', () => {
    const component = getShallowComponent();
    component.find('input').simulate('change', { target: { id: 'testId', value: 'testValue' } });
    expect(component.state('testId')).toBe('testValue');
  });

  test('handleAddUserCallback has childNodes', () => {
    const component = getShallowComponent();
    component.setState({ userList: { oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } } });
    const mockFuncA = jest.fn().mockReturnValue('photoSrc');
    const mockFuncB = jest.fn().mockReturnValue('userId');
    component.find('UserPicker').prop('handleAddUser')({ target: { getAttribute: mockFuncB, childNodes: [{ getAttribute: mockFuncA }], innerText: 'displayNameText' } });
    expect(mockFuncA).toHaveBeenLastCalledWith('src');
    expect(mockFuncB).toHaveBeenLastCalledWith('userid');
    expect(component.state('userList')).toEqual({ userId: { id: 'userId', displayName: 'displayNameText', photo: 'photoSrc' }, oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } });
  });

  test('handleAddUserCallback without childNodes', () => {
    const component = getShallowComponent();
    component.setState({ userList: { oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } } });
    const mockFuncA = jest.fn().mockReturnValue('photoSrc');
    const mockFuncB = jest.fn().mockReturnValue('userId');
    component.find('UserPicker').prop('handleAddUser')({
      target: {
        getAttribute: mockFuncA, parentElement: { getAttribute: mockFuncB }, childNodes: [null], innerText: 'displayNameText'
      }
    });
    expect(mockFuncA).toHaveBeenLastCalledWith('src');
    expect(mockFuncB).toHaveBeenLastCalledWith('userid');
    expect(component.state('userList')).toEqual({ userId: { id: 'userId', displayName: 'displayNameText', photo: 'photoSrc' }, oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } });
  });

  test('handleGroupClickCallback', () => {
    sinon.useFakeTimers(new Date(2018, 0, 1));
    const component = getShallowComponent();
    component.setState({ userList: { oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } } });
    component.find('UserPicker').prop('handleGroupClick')({ target: { id: 'id1' } });
    expect(component.state('userList')).toEqual({
      idA: {
        id: 'idA', displayName: 'displayNameA', photo: 'photoA', sharedDate: new Date()
      },
      oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' }
    });
  });

  test('handleRemoveUserCallback', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn().mockReturnValue('oldId');
    component.setState({ userList: { oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } } });
    component.find('UserPicker').prop('handleRemoveUser')({ target: { getAttribute: mockFunc } });
    expect(component.state('userList')).toEqual({});
  });

  test('handleSave', () => {
    const component = getShallowComponent();
    component.setProps({ groupName: 'oldGroupName' });
    component.setState({
      userList: { oldId: { id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' } }, isUpdate: true, groupName: 'groupName'
    });
    const mockFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockFunc });
    component.find('button').at(2).simulate('click');
    expect(defaultProps.updateUserGroup).toHaveBeenLastCalledWith({
      isUpdate: true, newGroupName: 'groupName', oldGroupName: 'oldGroupName', userList: [{ id: 'oldId', displayName: 'oldName', photo: 'oldPhoto' }]
    });
    expect(window.$).toHaveBeenLastCalledWith('#userGroupModal');
    expect(mockFunc).toHaveBeenLastCalledWith('toggle');
  });

  test('button disabled', () => {
    const component = getShallowComponent();
    component.setState({ groupName: '' });
    expect(component.find('button').at(2).prop('disabled')).toBe(true);
    component.setState({ groupName: 'aa', userList: {} });
    expect(component.find('button').at(2).prop('disabled')).toBe(true);
    component.setState({ groupName: 'aa', userList: { id: 'a' } });
    expect(component.find('button').at(2).prop('disabled')).toBe(false);
  });
});
