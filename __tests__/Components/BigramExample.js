import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramExample from '../../app/Components/BigramExample';

describe('BigramExample test', () => {
  const defaultProps = {};
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramExample {...props} />);

  test('BigramExample snapshot', () => expect(renderer.create(<BigramExample {...defaultProps} />).toJSON()).toMatchSnapshot());
});
