import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import Bigram from '../../app/Components/Bigram';

describe('Bigram test', () => {
  const defaultProps = {
    line25: 0,
    line46: 1,
    line13: 2,
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<Bigram {...props} />);

  test('Bigram snapshot', () => expect(renderer.create(<Bigram {...defaultProps} />).toJSON()).toMatchSnapshot());
});
