import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ChooseCoin from '../../app/Components/ChooseCoin';

describe('ChooseCoin Test', () => {
  const props = {
    lineNumber: '1',
    handleCoinClick: jest.fn(),
    handleCancel: jest.fn(),
    handleSwitchMode: jest.fn()
  };
  const getShallowComponent = (newProps = props) => shallow(<ChooseCoin {...newProps} />);

  test('handleCancel ', () => {
    const handleCancel = jest.fn();
    const chooseCoin = getShallowComponent({ ...props, handleCancel });
    chooseCoin.find('button').at(1).simulate('click');
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('handleSubmit', () => {
    const handleCancel = jest.fn();
    const chooseCoin = getShallowComponent({ ...props, handleCancel });
    chooseCoin.find('button').at(0).simulate('click');
    expect(props.handleCoinClick).toHaveBeenCalled();
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('handleClickThirdCoin', () => {
    const chooseCoin = getShallowComponent();
    const button = chooseCoin.find({ role: 'button' }).at(3);
    button.simulate('click');
    expect(chooseCoin.state('2')[1]).toBe('H');
    expect(chooseCoin.state('2')[2]).toBe(true);
    button.simulate('click');
    expect(chooseCoin.state('2')[1]).toBe('T');
  });

  test('handleClickSecondCoin ', () => {
    const chooseCoin = getShallowComponent();
    const button = chooseCoin.find({ role: 'button' }).at(2);
    button.simulate('click');
    expect(chooseCoin.state('1')[1]).toBe('H');
    expect(chooseCoin.state('1')[2]).toBe(true);
    button.simulate('click');
    expect(chooseCoin.state('1')[1]).toBe('T');
  });

  test('handleClickFirstCoin  ', () => {
    const chooseCoin = getShallowComponent();
    const button = chooseCoin.find({ role: 'button' }).at(1);
    button.simulate('click');
    expect(chooseCoin.state('0')[1]).toBe('H');
    expect(chooseCoin.state('0')[2]).toBe(true);
    button.simulate('click');
    expect(chooseCoin.state('0')[1]).toBe('T');
  });

  test('button disable status', () => {
    const chooseCoin = getShallowComponent();
    expect(chooseCoin.find('button').at(0).prop('disabled')).toBe(true);
    chooseCoin.setState({
      0: [0, '-', true]
    });
    expect(chooseCoin.find('button').at(0).prop('disabled')).toBe(true);
    chooseCoin.setState({
      1: [1, '-', true]
    });
    expect(chooseCoin.find('button').at(0).prop('disabled')).toBe(true);
    chooseCoin.setState({
      2: [2, '-', true]
    });
    expect(chooseCoin.find('button').at(0).prop('disabled')).toBe(false);
  });

  test('ChooseCoin snapshot', () => expect(renderer.create(<ChooseCoin {...props} />).toJSON()).toMatchSnapshot());
});
