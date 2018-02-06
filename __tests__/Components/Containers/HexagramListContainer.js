import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { HexagramListContainer } from '../../../app/Components/containers/HexagramListContainer';

jest.mock('../../../app/Components/HexagramImage', () => 'HexagramImage');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');

describe('HexagramListContainer test', () => {
  const defaultProps = {
    hexagrams: [{
      number: 1, img_arr: 'img_arr', resonance_code_name: 'resonance_code_name', wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name'
    }],
    fetchHexagrams: jest.fn(),
    clearHexagrams: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<HexagramListContainer {...props} />);

  test('componentWillMount no hexagrams in props', () => {
    const mockFetchHexagrams = jest.fn();
    const mockclearHexagrams = jest.fn();
    getShallowComponent({
      hexagrams: [],
      fetchHexagrams: mockFetchHexagrams,
      clearHexagrams: mockclearHexagrams
    });
    expect(mockFetchHexagrams).toHaveBeenCalledTimes(1);
    expect(mockclearHexagrams).toHaveBeenCalledTimes(1);
  });

  test('HexagramListContainer snapshot', () => expect(renderer.create(<HexagramListContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
