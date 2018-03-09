import React from 'react';
import renderer from 'react-test-renderer';

import { AllReadingList } from '../../app/Components/AllReadingList';

jest.mock('../../app/Components/SharedComponents/Pagination', () => 'Pagination');
jest.mock('../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../app/Components/ReadingListRow', () => 'ReadingListRow');

describe('AllReadingList test', () => {
  const props = {
    allReadingList: [{ name: 'testName', date: '2018-01-01' }],
    readingsAmount: 1,
    fetchAllReadingList: jest.fn(),
    handleClick: jest.fn(),
    isLoading: false
  };

  test('AllReadingList snapshot', () => expect(renderer.create(<AllReadingList {...props} />).toJSON()).toMatchSnapshot());
});
