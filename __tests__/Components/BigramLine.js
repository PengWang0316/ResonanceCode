import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramLine from '../../app/Components/BigramLine';

describe('BigramLine test', () => {
  // const defaultProps = {};
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramLine {...props} />);

  test('BigramLine is not broken snapshot', () => expect(renderer.create(<BigramLine />).toJSON()).toMatchSnapshot());

  test('BigramLine is broken snapshot', () => expect(renderer.create(<BigramLine isBroken />).toJSON()).toMatchSnapshot());
});
