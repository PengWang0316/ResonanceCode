import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { BriefReading } from '../../app/Components/BriefReading';

jest.mock('react-router-dom', () => ({ Link: () => 'Link' }));
jest.mock('../../app/Components/DetailedReading', () => 'DetailedReading');
jest.mock('../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../app/Components/ImageDescription', () => 'ImageDescription');
window.$ = jest.fn(() => ({ modal: jest.fn() }));

describe('BriefReading Test', () => {
  const props = {
    user: { role: 2, _id: 'userId' },
    // bigrams: { readingId: { 1: {}, 2: {} } },
    // fetchLinesBigrams: jest.fn(),
    outputReadingAndJournals: jest.fn(() => new Promise(resolve => resolve())),
    deleteReadingCallback: jest.fn(),
    handleShowModalClick: jest.fn(),
    reading: {
      _id: 'readingId',
      img1Info: {},
      img2Info: {},
      reading_name: 'readingName',
      date: '01-01-2018',
      user_id: 'userId',
      userName: 'userName',
      people: 'people',
      change_lines_text: 'Change lines text',
      journal_entries: [{}]
    },
    isSharedReading: true
  };
  const shallowBriefReading = () => shallow(<BriefReading {...props} />);

  // beforeEach(() => {
  //   shallowBriefReading = shallow(<BriefReading {...props} />);
  // });

  test('handleDelete', () => {
    const briefReading = shallowBriefReading();
    briefReading.find({ title: 'Delete this reading' }).simulate('click');
    expect(props.deleteReadingCallback).toHaveBeenLastCalledWith({
      readingId: props.reading._id, readingName: props.reading.reading_name
    });
  });

  test('handleClick', () => {
    const briefReading = shallowBriefReading();
    briefReading.setState({ isFinishedLoading: false });
    const contentDiv = briefReading.find('#contentDiv');
    contentDiv.simulate('click');
    // expect(props.fetchLinesBigrams).toHaveBeenCalledTimes(1);
    expect(briefReading.state('isExpand')).toBe(true);
    expect(briefReading.state('isFinishedLoading')).toBe(true);
    contentDiv.simulate('click');
    expect(briefReading.state('isExpand')).toBe(false);
  });

  test('handleShowModalClick', () => {
    const briefReading = shallowBriefReading();
    briefReading.find({ title: 'Open shared journal list' }).simulate('click');
    expect(props.handleShowModalClick).toHaveBeenCalled();
  });

  test('outputPdf', () => {
    const briefReading = shallow(<BriefReading {... { ...props, ...{ outputPdfWindowId: 'outputPdfWindowId', isSharedReading: false } }} />);
    // briefReading.instance().props.outputPdfWindowId = 'outputPdfWindowId';
    briefReading.find({ title: 'Out put this reading and it\'s journals to a pdf file' }).simulate('click');
    expect(props.outputReadingAndJournals).toHaveBeenCalled();
    expect(window.$).toHaveBeenCalled();
  });

  test('BriefReading snapshot', () => expect(renderer.create(<BriefReading {...props} />).toJSON()).toMatchSnapshot());
});
