import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import LoginCoverImage from '../../app/Components/LoginCoverImage';

describe('LoginCoverImage test', () => {
  // const defaultProps = {};
  // const getShallowComponent  = (props = defaultProps) => shallow(< {...props} />);

  test(' snapshot', () => expect(renderer.create(<LoginCoverImage />).toJSON()).toMatchSnapshot());
});
