import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SignUpForm } from '../../app/Components/SignUpForm';

describe('SignUpForm test', () => {
  const defaultProps = {
    registerNewUser: jest.fn(),
    checkUserNameAvailable: jest.fn(),
    user: { isChecked: false, isUsernameAvaliable: true }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SignUpForm {...props} />);

  test('SignUpForm snapshot', () => expect(renderer.create(<SignUpForm {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('inintial states', () => {
    const component = getShallowComponent();
    expect(component.state('userName')).toBe('');
    expect(component.state('password')).toBe('');
    expect(component.state('repeatPassword')).toBe('');
    expect(component.state('isPasswordSame')).toBeTruthy();
    expect(component.state('isNameAvailable')).toBeFalsy();
    expect(component.state('isChecking')).toBeFalsy();
    expect(component.state('hasResult')).toBeFalsy();
  });

  test('componentWillReceiveProps', () => {
    const component = getShallowComponent();
    component.setState({ isChecking: true, hasResult: false, isNameAvailable: false });
    component.setProps({ user: { isChecked: true, isUsernameAvailable: true } });
    expect(component.state('isChecking')).toBeFalsy();
    expect(component.state('hasResult')).toBeTruthy();
    expect(component.state('isNameAvailable')).toBeTruthy();
  });

  test('checkUserName', () => {
    jest.useFakeTimers();
    const component = getShallowComponent();
    component.setState({ isChecking: false });
    const mockCheckUserNameFunc = jest.fn();
    component.instance().checkUserNameFunction = mockCheckUserNameFunc;
    component.find('input').at(0).simulate('change', { target: { id: 'userName', value: 'newUserName' } });
    expect(clearTimeout).toHaveBeenLastCalledWith(mockCheckUserNameFunc);
    expect(defaultProps.checkUserNameAvailable).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(component.state('isChecking')).toBeTruthy();
    expect(defaultProps.checkUserNameAvailable).toHaveBeenLastCalledWith('newUserName');
  });

  test('handleInputChange password', () => {
    const component = getShallowComponent();
    component.setState({ repeatPassword: 'aaa', isPasswordSame: true });
    component.find('input').at(0).simulate('change', { target: { id: 'password', value: 'password' } });
    expect(component.state('password')).toBe('password');
    expect(component.state('isPasswordSame')).toBeFalsy();
  });

  test('handleInputChange repeatPassword', () => {
    const component = getShallowComponent();
    component.setState({ password: 'aaa', isPasswordSame: false });
    component.find('input').at(0).simulate('change', { target: { id: 'repeatPassword', value: 'aaa' } });
    expect(component.state('repeatPassword')).toBe('aaa');
    expect(component.state('isPasswordSame')).toBeTruthy();
  });

  test('handleSubmit', () => {
    const component = getShallowComponent();
    component.setState({ userName: 'username', password: 'password' });
    const mockFunc = jest.fn();
    component.find('form').simulate('submit', { preventDefault: mockFunc });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(defaultProps.registerNewUser).toHaveBeenLastCalledWith({ username: 'username', password: 'password' });
  });
});
