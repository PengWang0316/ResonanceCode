import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { JournalList } from '../../app/Components/JournalList';

jest.mock('../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');
jest.mock('../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../app/Components/JournalRow', () => 'JournalRow');
jest.mock('../../app/Components/JournalSharingModal', () => 'JournalSharingModal');

describe('JournalList test', () => {
  const defaultProps = {
    user: { isAuth: true },
    journals: [{ _id: 'journalIdA' }],
    fetchUnattachedJournals: jest.fn(),
    fetchJournals: jest.fn(),
    checkAuthentication: jest.fn(),
    fetchJournalBasedOnReadingJournal: jest.fn(),
    clearJournalState: jest.fn(),
    clearJournalsState: jest.fn(),
    location: { search: '?readingId=5a4c23b9b312d207e341bdc3&readingName=test%2024' }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<JournalList {...props} />);

  test('componentWillMount authed and has readingId', () => {
    getShallowComponent();
    expect(defaultProps.fetchJournals).toHaveBeenLastCalledWith('5a4c23b9b312d207e341bdc3');
  });

  test('componentWillMount authed and no readingId', () => {
    getShallowComponent({ ...defaultProps, location: { search: '' } });
    expect(defaultProps.fetchUnattachedJournals).toHaveBeenCalledTimes(1);
  });

  test('componentWillMount no authed', () => {
    getShallowComponent({ ...defaultProps, user: { isAuth: false } });
    expect(defaultProps.checkAuthentication).toHaveBeenCalledTimes(1);
  });

  test('componentWillReceiveProps fetchJournals and url changed', () => {
    const component = getShallowComponent();
    expect(component.instance().readingName).toBe('test 24');
    expect(component.instance().readingId).toBe('5a4c23b9b312d207e341bdc3');
    component.setProps({ ...defaultProps, location: { search: '?readingId=66666&readingName=test%2025' } });
    expect(defaultProps.fetchJournals).toHaveBeenLastCalledWith('66666');
    expect(component.instance().readingName).toBe('test 25');
    expect(component.instance().readingId).toBe('66666');
  });

  test('componentWillReceiveProps fetchUnattachedJournals and url changed', () => {
    const mockFunction = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      location: { search: null },
      user: { isAuth: false },
      fetchUnattachedJournals: mockFunction
    });
    component.setProps({
      ...defaultProps, location: { search: null }, user: { isAuth: true }
    });
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('handleClickShareButtonCallback', () => {
    const component = getShallowComponent();
    const mockModal = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModal });
    const callParameter = { readingId: 'readingId', journalId: 'journalId' };
    component.find('JournalRow').prop('handleClickShareButton')(callParameter);
    expect(defaultProps.clearJournalState).toHaveBeenCalledTimes(1);
    expect(defaultProps.fetchJournalBasedOnReadingJournal).toHaveBeenLastCalledWith(callParameter);
    expect(window.$).toHaveBeenLastCalledWith('#journalSharingModal');
    expect(mockModal).toHaveBeenLastCalledWith('toggle');
  });

  test('JournalList snapshot', () => expect(renderer.create(<JournalList {...defaultProps} />).toJSON()).toMatchSnapshot());
});
