import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { Navbar } from '../../app/Components/Navbar';

jest.mock('react-router-dom', () => ({ NavLink: 'NavLink' }));

describe('Navbar test', () => {
  const defaultProps = {
    user: { isAuth: true, photo: 'photoSrc', displayName: 'displayName' },
    userLogout: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<Navbar {...props} />);

  test('Navbar login snapshot', () => expect(renderer.create(<Navbar {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('Navbar not login snapshot', () => expect(renderer.create(<Navbar {...{ ...defaultProps, user: { isAuth: false } }} />).toJSON()).toMatchSnapshot());

  test('logout', () => {
    const component = getShallowComponent({
      ...defaultProps,
      user: { ...defaultProps.user, photo: null }
    });
    component.find({ to: '/' }).at(1).simulate('click');
    expect(defaultProps.userLogout).toHaveBeenCalledTimes(1);
  });
});
