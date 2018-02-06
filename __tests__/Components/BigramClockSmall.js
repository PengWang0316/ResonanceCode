import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramClockSmall from '../../app/Components/BigramClockSmall';

describe('BigramClockSmall test', () => {
  const defaultProps = {
    lineText: 'test line text',
    position: 1
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramClockSmall {...props} />);

  test('BigramClockSmall snapshot', () => expect(renderer.create(<BigramClockSmall {...defaultProps} />).toJSON()).toMatchSnapshot());
});
