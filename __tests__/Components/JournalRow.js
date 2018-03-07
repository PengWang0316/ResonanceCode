import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { JournalRow } from '../../app/Components/JournalRow';

jest.mock('react-router-dom', () => ({ Link: 'Link' }));

describe('JournalRow test', () => {
  const defaultProps = {
    user: { _id: 'userId' },
    journal: {
      _id: 'journalId',
      date: new Date(2018, 0, 1),
      pingPongStates: null,
      readingIds: null,
      uploadImages: [],
      user_id: 'userId',
      'overview-0': 'test overview',
      'overview-0-isPrivate': false,
      'overview-1': 'test overview 2',
      'overview-1-isPrivate': false,
      'other-2': 'other',
      'other-2-isPrivate': true
    },
    handleClickShareButton: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<JournalRow {...props} />);

  test('Initial with three contents', () => {
    const component = getShallowComponent();
    expect(component.instance().journalContentArray.length).toBe(2);
    expect(component.instance().firstJournalContent).toBeDefined();
    expect(component.instance().firstJournalContent).not.toBeNull();
  });

  /*
  test('Initial with three contents isSharedJournal', () => {
    const component = getShallowComponent({
      ...defaultProps, isSharedJournal: true
    });
    expect(component.instance().journalContentArray.length).toBe(2);
    expect(component.instance().firstJournalContent).toBeDefined();
    expect(component.instance().firstJournalContent).not.toBeNull();
  });
  */

  test('Initial with no content', () => {
    const component = getShallowComponent({
      ...defaultProps,
      journal: {
        _id: 'journalId',
        date: new Date(2018, 0, 1),
        pingPongStates: null,
        readingId: null,
        uploadImages: [],
        user_id: 'userId',
        handleClickShareButton: jest.fn()
      }
    });
    expect(component.instance().journalContentArray.length).toBe(0);
    expect(component.instance().firstJournalContent).toEqual(<div><b>No Content</b></div>);
  });

  test('handleExpandClick', () => {
    const component = getShallowComponent();
    const isExpand = component.state('isExpand');
    component.find({ role: 'button' }).at(0).simulate('click');
    expect(component.state('isExpand')).not.toBe(isExpand);
  });

  test('handleClickShareButton', () => {
    const component = getShallowComponent({ ...defaultProps, readingId: 'readingId' });
    component.find({ title: 'Share options' }).simulate('click');
    expect(defaultProps.handleClickShareButton).toHaveBeenLastCalledWith({ readingId: 'readingId', journalId: 'journalId' });
  });

  test('pingPongState div should render', () => {
    const component = getShallowComponent({ ...defaultProps, journal: { ...defaultProps.journal, pingPongStates: { readingId: 'fackState' } }, isAllJournal: false });
    expect(component.find({ className: 'pingPongState' }).length).toBe(1);
  });

  test('JournalRow snapshot', () => expect(renderer.create(<JournalRow {...defaultProps} />).toJSON()).toMatchSnapshot());
});
