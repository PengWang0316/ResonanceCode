import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import AssociatedHexagrams from '../../app/Components/AssociatedHexagrams';

jest.mock('../../app/Components/HexagramImage', () => 'HexagramImage');

describe('AssociatedHexagrams test', () => {
  const defaultProps = {
    hexagram: {
      complementary_hexagram_number: 'complementary_hexagram_number',
      complementary_hexagram: 'complementary_hexagram',
      complementary_hexagram_code: 'complementary_hexagram_code',
      reverse_hexagram_number: 'reverse_hexagram_number',
      reverse_hexagram: 'reverse_hexagram',
      reverse_hexagram_code: 'reverse_hexagram_code',
      hidden_influence_hexagram_number: 'hidden_influence_hexagram_number',
      hidden_influence_hexagram: 'hidden_influence_hexagram',
      hidden_influence_hexagram_code: 'hidden_influence_hexagram_code',
    },
    handleHexagramClick: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<AssociatedHexagrams {...props} />);

  test('AssociatedHexagrams snapshot', () => expect(renderer.create(<AssociatedHexagrams {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleHexagramClick click', () => {
    const component = getShallowComponent();
    component.find({ role: 'button' }).at(0).simulate('click');
    expect(defaultProps.handleHexagramClick).toHaveBeenLastCalledWith('complementary_hexagram_number');
    component.find({ role: 'button' }).at(1).simulate('click');
    expect(defaultProps.handleHexagramClick).toHaveBeenLastCalledWith('reverse_hexagram_number');
    component.find({ role: 'button' }).at(2).simulate('click');
    expect(defaultProps.handleHexagramClick).toHaveBeenLastCalledWith('hidden_influence_hexagram_number');
  });
});
