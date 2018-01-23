import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { JournalSharingModal } from '../../app/Components/JournalSharingModal';

jest.mock('../../app/Components/UserPicker', () => 'UserPicker');

describe('JournalSharingModal test', () => {
  sinon.useFakeTimers(new Date(2018, 0, 1));
  const defaultProps = {
    journal: { _id: 'journalId' },
    users: [{}],
    usersAmount: 5,
    user: {
      _id: 'userId',
      settings: {
        userGroups: {
          'Group A': [
            {
              id: '59f2b6f5ed9baa00546daf8d',
              displayName: 'testnam',
              photo: 'photoA'
            },
            {
              id: '59f39981ad0e48008bffc202',
              displayName: 'usertestuser',
              photo: 'photoB'
            }
          ]
        }
      }
    },
    readingId: 'readingId',
    fetchUsersAmount: jest.fn(),
    fetchAllUserList: jest.fn(),
    updateJournalShareList: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<JournalSharingModal {...props} />);

  test('initial functions called', () => {
    getShallowComponent();
    expect(defaultProps.fetchUsersAmount).toHaveBeenCalledTimes(1);
    expect(defaultProps.fetchAllUserList).toHaveBeenLastCalledWith(0);
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent({ ...defaultProps, journal: {} });
    component.setProps({ journal: { shareList: [{ id: 1 }, { id: 2 }] } });
    expect(component.instance().existedShareList).toEqual([1, 2]);
    expect(Object.keys(component.state('shareList')).length).toBe(2);
  });

  test('handleRemoveUserCallback', () => {
    const component = getShallowComponent();
    component.setState({ shareList: { idA: {}, idB: {} } });
    const mockFunction = jest.fn().mockReturnValue('idA');
    component.find('UserPicker').prop('handleRemoveUser')({ target: { getAttribute: mockFunction } });
    expect(mockFunction).toHaveBeenLastCalledWith('userid');
    expect(component.state('shareList').idA).toBeUndefined();
  });

  test('handleAddUserCallback target has childNodes', () => {
    const component = getShallowComponent();
    const mockGetAttr = jest.fn().mockReturnValue('imageSrc');
    const mockTargeGetAttr = jest.fn().mockReturnValue('newUserId');
    component.find('UserPicker').prop('handleAddUser')({ target: { childNodes: [{ getAttribute: mockGetAttr }], getAttribute: mockTargeGetAttr, innerText: 'innerText' } });
    expect(mockGetAttr).toHaveBeenLastCalledWith('src');
    expect(mockTargeGetAttr).toHaveBeenLastCalledWith('userid');
    expect(component.state('shareList').newUserId).toEqual({
      id: 'newUserId', displayName: 'innerText', photo: 'imageSrc', sharedDate: new Date()
    });
  });

  test('handleAddUserCallback target without childNodes', () => {
    const component = getShallowComponent();
    const mockTargetGetAttr = jest.fn().mockReturnValue('imageSrc');
    const mockParentGetAttr = jest.fn().mockReturnValue('newUserId');
    component.find('UserPicker').prop('handleAddUser')({
      target: {
        getAttribute: mockTargetGetAttr, parentElement: { getAttribute: mockParentGetAttr }, childNodes: [], innerText: 'innerText'
      }
    });
    expect(mockTargetGetAttr).toHaveBeenLastCalledWith('src');
    expect(mockParentGetAttr).toHaveBeenLastCalledWith('userid');
    expect(component.state('shareList').newUserId).toEqual({
      id: 'newUserId', displayName: 'innerText', photo: 'imageSrc', sharedDate: new Date()
    });
  });

  test('handleGroupClickCallback', () => {
    const component = getShallowComponent();
    component.find('UserPicker').prop('handleGroupClick')({ target: { id: 'Group A' } });
    const shareList = component.state('shareList');
    expect(shareList['59f2b6f5ed9baa00546daf8d']).toEqual({
      id: '59f2b6f5ed9baa00546daf8d', displayName: 'testnam', photo: 'photoA', sharedDate: new Date()
    });
    expect(shareList['59f39981ad0e48008bffc202']).toEqual({
      id: '59f39981ad0e48008bffc202', displayName: 'usertestuser', photo: 'photoB', sharedDate: new Date()
    });
  });

  test('handleSave', () => {
    const component = getShallowComponent();
    const mockModalFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFunc });
    component.find('button').at(2).simulate('click');
    expect(defaultProps.updateJournalShareList).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith('#journalSharingModal');
    expect(mockModalFunc).toHaveBeenLastCalledWith('toggle');
  });

  test('JournalSharingModal snapshot', () => expect(renderer.create(<JournalSharingModal {...defaultProps} />).toJSON()).toMatchSnapshot());
});
