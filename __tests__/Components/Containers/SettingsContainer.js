import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SettingsContainer } from '../../../app/Components/containers/SettingsContainer';

jest.mock('jquery', () => jest.fn());
jest.mock('../../../app/Components/AlertPanel', () => 'AlertPanel');
jest.mock('../../../app/Components/UserGroups', () => 'UserGroups');
jest.mock('../../../app/Components/SharedComponents/UnauthenticatedUserCheck', () => 'UnauthenticatedUserCheck');

describe('SettingsContainer test', () => {
  const defaultProps = {
    user: { isAuth: true, settings: { coinMode: false, customName: 'customName' } },
    checkAuthentication: jest.fn(),
    updateSettingCoinMode: jest.fn(),
    saveCustomName: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SettingsContainer {...props} />);

  test('constructor the user has coinMode, customName and authorized', () => {
    const component = getShallowComponent();
    const {
      coinMode, isShowAlert, customName, isNameChanged
    } = component.instance().state;
    expect(coinMode).toBe(false);
    expect(isShowAlert).toBe(false);
    expect(customName).toBe('customName');
    expect(isNameChanged).toBe(false);
    expect(component.instance().oldName).toBe('customName');
    expect(defaultProps.checkAuthentication).not.toHaveBeenCalled();
  });

  test('constructor the user has no coinMode, customName and unauthorized', () => {
    const component = getShallowComponent({ ...defaultProps, user: { isAuth: false, displayName: 'displayName' } });
    const {
      coinMode, isShowAlert, customName, isNameChanged
    } = component.instance().state;
    expect(coinMode).toBe('');
    expect(isShowAlert).toBe(false);
    expect(customName).toBe('displayName');
    expect(isNameChanged).toBe(false);
    expect(component.instance().oldName).toBe('displayName');
    expect(defaultProps.checkAuthentication).toHaveBeenCalledTimes(1);
  });

  test('componentWillReceiveProps has customName', () => {
    const component = getShallowComponent();
    component.setProps({ user: { isAuth: true, settings: { coinMode: true, customName: 'new name' } } });
    expect(component.instance().state.coinMode).toBe(true);
    expect(component.instance().state.customName).toBe('new name');
    expect(component.instance().oldName).toBe('new name');
  });

  test('componentWillReceiveProps has no customName', () => {
    const component = getShallowComponent();
    component.setProps({ user: { isAuth: true, displayName: 'display name', settings: { coinMode: false } } });
    expect(component.instance().state.coinMode).toBe(false);
    expect(component.instance().state.customName).toBe('display name');
    expect(component.instance().oldName).toBe('display name');
  });

  test('handleCoinModeClick coinMode is true', () => {
    const mockUpdateSettingCoinModeFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps, updateSettingCoinMode: mockUpdateSettingCoinModeFn
    });
    component.setState({ coinMode: true });
    component.find('button').at(1).simulate('click');
    expect(mockUpdateSettingCoinModeFn).not.toHaveBeenCalled();
  });

  test('handleCoinModeClick coinMode is false has savedTimeOut', () => {
    jest.useFakeTimers();
    const jquery = require('jquery');
    const mockCssFn = jest.fn();
    jquery.mockReturnValue({ css: mockCssFn });
    const mockUpdateSettingCoinModeFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps, updateSettingCoinMode: mockUpdateSettingCoinModeFn
    });
    component.instance().savedTimeOut = 1;
    component.instance().cancleAlertTimeOut = 2;
    component.setState({ coinMode: false });
    component.find('button').at(1).simulate('click');
    expect(mockUpdateSettingCoinModeFn).toHaveBeenLastCalledWith(true);
    expect(component.instance().state.coinMode).toBe(true);
    expect(component.instance().state.isShowAlert).toBe(true);
    expect(clearTimeout).toHaveBeenLastCalledWith(1);
    // expect(jquery).not.toHaveBeenCalled();
    // expect(mockCssFn).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(jquery).toHaveBeenCalled();
    expect(mockCssFn).toHaveBeenCalled();
    expect(component.instance().state.isShowAlert).toBe(false);
    expect(clearTimeout).toHaveBeenLastCalledWith(2);
  });

  test('handleHexagramModeClick coinMode is false', () => {
    const mockUpdateSettingCoinModeFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps, updateSettingCoinMode: mockUpdateSettingCoinModeFn
    });
    component.setState({ coinMode: false });
    component.find('button').at(2).simulate('click');
    expect(mockUpdateSettingCoinModeFn).not.toHaveBeenCalled();
  });

  test('handleHexagramModeClick coinMode is true has no savedTimeOut', () => {
    jest.useFakeTimers();
    const jquery = require('jquery');
    const mockCssFn = jest.fn();
    jquery.mockReturnValue({ css: mockCssFn });
    const mockUpdateSettingCoinModeFn = jest.fn();
    const component = getShallowComponent({
      ...defaultProps, updateSettingCoinMode: mockUpdateSettingCoinModeFn
    });
    // component.instance().savedTimeOut = 1;
    component.setState({ coinMode: true });
    component.find('button').at(2).simulate('click');
    expect(mockUpdateSettingCoinModeFn).toHaveBeenLastCalledWith(false);
    expect(component.instance().state.coinMode).toBe(false);
    expect(component.instance().state.isShowAlert).toBe(true);
    expect(clearTimeout).not.toHaveBeenCalled();
    // expect(jquery).not.toHaveBeenCalled();
    // expect(mockCssFn).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(jquery).toHaveBeenCalled();
    expect(mockCssFn).toHaveBeenCalled();
    expect(component.instance().state.isShowAlert).toBe(false);
    expect(clearTimeout).not.toHaveBeenCalled();
  });

  test('handleInputChange', () => {
    const component = getShallowComponent();
    component.find('input').simulate('change', { target: { value: '', id: 'id' } });
    expect(component.instance().state.isNameChanged).toBe(false);
    expect(component.instance().state.id).toBe('');
    component.instance().oldName = 'oldName';
    component.find('input').simulate('change', { target: { value: 'oldName', id: 'id' } });
    expect(component.instance().state.isNameChanged).toBe(false);
    expect(component.instance().state.id).toBe('oldName');
    component.find('input').simulate('change', { target: { value: 'A long long long long name', id: 'id' } });
    expect(component.instance().state.isNameChanged).toBe(false);
    expect(component.instance().state.id).toBe('A long long long long name');
    component.find('input').simulate('change', { target: { value: 'a correct name', id: 'id' } });
    expect(component.instance().state.isNameChanged).toBe(true);
    expect(component.instance().state.id).toBe('a correct name');
  });

  test('handleSaveNameBtnClick', () => {
    jest.useFakeTimers();
    const component = getShallowComponent();
    component.setState({ customName: 'newName' });
    component.find('button').at(0).simulate('click');
    expect(defaultProps.saveCustomName).toHaveBeenLastCalledWith('newName');
    expect(component.instance().oldName).toBe('newName');
    expect(component.instance().state.isNameChanged).toBe(false);
  });

  test('SettingsContainer snapshot', () => expect(renderer.create(<SettingsContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
