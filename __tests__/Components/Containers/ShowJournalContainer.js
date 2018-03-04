import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { ShowJournalContainer } from '../../../app/Components/containers/ShowJournalContainer';

jest.mock('../../../app/Components/containers/AddJournalContainer', () => 'AddJournalContainer');
jest.mock('query-string', () => jest.fn());

describe('ShowJournalContainer test', () => {
  const defaultProps = {
    journal: { _id: 'id' },
    location: { search: 'search text' },
    fetchJournal: jest.fn(),
    fetchUnattachedJournal: jest.fn(),
    history: { push: jest.fn() }
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<ShowJournalContainer {...props} />);

  test('componentWillMount isAttachedJounal', () => {
    const mockParseFn = jest.fn().mockReturnValue({ isAttachedJournal: true, journalId: 'journal id' });
    const QueryString = require('query-string');
    QueryString.parse = mockParseFn;
    getShallowComponent();
    expect(mockParseFn).toHaveBeenLastCalledWith('search text');
    expect(defaultProps.fetchJournal).toHaveBeenLastCalledWith('journal id');
    expect(defaultProps.fetchUnattachedJournal).not.toHaveBeenCalled();
  });

  test('componentWillMount isUnAttachedJounal', () => {
    const mockParseFn = jest.fn().mockReturnValue({ isAttachedJournal: 'null', journalId: 'journal id' });
    const QueryString = require('query-string');
    QueryString.parse = mockParseFn;
    getShallowComponent();
    expect(mockParseFn).toHaveBeenLastCalledWith('search text');
    expect(defaultProps.fetchJournal).toHaveBeenCalledTimes(1);
    expect(defaultProps.fetchUnattachedJournal).toHaveBeenLastCalledWith('journal id');
  });

  test('componentWillReceiveProps same journals', () => {
    const component = getShallowComponent();
    component.setProps({ journal: {} });
    expect(defaultProps.history.push).not.toHaveBeenCalled();
  });

  test('componentWillReceiveProps different journals', () => {
    const component = getShallowComponent();
    component.setProps({ journal: null });
    expect(defaultProps.history.push).toHaveBeenLastCalledWith('/reading');
  });

  test('ShowJournalContainer snapshot', () => expect(renderer.create(<ShowJournalContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
