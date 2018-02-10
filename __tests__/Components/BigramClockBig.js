import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramClockBig from '../../app/Components/BigramClockBig';

describe('BigramClockBig test', () => {
  const defaultProps = {
    lineText: 'test text',
    position: 0
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramClockBig {...props} />);

  test('BigramClockBig snapshot', () => expect(renderer.create(<BigramClockBig {...defaultProps} />).toJSON()).toMatchSnapshot());
});
