import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { TOTAL_NUMBER_HEXAGRAM } from '../../app/config';
import { HexagramDetailModal } from '../../app/Components/HexagramDetailModal';

jest.mock('../../app/Components/ChangingLines', () => 'ChangingLines');
jest.mock('../../app/Components/ImageDescription', () => 'ImageDescription');
jest.mock('../../app/Components/GroupHexagramTable', () => 'GroupHexagramTable');
jest.mock('../../app/Components/BigramClockBig', () => 'BigramClockBig');
jest.mock('../../app/Components/BigramBlockBig', () => 'BigramBlockBig');
jest.mock('../../app/Components/Bigram', () => 'Bigram');
jest.mock('../../app/Components/BigramExample', () => 'BigramExample');


describe('HexagramDetailModal test', () => {
  const defaultProps = {
    hexagrams: [
      {
        _id: 'id2',
        number: 2
      },
      {
        _id: 'id',
        number: 1,
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
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
      }
    ],
    hexagramArr: '',
    hexagramsImgArrMap: {
      '7,9-7,9-7,9-7,9-7,9-7,9': { _id: 'id', number: 'number', resonance_code_name: 'code name' }
    },
    handleHexagramClick: jest.fn(),
    fetchHexagrams: jest.fn(),
    clearHexagrams: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<HexagramDetailModal {...props} />);

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

  test('componentWillMount has hexagrams in props', () => {
    const mockFetchHexagrams = jest.fn();
    const mockclearHexagrams = jest.fn();
    const hexagramArray = new Array(TOTAL_NUMBER_HEXAGRAM);
    hexagramArray[0] = { img_arr: '79', _id: 1 };
    const component = getShallowComponent({
      hexagrams: hexagramArray,
      fetchHexagrams: mockFetchHexagrams,
      clearHexagrams: mockclearHexagrams
    });
    expect(mockFetchHexagrams).toHaveBeenCalledTimes(0);
    expect(mockclearHexagrams).toHaveBeenCalledTimes(0);
    // expect(component.instance().hexagramsImgArrMap['79']).not.toBeUndefined();
  });

  test('componentWillReceiveProps', () => {
    const hexagramArray = new Array(TOTAL_NUMBER_HEXAGRAM);
    hexagramArray[0] = { img_arr: '68', _id: 1 };
    const mockFetchHexagrams = jest.fn().mockReturnValue(hexagramArray);
    const mockclearHexagrams = jest.fn();
    const component = getShallowComponent({
      hexagrams: [],
      fetchHexagrams: mockFetchHexagrams,
      clearHexagrams: mockclearHexagrams
    });
    expect(mockFetchHexagrams).toHaveBeenCalledTimes(1);
    expect(mockclearHexagrams).toHaveBeenCalledTimes(1);
    expect(component.instance().hexagramsImgArrMap).toBeUndefined();

    component.setProps({ hexagrams: hexagramArray });
    expect(component.instance().hexagramsImgArrMap['68']).not.toBeUndefined();
  });

  test('handleAssociatedHexagramClick', () => {
    const component = getShallowComponent();
    // Prepare the this.hexagrams data for the test.
    // component.find('tr').at(1).simulate('click', { target: { parentNode: { nodeName: 'TR', id: '1', getAttribute: jest.fn().mockReturnValue('1') } } });
    component.setState({
      hexagram: {
        _id: 'newId',
        number: 1,
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        resonance_code_name: 'resonance_code_name',
        wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
        image: 'image url',
        poetry: 'poetry content',
        poetry_font_size: 18,
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
      }
    });
    // HexagramListContainer.getHexagramBaseOnTarget = jest.fn().mockReturnValue({ id: 'newId' });
    component.find('GroupHexagramTable').at(0).prop('handleHexagramClick')({ target: { parentNode: { nodeName: 'TR', number: '2', getAttribute: jest.fn().mockReturnValue('2') } } });
    expect(component.instance().hexagramNumbersMap[1]._id).toBe('id');
    expect(component.instance().state.hexagram._id).toBe('id2');
    // expect(component.state('hexagram')).toBe(defaultProps.hexagrams[2]);
  });

  test('handleBigramClick', () => {
    const component = getShallowComponent();
    expect(component.instance().state.isShowExample).toBe(false);
    component.instance().handleBigramClick();
    expect(component.instance().state.isShowExample).toBe(true);
    component.instance().handleBigramClick();
    expect(component.instance().state.isShowExample).toBe(false);
  });

  test('has BigramExample', () => {
    const component = getShallowComponent();
    component.setState({ hexagram: true });
    expect(component.find('BigramExample').length).toBe(0);
    component.setState({ isShowExample: true });
    expect(component.find('ChangingLines').length).toBe(1);
  });

  /* Using this method to add snapshot will cause a "unique key" warnning.
     More investigation needed.
  test('HexagramDetailModal snapshot', () => {
    const component = getShallowComponent();
    component.instance().hexagramsImgArrMap = {
      '7,9-7,9-7,9-7,9-7,9-7,9': {
        _id: 'id',
        number: 1,
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
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
      }
    };
    component.setProps({ hexagramArr: '7,9-7,9-7,9-7,9-7,9-7,9' });
    expect(renderer.create(component).toJSON()).toMatchSnapshot();
  });

  test('HexagramDetailModal has poetry font size snapshot', () => {
    const component = getShallowComponent();
    component.instance().hexagramsImgArrMap = {
      '7,9-7,9-7,9-7,9-7,9-7,9': {
        _id: 'id',
        number: 1,
        img_arr: '7,9-7,9-7,9-7,9-7,9-7,9',
        resonance_code_name: 'resonance_code_name',
        wilhelm_huang_hintley_name: 'wilhelm_huang_hintley_name',
        image: 'image url',
        poetry: 'poetry content',
        poetry_font_size: 18,
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
      }
    };
    component.setProps({ hexagramArr: '7,9-7,9-7,9-7,9-7,9-7,9' });
    expect(renderer.create(component).toJSON()).toMatchSnapshot();
  });*/
});
