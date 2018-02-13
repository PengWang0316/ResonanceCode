import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { HexagramListContainer } from '../../../app/Components/containers/HexagramListContainer';

jest.mock('../../../app/Components/HexagramImage', () => 'HexagramImage');
jest.mock('../../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');
jest.mock('../../../app/Components/HexagramDetailModal', () => 'HexagramDetailModal');

describe('HexagramListContainer test', () => {
  const defaultProps = {
    hexagrams: [
      {
        _id: 'id', number: 1, img_arr: 'img_arr', resonance_code_name: 'resonance_code_name', wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name'
      },
      {
        _id: 'id2', number: 2, img_arr: 'img_arr', resonance_code_name: 'resonance_code_name', wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name'
      },
      {
        _id: 'id3', number: 3, img_arr: 'img_arr', resonance_code_name: 'resonance_code_name', wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name'
      }
    ],
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

  test('handleHexagramClick', () => {
    const mockModalFunc = jest.fn();
    window.$ = jest.fn().mockReturnValue({ modal: mockModalFunc });
    const component = getShallowComponent();
    const trElement = component.find('tr').at(1);
    expect(() => trElement.simulate('click', { target: { parentNode: { nodeName: 'TBODY' } } })).toThrowError('Missing attribute.');
    expect(window.$).not.toHaveBeenCalled();
    expect(mockModalFunc).not.toHaveBeenCalled();

    trElement.simulate('click', { target: { parentNode: { nodeName: 'TR', id: '1', getAttribute: jest.fn().mockReturnValue('1') } } });
    expect(component.state('hexagram')).toBe(defaultProps.hexagrams[0]);
    expect(window.$).toHaveBeenCalledTimes(1);
    expect(mockModalFunc).toHaveBeenCalledTimes(1);

    trElement.simulate('click', { target: { parentNode: { nodeName: 'DIV', parentNode: { nodeName: 'TR', id: '2', getAttribute: jest.fn().mockReturnValue('2') } } } });
    expect(component.state('hexagram')).toBe(defaultProps.hexagrams[1]);
    expect(window.$).toHaveBeenCalledTimes(2);
    expect(mockModalFunc).toHaveBeenCalledTimes(2);
  });

  test('handleAssociatedHexagramClick', () => {
    const component = getShallowComponent();
    // Prepare the this.hexagrams data for the test.
    component.find('tr').at(1).simulate('click', { target: { parentNode: { nodeName: 'TR', id: '1', getAttribute: jest.fn().mockReturnValue('1') } } });
    component.find('HexagramDetailModal').prop('handleHexagramClick')({ target: { parentNode: { nodeName: 'TR', number: '3', getAttribute: jest.fn().mockReturnValue('3') } } });
    expect(component.state('hexagram')).toBe(defaultProps.hexagrams[2]);
  });

  test('HexagramListContainer snapshot', () => expect(renderer.create(<HexagramListContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
