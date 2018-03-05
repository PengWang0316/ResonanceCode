import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import ImageDescription from '../../app/Components/ImageDescription';

jest.mock('../../app/Components/HexagramImage', () => 'HexagramImage');

describe('ImageDescription test', () => {
  const defaultProps = {
    imageInfo: {
      image_text: 'imageText',
      number: 'number',
      chinese_name: 'chineseName',
      wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
      rc_description: 'rc_description'
    },
    imageNumber: '1',
    isFirstImage: true,
    isShowRc: true
  };
  // const getShallowComponent = (props = defaultProps) => shallow(< {...props} />);;

  test('ImageDescription has resonance code name snapshot', () => expect(renderer.create(<ImageDescription {...{
    ...defaultProps,
    imageInfo: {
      image_text: 'imageText',
      number: 'number',
      chinese_name: 'chineseName',
      wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
      rc_description: 'rc_description',
      resonance_code_name: 'new rc name'
    }
  }}
  />).toJSON()).toMatchSnapshot());

  test('ImageDescription has no resonance code name snapshot', () => expect(renderer.create(<ImageDescription {...defaultProps} />).toJSON()).toMatchSnapshot());
});
