import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { AllJournalListContainer } from '../../../app/Components/containers/AllJournalListContainer';

jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/Pagination', () => 'Pagination');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');
jest.mock('../../../app/Components/JournalRow', () => 'JournalRow');
jest.mock('../../../app/config', () => ({ NUMBER_PER_PAGE_JOURNAL: 1 }));
jest.mock('react-router-dom', () => ({ Link: 'Link' }));

describe('AllJournalListContainer test', () => {
  const defaultProps = {
    user: { isAuth: true },
    allJournal: [{ _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } }],
    fetchAllJournal: jest.fn(),
    checkAuthentication: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<AllJournalListContainer {...props} />);

  test('componentWillMount user authorized allJournal is not empty', () => {
    const mockFetchAllJournal = jest.fn();
    const mockCheckAuthentication = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      fetchAllJournal: mockFetchAllJournal,
      checkAuthentication: mockCheckAuthentication
    });
    expect(mockFetchAllJournal).not.toHaveBeenCalled();
    expect(mockCheckAuthentication).not.toHaveBeenCalled();
    expect(component.instance().state.journals).toEqual([{ _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } }]);
  });

  test('componentWillMount user authorized allJournal is empty', () => {
    const mockFetchAllJournal = jest.fn();
    const mockCheckAuthentication = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      allJournal: [],
      fetchAllJournal: mockFetchAllJournal,
      checkAuthentication: mockCheckAuthentication
    });
    expect(mockFetchAllJournal).toHaveBeenCalledTimes(1);
    expect(mockCheckAuthentication).not.toHaveBeenCalled();
    expect(component.instance().state.journals).toEqual([]);
  });

  test('componentWillMount user is not authorized allJournal is empty', () => {
    const mockFetchAllJournal = jest.fn();
    const mockCheckAuthentication = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      allJournal: [],
      user: { isAuth: false },
      fetchAllJournal: mockFetchAllJournal,
      checkAuthentication: mockCheckAuthentication
    });
    expect(mockFetchAllJournal).not.toHaveBeenCalled();
    expect(mockCheckAuthentication).toHaveBeenCalledTimes(1);
    expect(component.instance().state.journals).toEqual([]);
  });

  test('componentWillReceivedProps fetchAllJournal and setState', () => {
    const mockFetchAllJournal = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      allJournal: [],
      user: { isAuth: false },
      fetchAllJournal: mockFetchAllJournal,
    });
    component.setProps({ user: { isAuth: true }, allJournal: [{ _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } }] });
    expect(mockFetchAllJournal).toHaveBeenCalledTimes(1);
    expect(component.instance().state.journals).toEqual([{ _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } }]);
  });

  test('componentWillReceivedProps does not fetchAllJournal and setState', () => {
    const mockFetchAllJournal = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      allJournal: [{ _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } }],
      fetchAllJournal: mockFetchAllJournal,
    });
    component.setProps({ user: { isAuth: false }, allJournal: [] });
    expect(mockFetchAllJournal).not.toHaveBeenCalled();
  });

  test('changeContent', () => {
    const component = getShallowComponent({
      ...defaultProps,
      allJournal: [
        { _id: 'idA', pingPongStates: { readingId1: 1, readingId2: 2 } },
        { _id: 'idB', pingPongStates: { readingId2: 2, readingId3: 3 } }
      ],
    });
    component.find('Pagination').prop('fetchContent')(1);
    expect(component.instance().state.journals).toEqual([{ _id: 'idB', pingPongStates: { readingId2: 2, readingId3: 3 } }]);
  });

  test('AllJournalListContainer snapshot', () => expect(renderer.create(<AllJournalListContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
