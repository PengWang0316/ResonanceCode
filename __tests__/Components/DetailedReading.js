import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import DetailedReading from '../../app/Components/DetailedReading';

jest.mock('../../app/Components/LineBigram', () => 'LineBigram');
// jest.mock('../../app/Components/AssociatedHexagrams', () => 'AssociatedHexagrams');
jest.mock('../../app/Components/BigramClockSmall', () => 'BigramClockSmall');
jest.mock('../../app/Components/BigramBlockSmall', () => 'BigramBlockSmall');
jest.mock('../../app/Components/Bigram', () => 'Bigram');
jest.mock('../../app/Components/BigramExample', () => 'BigramExample');

describe('DetailedReading test', () => {
  const defaultProps = {
    imageInfos: [{ _id: '1', title: 'title1' }, { _id: '2', title: 'title2' }, { _id: '3', title: 'title3' }],
    hexagram: {
      resonance_bigram_question: 'resonance_bigram_question', wave_bigram_question: 'wave_bigram_question', paticle_bigram_question: 'paticle_bigram_question', analysis: 'analysis', question: 'question', overview: 'overview', number: 1, img_arr: 'img_arr'
    },
    handleHexagramClick: jest.fn()
  };

  const getShallowComponent = () => shallow(<DetailedReading {...defaultProps} />);

  test('DetailedReading no BigramExample snapshot', () => expect(renderer.create(<DetailedReading {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('DetailedReading has BigramExample', () => {
    const component = getShallowComponent();
    expect(component.find('BigramExample').length).toBe(0);
    component.setState({ isShowExample: true });
    expect(component.find('BigramExample').length).toBe(1);
  });

  test('handleHexagramClick', () => {
    const component = getShallowComponent();
    component.find({ id: 'img_arr' }).simulate('click');
    expect(defaultProps.handleHexagramClick).toHaveBeenCalledTimes(1);
  });

  test('handleBigramClick', () => {
    const mockEvent = { stopPropagation: jest.fn() };
    const component = getShallowComponent();
    expect(component.instance().state.isShowExample).toBe(false);
    component.instance().handleBigramClick(mockEvent);
    expect(component.instance().state.isShowExample).toBe(true);
    component.instance().handleBigramClick(mockEvent);
    expect(component.instance().state.isShowExample).toBe(false);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(2);
  });
});
