import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { AddJournalContainer } from '../../../app/Components/containers/AddJournalContainer';

jest.mock('../../../app/Components/JournalForm', () => 'JournalForm');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');

describe('AddJournalContainer test', () => {
  const defaultProps = {
    // journal: PropTypes.object,
    user: {},
    history: { push: jest.fn() },
    isLoading: true,
    checkAuthentication: jest.fn(),
    createJournal: jest.fn(),
    updateJournal: jest.fn(),
    deleteJournal: jest.fn(),
    deleteUnattachedJournal: jest.fn(),
    clearReadings: jest.fn(),
    clearJournalState: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<AddJournalContainer {...props} />);

  test('componentWillMount user has not authorized', () => {
    const component = getShallowComponent();
    expect(defaultProps.checkAuthentication).toHaveBeenCalledTimes(1);
    expect(component.instance().isSubmited).not.toBeUndefined();
    expect(component.instance().isSubmited).toBe(false);
  });

  test('componentWillMount user has authorized', () => {
    const mockFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps, user: { isAuth: true }, checkAuthentication: mockFn
    });
    expect(mockFn).not.toHaveBeenCalled();
    expect(component.instance().isSubmited).not.toBeUndefined();
    expect(component.instance().isSubmited).toBe(false);
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    component.instance().isSubmited = true;
    component.setProps({ isLoading: false });
    expect(defaultProps.clearReadings).toHaveBeenCalledTimes(1);
    expect(defaultProps.history.push).toHaveBeenCalledTimes(1);
  });

  test('handleSubmitCallback update', () => {
    const mockFn = jest.fn();
    const component = getShallowComponent({ ...defaultProps, updateJournal: mockFn });
    component.find('JournalForm').prop('handleSubmit')({
      journalId: 'journalId',
      journalDate: '01-01-2018',
      isUpdate: true,
      readings: {},
      oldReadingIds: ['1', '2']
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(defaultProps.createJournal).not.toHaveBeenCalled();
    expect(component.instance().isSubmited).toBe(true);
  });

  test('handleSubmitCallback create', () => {
    const mockFn = jest.fn();
    const component = getShallowComponent({ ...defaultProps, createJournal: mockFn });
    component.find('JournalForm').prop('handleSubmit')({
      journalId: 'journalId',
      journalDate: '01-01-2018',
      readings: {},
      oldReadingIds: ['1', '2']
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(defaultProps.updateJournal).not.toHaveBeenCalled();
    expect(component.instance().isSubmited).toBe(true);
  });

  test('handleDeleteCallback isUnattachedJournal', () => {
    const mockPushFn = jest.fn();
    const mockDeleteUnattachedJournal = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      history: { push: mockPushFn },
      deleteUnattachedJournal: mockDeleteUnattachedJournal
    });
    component.find('JournalForm').prop('handleDelete')('journalId', [], true);
    expect(defaultProps.clearJournalState).toHaveBeenCalledTimes(1);
    expect(mockDeleteUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(mockPushFn).toHaveBeenCalledTimes(1);
    expect(defaultProps.deleteJournal).not.toHaveBeenCalled();
  });

  test('handleDeleteCallback isAttachedJournal', () => {
    const mockPushFn = jest.fn();
    // const mockClearJournalStateFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps,
      history: { push: mockPushFn }
    });
    component.find('JournalForm').prop('handleDelete')('journalId', [], false);
    expect(defaultProps.clearJournalState).toHaveBeenCalledTimes(2);
    expect(defaultProps.deleteUnattachedJournal).not.toHaveBeenCalled();
    expect(mockPushFn).not.toHaveBeenCalled();
    expect(defaultProps.deleteJournal).toHaveBeenCalledTimes(1);
  });

  test('AddJournalContainer snapshot', () => expect(renderer.create(<AddJournalContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
