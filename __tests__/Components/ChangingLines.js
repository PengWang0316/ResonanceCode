import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import ChangingLines from '../../app/Components/ChangingLines';

describe('ChangingLines test', () => {
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
    }
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<ChangingLines {...props} />);

  test('ChangingLines snapshot', () => expect(renderer.create(<ChangingLines {...defaultProps} />).toJSON()).toMatchSnapshot());
});
