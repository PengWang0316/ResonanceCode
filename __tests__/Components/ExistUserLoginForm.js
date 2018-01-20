import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import { ExistUserLoginForm } from '../../app/Components/ExistUserLoginForm';

describe('ExistUserLoginForm test', () => {
  const defaultProps = { usernamePasswordLogin: jest.fn() };
  const getShallowComponent = (props = defaultProps) => shallow(<ExistUserLoginForm {...props} />);

  test('handleInputChange', () => {
    const component = getShallowComponent();
    const inputs = component.find('input');
    const eventA = { target: { id: '1', value: 'A' } };
    inputs.at(0).simulate('change', eventA);
    expect(component.state(1)).toBe('A');

    const eventB = { target: { id: '2', value: 'B' } };
    inputs.at(1).simulate('change', eventB);
    expect(component.state(2)).toBe('B');
  });

  test('handleLoginSubmit', () => {
    const component = getShallowComponent();
    component.setState({
      userName: 'username',
      password: 'password'
    });
    const mockPrevent = jest.fn();
    component.find('form').simulate('submit', { preventDefault: mockPrevent });
    expect(mockPrevent).toHaveBeenCalledTimes(1);
    expect(component.state('password')).toBe('');
    expect(defaultProps.usernamePasswordLogin).toHaveBeenLastCalledWith({
      username: 'username',
      password: 'password'
    });
  });

  test('ExistUserLoginForm snapshot', () => expect(renderer.create(<ExistUserLoginForm {...defaultProps} />).toJSON()).toMatchSnapshot());
});
