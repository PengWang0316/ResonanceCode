import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import HexagramImage from '../../app/Components/HexagramImage';

// const mockGetHexagramImageClassNamesArray = jest.fn(() => new Array(6).fill({ side: 'side', middle: 'middle' }));
// const mockGetHexagramBlackImageClassNamesArray = jest.fn(() => new Array(5).fill({ side: 'blackSide', middle: 'blackMiddle' }));
jest.mock('../../app/apis/Util', () => ({ getHexagramImageClassNamesArray: jest.fn(() => new Array(6).fill({ side: 'side', middle: 'middle' })), getHexagramBlackImageClassNamesArray: jest.fn(() => new Array(6).fill({ side: 'blackSide', middle: 'blackMiddle' })) }));

describe('HexagramImage test', () => {
  const defaultProps = {
    imageNumber: '1',
    isFirstImage: true,
    isBlack: true
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<HexagramImage {...props} />);

  test('isBlack', () => {
    const Util = require('../../app/apis/Util');
    getShallowComponent();
    expect(Util.getHexagramBlackImageClassNamesArray).toHaveBeenLastCalledWith('1', true);
  });

  test('isNotBlack', () => {
    const Util = require('../../app/apis/Util');
    getShallowComponent({
      imageNumber: '2',
      isFirstImage: false,
      isBlack: false
    });
    expect(Util.getHexagramImageClassNamesArray).toHaveBeenLastCalledWith('2', false);
  });

  test('HexagramImage snapshot', () => expect(renderer.create(<HexagramImage {...defaultProps} />).toJSON()).toMatchSnapshot());
});
