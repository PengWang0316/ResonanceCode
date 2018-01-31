import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

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
    }
  };
  // const getShallowComponent = (props = defaultProps) => shallow(< {...props} />);

  test('AssociatedHexagrams snapshot', () => expect(renderer.create(<AssociatedHexagrams {...defaultProps} />).toJSON()).toMatchSnapshot());
});
