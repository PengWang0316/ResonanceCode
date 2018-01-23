import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import PageNavigationButton from '../../app/Components/PageNavigationButton';

jest.mock('react-router-dom', () => ({ Link: 'Link' }));

describe('PageNavigationButton test', () => {
  const defaultProps = {
    startNumber: '2',
    isEmptyContent: false
  };
  const getShallowComponent = (props = defaultProps) =>
    shallow(<PageNavigationButton {...props} />);

  test('PageNavigationButton snapshot', () => expect(renderer.create(<PageNavigationButton {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('PageNavigationButton empty content snapshot', () => expect(renderer.create(<PageNavigationButton startNumber="2" isEmptyContent />).toJSON()).toMatchSnapshot());

  test('Link search property test', () => {
    const component = getShallowComponent();
    expect(component.find('Link').at(0).prop('to').search).toBe('?start=1');
    const newComponent = getShallowComponent({ isEmptyContent: false, startNumber: '7' });
    expect(newComponent.find('Link').at(0).prop('to').search).toBe('?start=2');
  });
});
