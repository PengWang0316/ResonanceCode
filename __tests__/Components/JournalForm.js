import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { JournalForm } from '../../app/Components/JournalForm';

// jest.mock('../../app/apis/Util', () => ({
//   matchDateFormat: jest.fn(),
//   getDateString: jest.fn(),
//   getCurrentDateString: jest.fn('01/02/2018')
// }));
jest.mock('../../app/Components/JournalContent', () => 'JournalContent');
jest.mock('../../app/Components/ReadingSearchAndList', () => 'ReadingSearchAndList');
jest.mock('../../app/Components/ImageUpload', () => 'ImageUpload');
jest.mock('../../app/actions/JournalActions', () => ({ deleteUploadImages: jest.fn() }));
jest.mock('jquery', () => jest.fn().mockReturnValue({ datepicker: jest.fn() }));
// window.jQuery = () => ({ datepicker: jest.fn() });
jest.mock('../../app/resources/jquery-ui.min', () => {});
describe('JournalForm test', () => {
  sinon.useFakeTimers(new Date(2018, 0, 2));
  const defaultProps = {
    journalData: {
      _id: 'journalId',
      date: new Date(2018, 0, 1),
      pingPongStates: null,
      readingIds: null,
      uploadImages: [],
      user_id: 'id',
      'overview-0': 'test overview',
      'overview-0-isPrivate': false,
      'overview-1': 'test overview 2',
      'overview-1-isPrivate': false,
      'other-2': 'other',
      'other-2-isPrivate': true
    },
    isWriting: false,
    history: { push: jest.fn() },
    handleSubmit: jest.fn(),
    handleDelete: jest.fn(),
    user: { _id: 'id' },
    clearJournalState: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<JournalForm {...props} />);

  test('intial states', () => {
    const component = getShallowComponent();
    expect(component.state('journalDate')).toBe('01/01/2018');
    expect(component.state('isDateCorrect')).toBeTruthy();
    expect(component.state('contentComponentArray').length).toBe(3);
    expect(component.state('addJournalContent')).toBe('overview_and_question');
    expect(component.state('uploadImages').length).toBe(0);
    expect(component.state('readings')).toEqual({});
    expect(component.state('readingIds')).toBeNull();

    const componentB = getShallowComponent({ ...defaultProps, journalData: null });
    expect(componentB.state('journalDate')).toBe('01/02/2018');

    const componentC = getShallowComponent({
      ...defaultProps,
      journalData: {
        _id: 'journalId',
        date: new Date(2018, 0, 1),
        pingPongStates: 'pingPongStates',
        readingIds: { id: 1 },
        uploadImages: [],
        user_id: 'id',
        'overview-0': 'test overview',
        'overview-0-isPrivate': false,
        'overview-1': 'test overview 2',
        'overview-1-isPrivate': false,
        'other-2': 'other',
        'other-2-isPrivate': true
      }
    });
    expect(componentC.state('readings')).toBe('pingPongStates');
    expect(componentC.state('readingIds')).toEqual({ id: 1 });
    expect(componentC.instance().oldReadingIds).toEqual(['id']);
  });

  test('componentDidMount', () => {
    getShallowComponent();
    const jquery = require('jquery');
    expect(jquery).toHaveBeenLastCalledWith('#journalDate');
    expect(jquery().datepicker).toHaveBeenCalled();
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    expect(component.state('journalDate')).toBe('01/01/2018');
    component.setProps({
      journalData: {
        _id: 'newJournalId',
        date: new Date(2018, 1, 1),
        pingPonegStates: null,
        readingIds: null,
        uploadImages: [1, 2]
      }
    });
    expect(component.state('journalDate')).toBe('02/01/2018');
    // expect(component.state('uploadImages').length).toBe(2);
  });

  test('handleAddContentClick', () => {
    const component = getShallowComponent();
    expect(component.state('contentComponentArray').length).toBe(3);
    component.find({ role: 'button' }).simulate('click');
    expect(component.state('contentComponentArray').length).toBe(4);
    component.find({ role: 'button' }).simulate('click');
    expect(component.state('contentComponentArray').length).toBe(5);
  });

  test('handleChangeCallback', () => {
    const component = getShallowComponent();
    expect(component.instance().contents['overview-0']).toBe('test overview');
    expect(component.instance().contents['overview-1']).toBe('test overview 2');
    expect(component.instance().contents['other-2']).toBe('other');
    const journalContents = component.find('JournalContent');
    journalContents.at(0).prop('handleChangeCallback')('overview-0', 'new content A');
    journalContents.at(0).prop('handleChangeCallback')('overview-1', 'new content B');
    journalContents.at(0).prop('handleChangeCallback')('other-2', 'new content C');
    expect(component.instance().contents['overview-0']).toBe('new content A');
    expect(component.instance().contents['overview-1']).toBe('new content B');
    expect(component.instance().contents['other-2']).toBe('new content C');
  });

  test('handleDeleteContentCallback', () => {
    const component = getShallowComponent();
    expect(component.find('JournalContent').length).toBe(3);
    expect(component.instance().contents['overview-0']).toBe('test overview');
    expect(component.instance().contents['overview-0-isPrivate']).toBeFalsy();
    component.find('JournalContent').at(0).prop('handleDeleteContentCallback')('overview-0');
    expect(component.state('contentComponentArray').length).toBe(2);
    expect(component.instance().contents['overview-0']).toBeUndefined();
    expect(component.instance().contents['overview-0-isPrivate']).toBeUndefined();
  });

  test('handleChange', () => {
    const component = getShallowComponent();
    component.find('select').simulate('change', { target: { id: 'addJournalContent', value: 'thinking' } });
    expect(component.state('addJournalContent')).toBe('thinking');
    component.find('input').simulate('change', { target: { id: 'journalDate', value: 'not a date' } });
    expect(component.state('isDateCorrect')).toBeFalsy();
    component.find('input').simulate('change', { target: { id: 'journalDate', value: '01/01/2018' } });
    expect(component.state('isDateCorrect')).toBeTruthy();
    expect(component.state('journalDate')).toBe('01/01/2018');
  });

  test('handleKeyPress', () => {
    const component = getShallowComponent();
    const mockPreventDefaultA = jest.fn();
    component.find('input').simulate('keypress', { charCode: 1, preventDefault: mockPreventDefaultA });
    expect(mockPreventDefaultA).not.toHaveBeenCalled();
    const mockPreventDefaultB = jest.fn();
    component.find('input').simulate('keypress', { charCode: 13, preventDefault: mockPreventDefaultB });
    expect(mockPreventDefaultB).toHaveBeenCalled();
  });

  test('handleAttachReadingCallback', () => {
    const component = getShallowComponent();
    const readingId = 'newReadingId';
    expect(component.state('readings')[readingId]).toBeUndefined();
    component.find('ReadingSearchAndList').prop('attachReadingCallback')(readingId);
    expect(component.state('readings')[readingId]).toBe('Neutral');
  });

  test('handlePingpongstateChangeCallback', () => {
    const component = getShallowComponent();
    const readingId = 'newReadingId';
    expect(component.state('readings')[readingId]).toBeUndefined();
    component.find('ReadingSearchAndList').prop('handlePingpongstateChangeCallback')(readingId, 'newPingPongState');
    expect(component.state('readings')[readingId]).toBe('newPingPongState');
  });

  test('handleDetachAttachReadingCallback', () => {
    const component = getShallowComponent();
    const readingId = 'newReadingId';
    component.find('ReadingSearchAndList').prop('attachReadingCallback')(readingId);
    expect(component.state('readings')[readingId]).toBe('Neutral');
    component.find('ReadingSearchAndList').prop('detachReadingCallback')(readingId);
    expect(component.state('readings')[readingId]).toBeUndefined();
  });

  test('handleCancel', () => {
    const component = getShallowComponent();
    const actions = require('../../app/actions/JournalActions');
    component.instance().newImages = [1];
    component.find('button').at(2).simulate('click');
    expect(defaultProps.clearJournalState).toHaveBeenCalledTimes(1);
    expect(actions.deleteUploadImages).toHaveBeenCalledTimes(1);
    expect(defaultProps.history.push).toHaveBeenLastCalledWith('/reading');
  });

  test('handleDelete', () => {
    const component = getShallowComponent();
    const mockPreventDefault = jest.fn();
    const actions = require('../../app/actions/JournalActions');
    actions.deleteUploadImages = jest.fn();
    component.setState({ uploadImages: [{ id: 1 }] });
    component.find('button').at(1).simulate('click', { preventDefault: mockPreventDefault });
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleDelete).toHaveBeenCalledTimes(1);
    expect(actions.deleteUploadImages).toHaveBeenCalledTimes(1);
  });

  test('handleSubmit', () => {
    const component = getShallowComponent();
    const mockPreventDefault = jest.fn();
    const actions = require('../../app/actions/JournalActions');
    actions.deleteUploadImages = jest.fn();
    component.instance().deleteImages = [1];
    component.find('form').simulate('submit', { preventDefault: mockPreventDefault });
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleSubmit).toHaveBeenCalledTimes(1);
    expect(actions.deleteUploadImages).toHaveBeenCalledTimes(1);
  });

  test('handleImageDropCallback', () => {
    const component = getShallowComponent();
    component.setState({ uploadImages: [1] });
    component.instance().newImages = [{ id: 0 }];
    component.find('ImageUpload').prop('imageDropCallback')([{ id: 1 }, { id: 2 }]);
    expect(component.state('uploadImages').length).toBe(3);
    expect(component.instance().newImages.length).toBe(3);
  });

  test('handleDeleteImageCallback', () => {
    const component = getShallowComponent();
    component.setState({ uploadImages: [{ filePublicId: 0 }] });
    expect(component.instance().deleteImages.length).toBe(0);
    component.find('ImageUpload').prop('deleteImageCallback')('filePublicId');
    expect(component.instance().deleteImages[0]).toBe('filePublicId');
    expect(component.state('uploadImages').length).toBe(0);
  });

  test('handleSharedBoxChangeCallback', () => {
    const component = getShallowComponent();
    expect(component.instance().contents['overview-1-isPrivate']).toBeFalsy();
    expect(component.instance().contents['other-2-isPrivate']).toBeTruthy();
    component.find('JournalContent').at(0).prop('handleSharedBoxChangeCallback')('overview-1', true);
    component.find('JournalContent').at(0).prop('handleSharedBoxChangeCallback')('other-2', false);
    expect(component.instance().contents['overview-1-isPrivate']).toBeTruthy();
    expect(component.instance().contents['other-2-isPrivate']).toBeFalsy();
  });

  // test('No JournalData', () => {
  //   getShallowComponent({ ...defaultProps, journalData: null });
  // });

  test('JournalForm snapshot', () => expect(renderer.create(<JournalForm {...defaultProps} />).toJSON()).toMatchSnapshot());
});
