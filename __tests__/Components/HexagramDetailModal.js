import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import HexagramDetailModal from '../../app/Components/HexagramDetailModal';

jest.mock('../../app/Components/ImageDescription', () => 'ImageDescription');
jest.mock('../../app/Components/AssociatedHexagrams', () => 'AssociatedHexagrams');

describe('HexagramDetailModal test', () => {
  const defaultProps = {
    hexagram: {
      _id: 'id', number: 1, img_arr: 'img_arr', resonance_code_name: 'resonance_code_name', wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name', image: 'image url', poetry: 'poetry content', overview: 'overview', analysis: 'analysis', question: 'queston'
    },
    handleHexagramClick: jest.fn()
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<HexagramDetailModal {...props} />);

  test('HexagramDetailModal snapshot', () => expect(renderer.create(<HexagramDetailModal {...defaultProps} />).toJSON()).toMatchSnapshot());
});
