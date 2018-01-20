import React from 'react';
import renderer from 'react-test-renderer';

import DetailedReading from '../../app/Components/DetailedReading';

jest.mock('../../app/Components/LineBigram', () => 'LineBigram');

describe('DetailedReading test', () => {
  const defaultProps = { imageInfos: [{ _id: '1', title: 'title1' }, { _id: '2', title: 'title2' }, { _id: '3', title: 'title3' }] };

  test('DetailedReading snapshot', () => expect(renderer.create(<DetailedReading {...defaultProps} />).toJSON()).toMatchSnapshot());
});
