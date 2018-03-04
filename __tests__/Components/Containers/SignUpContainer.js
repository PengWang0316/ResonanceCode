import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { SignUpContainer } from '../../../app/Components/containers/SignUpContainer';

jest.mock('../../../app/Components/SignUpForm', () => 'SignUpForm');
jest.mock('../../../app/Components/ExistUserLoginForm', () => 'ExistUserLoginForm');

describe('SignUpContainer test', () => {
  const defaultProps = {
    user: { isAuth: true },
    history: { push: jest.fn() }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SignUpContainer {...props} />);

  test('componentWillReceiveProps next user isAuth', () => {
    window.$ = jest.fn();
    const component = getShallowComponent();
    component.setProps({ user: { isAuth: true } });
    expect(defaultProps.history.push).toHaveBeenLastCalledWith('/reading');
    expect(window.$).not.toHaveBeenCalled();
  });

  test('componentWillReceiveProps has loginErr', () => {
    jest.useFakeTimers();
    const mockPushFn = jest.fn();
    const mockCssFn = jest.fn();
    window.$ = jest.fn().mockReturnValue({ css: mockCssFn });
    const component = getShallowComponent({ ...defaultProps, history: { push: mockPushFn } });
    component.setProps({ user: { isAuth: false, loginErr: true } });
    expect(mockPushFn).not.toHaveBeenCalled();
    expect(window.$).toHaveBeenLastCalledWith('#loginWarnMessage');
    expect(mockCssFn).toHaveBeenLastCalledWith('opacity', '1');
    jest.runAllTimers();
    expect(window.$).toHaveBeenCalledTimes(2);
    expect(mockCssFn).toHaveBeenLastCalledWith('opacity', '0');
  });

  test('SignUpContainer snapshot', () => expect(renderer.create(<SignUpContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
