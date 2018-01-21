import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import HexagramImgTable from '../../app/Components/HexagramImgTable';

jest.mock('../../app/Components/HexagramImage', () => 'HexagramImage');

describe('HexagramImgTable test', () => {
  const defaultProps = {
    hexagramsArray: [{
      wilhelm_huang_hintley_name: 'The Creative / Initiating / Heaven',
      img_arr: '1,2,3,4,5,6',
      _id: 'id',
      number: 'number'
    }],
    onCallback: jest.fn()
  };
  // const getShallowComponent = (props = defaultProps) => {};

  test('HexagramImgTable snapshot', () => expect(renderer.create(<HexagramImgTable {...defaultProps} />).toJSON()).toMatchSnapshot());
});
