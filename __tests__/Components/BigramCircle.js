import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramCircle from '../../app/Components/BigramCircle';

describe('BigramCircle test', () => {
  const defaultProps = {
    circlePosition: 'circlePosition',
    linePoint: 0
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramCircle {...props} />);

  test('BigramCircle linePoint 0 snapshot', () => expect(renderer.create(<BigramCircle {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('BigramCircle linePoint 1 snapshot', () => expect(renderer.create(<BigramCircle circlePosition="circlePosition" linePoint={1} />).toJSON()).toMatchSnapshot());

  test('BigramCircle linePoint 2 snapshot', () => expect(renderer.create(<BigramCircle circlePosition="circlePosition" linePoint={2} />).toJSON()).toMatchSnapshot());

  test('BigramCircle linePoint 3 snapshot', () => expect(renderer.create(<BigramCircle circlePosition="circlePosition" linePoint={3} />).toJSON()).toMatchSnapshot());
});
