import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { LoginContainer } from '../../../app/Components/containers/LoginContainer';

jest.mock('jquery', () => jest.fn());
jest.mock('../../../app/Components/LoginCoverImage', () => 'LoginCoverImage');
jest.mock('../../../app/Components/LoginForm', () => 'LoginForm');

describe('LoginContainer test', () => {
  const defaultProps = {
    user: { isAuth: true },
    checkAuthentication: jest.fn(),
    location: { search: 'location search' }
  };
  const getShallowComponent = (props = defaultProps) => shallow(<LoginContainer {...props} />);

  test('componentWillMount', () => {
    getShallowComponent();
    expect(defaultProps.checkAuthentication).toHaveBeenLastCalledWith('location search');
  });

  test('componentWillReceiveProps next user is authorized', () => {
    const mockPushFn = jest.fn();
    const component = getShallowComponent({ ...defaultProps, history: { push: mockPushFn } });
    component.setProps({ user: { isAuth: true } });
    expect(mockPushFn).toHaveBeenLastCalledWith('/reading');
  });

  test('componentWillReceiveProps has loginErr', () => {
    jest.useFakeTimers();
    const mockPushFn = jest.fn();
    const mockCssFn = jest.fn();
    const jquery = require('jquery');
    jquery.mockReturnValue({ css: mockCssFn });
    const component = getShallowComponent();
    component.setProps({ user: { loginErr: 'error message' } });
    expect(mockPushFn).not.toHaveBeenCalled();
    expect(jquery).toHaveBeenLastCalledWith('#loginWarnMessage');
    expect(jquery).toHaveBeenCalledTimes(1);
    expect(mockCssFn).toHaveBeenLastCalledWith('opacity', '1');
    expect(mockCssFn).not.toHaveBeenLastCalledWith('opacity', '0');
    jest.runAllTimers();
    expect(jquery).toHaveBeenCalledTimes(2);
    expect(mockCssFn).toHaveBeenLastCalledWith('opacity', '0');
  });

  test('LoginContainer snapshot', () => expect(renderer.create(<LoginContainer {...defaultProps} />).toJSON()).toMatchSnapshot());
});
