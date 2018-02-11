import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import BigramBlockBig from '../../app/Components/BigramBlockBig';

describe('BigramBlockBig test', () => {
  const defaultProps = {
    lineText: 'test text',
    position: 0,
    isLine13: true
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<BigramBlockBig {...props} />);

  test('BigramBlockBig 0 snapshot', () => expect(renderer.create(<BigramBlockBig {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('BigramBlockBig 1 snapshot', () => expect(renderer.create(<BigramBlockBig {...{
  lineText: 'test text',
  position: 1,
  isLine13: false
}}
  />).toJSON()).toMatchSnapshot());

  test('BigramBlockBig 2 snapshot', () => expect(renderer.create(<BigramBlockBig {...{
  lineText: 'test text',
  position: 2,
  isLine13: false
}}
  />).toJSON()).toMatchSnapshot());

  test('BigramBlockBig 3 snapshot', () => expect(renderer.create(<BigramBlockBig {...{
  lineText: 'test text',
  position: 3,
  isLine13: false
}}
  />).toJSON()).toMatchSnapshot());
});
