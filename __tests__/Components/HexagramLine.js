import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { HexagramLine } from '../../app/Components/HexagramLine';

jest.mock('../../app/Components/ChooseCoin', () => 'ChooseCoin');
jest.mock('../../app/Components/ChooseHexagramLines', () => 'ChooseHexagramLines');

describe('HexagramLine test', () => {
  const defaultProps = {
    lineNumber: '1',
    handleCoinClick: jest.fn(),
    side: 'side',
    middle: 'middle',
    isFirst: true,
    readings: [{}],
    user: { settings: { coinMode: true } }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<HexagramLine {...props} />);

  test('initial states', () => {
    const component = getShallowComponent();
    expect(component.state('isShowCoins')).toBeFalsy();
    expect(component.state('isRecorded')).toBeFalsy();
    expect(component.state('headsTails')).toBe('');
    expect(component.state('coinMode')).toBeTruthy();
  });

  test('handleDivClick', () => {
    const component = getShallowComponent();
    expect(component.state('isShowCoins')).toBeFalsy();
    component.find({ role: 'button' }).simulate('click');
    expect(component.state('isShowCoins')).toBeTruthy();
    component.setState({ isRecorded: false });
    component.find({ role: 'button' }).simulate('click');
    expect(component.state('isShowCoins')).toBeFalsy();
  });

  test('ChooseCoin showing up', () => {
    const component = getShallowComponent({ ...defaultProps, isFirst: false });
    expect(component.find('ChooseCoin').length).toBe(0);
    component.setState({ isShowCoins: true });
    expect(component.find('ChooseCoin').length).toBe(1);
  });

  test('ChooseHexagramLines showing up', () => {
    const component = getShallowComponent();
    expect(component.find('ChooseHexagramLines').length).toBe(0);
    component.setState({ isShowCoins: true, coinMode: false });
    expect(component.find('ChooseHexagramLines').length).toBe(1);
  });

  test('handleDivClick', () => {
    const component = getShallowComponent();
    expect(component.state('isShowCoins')).toBeFalsy();
    component.find({ role: 'button' }).prop('onClick')();
    expect(component.state('isShowCoins')).toBeTruthy();
  });

  test('handleCancel', () => {
    const component = getShallowComponent();
    component.setState({ isShowCoins: true, coinMode: false });
    component.find('ChooseHexagramLines').prop('handleCancel')();
    expect(component.state('isShowCoins')).toBeFalsy();
  });

  test('handleCoinClick', () => {
    const component = getShallowComponent();
    component.setState({ isShowCoins: true, coinMode: false });
    component.find('ChooseHexagramLines').prop('handleCoinClick')('4', 'coins', 'headsTails');
    expect(component.state('isRecorded')).toBeTruthy();
    expect(component.state('headsTails')).toBe('headsTails');
    expect(defaultProps.handleCoinClick).toHaveBeenLastCalledWith('4', 'coins');
  });

  test('handleCoinClick is not first', () => {
    const handleCoinClick = jest.fn();
    const component = getShallowComponent({ ...defaultProps, isFirst: false, handleCoinClick });
    component.setState({ isShowCoins: true, coinMode: false });
    component.find('ChooseHexagramLines').prop('handleCoinClick')('4', 'coins', 'headsTails');
    expect(component.state('isRecorded')).toBeFalsy();
    expect(component.state('headsTails')).toBe('');
    expect(handleCoinClick).not.toHaveBeenCalled();
  });

  test('handleSwitchModeCallback', () => {
    const component = getShallowComponent();
    component.setState({ isShowCoins: true, coinMode: false });
    component.find('ChooseHexagramLines').prop('handleSwitchMode')();
    expect(component.state('coinMode')).toBeTruthy();
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    component.setState({
      isShowCoins: true,
      isRecorded: true,
      headsTails: 'headsTails',
      coinMode: false
    });
    component.setProps({ readings: [{}, {}] });
    expect(component.state('isShowCoins')).toBeFalsy();
    expect(component.state('isRecorded')).toBeFalsy();
    expect(component.state('headsTails')).toBe('');
    expect(component.state('coinMode')).toBeTruthy();
  });

  test('componentWillReceiveProps readings\' length are same', () => {
    const component = getShallowComponent();
    component.setState({
      isShowCoins: true,
      isRecorded: true,
      headsTails: 'headsTails',
      coinMode: false
    });
    component.setProps({ readings: [{}] });
    expect(component.state('isShowCoins')).toBeTruthy();
    expect(component.state('isRecorded')).toBeTruthy();
    expect(component.state('headsTails')).toBe('headsTails');
    expect(component.state('coinMode')).toBeFalsy();
  });

  test('HexagramLine snapshot', () => expect(renderer.create(<HexagramLine {...defaultProps} />).toJSON()).toMatchSnapshot());
});
