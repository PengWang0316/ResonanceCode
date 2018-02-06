import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramBlockSmall from '../../app/Components/BigramBlockSmall';

describe('BigramBlockSmall test', () => {
  const defaultProps = {
    lineText: 'test line Text',
    position: 0
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramBlockSmall {...props} />);

  test('BigramBlockSmall position 0 snapshot', () => expect(renderer.create(<BigramBlockSmall {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('BigramBlockSmall position 1 snapshot', () => expect(renderer.create(<BigramBlockSmall {...{ ...defaultProps, position: 1 }} />).toJSON()).toMatchSnapshot());

  test('BigramBlockSmall position 2 snapshot', () => expect(renderer.create(<BigramBlockSmall {...{ ...defaultProps, position: 2 }} />).toJSON()).toMatchSnapshot());

  test('BigramBlockSmall position 3 snapshot', () => expect(renderer.create(<BigramBlockSmall {...{ ...defaultProps, position: 3 }} />).toJSON()).toMatchSnapshot());
});
