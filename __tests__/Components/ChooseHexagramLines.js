import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ChooseHexagramLines from '../../app/Components/ChooseHexagramLines';

describe('ChooseHexagramLines Test', () => {
  const defaultProps = {
    handleCoinClick: jest.fn(),
    lineNumber: '2',
    handleCancel: jest.fn(),
    handleSwitchMode: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<ChooseHexagramLines {...props} />);

  test('handleSwitchMode', () => {
    const component = getShallowComponent();
    component.find({ htmlFor: 'coinMode' }).simulate('click');
    expect(defaultProps.handleSwitchMode).toHaveBeenCalledTimes(1);
  });

  test('handleChengingYangClick', () => {
    const handleCancel = jest.fn();
    // const handleCoinClick = jest.fn();
    const component = getShallowComponent({ ...defaultProps, handleCancel });
    component.find({ role: 'button' }).at(1).simulate('click');
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleCoinClick).toHaveBeenLastCalledWith('2', 9, '');
  });

  test('handleChengingYinClick', () => {
    const handleCancel = jest.fn();
    // const handleCoinClick = jest.fn();
    const component = getShallowComponent({ ...defaultProps, handleCancel });
    component.find({ role: 'button' }).at(2).simulate('click');
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleCoinClick).toHaveBeenLastCalledWith('2', 6, '');
  });

  test('handleChengingFixedYangClick', () => {
    const handleCancel = jest.fn();
    // const handleCoinClick = jest.fn();
    const component = getShallowComponent({ ...defaultProps, handleCancel });
    component.find({ role: 'button' }).at(3).simulate('click');
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleCoinClick).toHaveBeenLastCalledWith('2', 7, '');
  });

  test('handleChengingFixedYinClick', () => {
    const handleCancel = jest.fn();
    // const handleCoinClick = jest.fn();
    const component = getShallowComponent({ ...defaultProps, handleCancel });
    component.find({ role: 'button' }).at(4).simulate('click');
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleCoinClick).toHaveBeenLastCalledWith('2', 8, '');
  });

  test('ChooseHexagramLines snapshot', () => expect(renderer.create(<ChooseHexagramLines {...defaultProps} />).toJSON()).toMatchSnapshot());
});
