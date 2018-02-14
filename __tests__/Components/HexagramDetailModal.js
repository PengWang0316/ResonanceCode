import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import HexagramDetailModal from '../../app/Components/HexagramDetailModal';

jest.mock('../../app/Components/ChangingLines', () => 'ChangingLines');
jest.mock('../../app/Components/ImageDescription', () => 'ImageDescription');
jest.mock('../../app/Components/GroupHexagramTable', () => 'GroupHexagramTable');
jest.mock('../../app/Components/BigramClockBig', () => 'BigramClockBig');
jest.mock('../../app/Components/BigramBlockBig', () => 'BigramBlockBig');

describe('HexagramDetailModal test', () => {
  const defaultProps = {
    hexagram: {
      _id: 'id',
      number: 1,
      img_arr: 'img_arr',
      resonance_code_name: 'resonance_code_name',
      wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
      image: 'image url',
      poetry: 'poetry content',
      overview: 'overview',
      analysis: 'analysis',
      question: 'queston',
      line_13: 0,
      line_25: 0,
      line_46: 0,
      line_14: 0,
      line_36: 0,
      changing_lines: {
        line1: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_13: [1, 1],
          line_14: [1, 1]
        },
        line2: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_25: [1, 1]
        },
        line3: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_13: [1, 1],
          line_36: [1, 1]
        },
        line4: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_46: [1, 1],
          line_14: [1, 1]
        },
        line5: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_25: [1, 1]
        },
        line6: {
          img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
          line_46: [1, 1],
          line_36: [1, 1]
        }
      }
    },
    hexagramsImgArrMap: {
      '7,9-7,9-7,9-7,9-7,9-7,9': { _id: 'id', number: 'number', resonance_code_name: 'code name' }
    },
    handleHexagramClick: jest.fn()
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<HexagramDetailModal {...props} />);

  test('HexagramDetailModal snapshot', () => expect(renderer.create(<HexagramDetailModal {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('HexagramDetailModal has poetry font size snapshot', () => expect(renderer.create(<HexagramDetailModal {...{
 hexagram: {
    _id: 'id',
    number: 1,
    img_arr: 'img_arr',
    resonance_code_name: 'resonance_code_name',
    wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
    image: 'image url',
    poetry: 'poetry content',
    overview: 'overview',
    analysis: 'analysis',
    question: 'queston',
    line_13: 0,
    line_25: 0,
    line_46: 0,
    line_14: 0,
    line_36: 0,
    poetry_font_size: 18,
    changing_lines: {
      line1: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_13: [1, 1],
        line_14: [1, 1]
      },
      line2: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_25: [1, 1]
      },
      line3: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_13: [1, 1],
        line_36: [1, 1]
      },
      line4: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_46: [1, 1],
        line_14: [1, 1]
      },
      line5: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_25: [1, 1]
      },
      line6: {
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        line_46: [1, 1],
        line_16: [1, 1]
      }
    }
  },
  handleHexagramClick: jest.fn(),
  hexagramsImgArrMap: {
    '7,9-7,9-7,9-7,9-7,9-7,9': { _id: 'id', number: 'number', resonance_code_name: 'code name' }
  }
}}
  />).toJSON()).toMatchSnapshot());
});
