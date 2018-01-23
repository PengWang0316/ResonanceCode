import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { LoginForm } from '../../app/Components/LoginForm';

describe('LoginForm test', () => {
  const defaultProps = {
    usernamePasswordLogin: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<LoginForm {...props} />);

  test('Initial states', () => {
    const component = getShallowComponent();
    expect(component.state('username')).toBe('');
    expect(component.state('password')).toBe('');
  });

  test('handleChange', () => {
    const component = getShallowComponent();
    component.find('input').at(0).simulate('change', { target: { id: 'idA', value: 'valueA' } });
    component.find('input').at(1).simulate('change', { target: { id: 'idB', value: 'valueB' } });
    expect(component.state('idA')).toBe('valueA');
    expect(component.state('idB')).toBe('valueB');
  });

  test('handleSubmit', () => {
    const component = getShallowComponent();
    const mockPreventDefault = jest.fn();
    component.setState({ username: 'username', password: 'password' });
    component.find('form').simulate('submit', { preventDefault: mockPreventDefault });
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    expect(defaultProps.usernamePasswordLogin).toHaveBeenLastCalledWith({ username: 'username', password: 'password' });
  });

  test('LoginForm snapshot', () => expect(renderer.create(<LoginForm {...defaultProps} />).toJSON()).toMatchSnapshot());
});
