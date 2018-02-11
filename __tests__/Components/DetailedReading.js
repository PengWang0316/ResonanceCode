import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import DetailedReading from '../../app/Components/DetailedReading';

jest.mock('../../app/Components/LineBigram', () => 'LineBigram');
jest.mock('../../app/Components/AssociatedHexagrams', () => 'AssociatedHexagrams');
jest.mock('../../app/Components/BigramClockSmall', () => 'BigramClockSmall');
jest.mock('../../app/Components/BigramBlockSmall', () => 'BigramBlockSmall');

describe('DetailedReading test', () => {
  const defaultProps = {
    imageInfos: [{ _id: '1', title: 'title1' }, { _id: '2', title: 'title2' }, { _id: '3', title: 'title3' }],
    hexagram: {
      resonance_bigram_question: 'resonance_bigram_question', wave_bigram_question: 'wave_bigram_question', paticle_bigram_question: 'paticle_bigram_question', analysis: 'analysis', question: 'question', overview: 'overview', number: 1
    },
    handleHexagramClick: jest.fn()
  };

  const getShallowComponent = () => shallow(<DetailedReading {...defaultProps} />);

  test('DetailedReading snapshot', () => expect(renderer.create(<DetailedReading {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleHexagramClick', () => {
    const component = getShallowComponent();
    component.find({ id: 1 }).simulate('click');
    expect(defaultProps.handleHexagramClick).toHaveBeenCalledTimes(1);
  });
});
