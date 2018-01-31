import React from 'react';
import renderer from 'react-test-renderer';

import DetailedReading from '../../app/Components/DetailedReading';

jest.mock('../../app/Components/LineBigram', () => 'LineBigram');

describe('DetailedReading test', () => {
  const defaultProps = {
    imageInfos: [{ _id: '1', title: 'title1' }, { _id: '2', title: 'title2' }, { _id: '3', title: 'title3' }],
    hexagram: {
      resonance_bigram_question: 'resonance_bigram_question', wave_bigram_question: 'wave_bigram_question', paticle_bigram_question: 'paticle_bigram_question', notes: 'notes'
    }
  };

  test('DetailedReading snapshot', () => expect(renderer.create(<DetailedReading {...defaultProps} />).toJSON()).toMatchSnapshot());
});
