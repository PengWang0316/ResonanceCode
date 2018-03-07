import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import LineBigram from '../../app/Components/LineBigram';

describe('LineBigram test', () => {
  const defaultProps = {
    title: 'title',
    data: {
      image: '../imgs/conception.png', name: 'name', energy_state: 'energyState', manifestation: 'manifestation', possibilities: 'possibilities', question: 'question'
    }
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<LineBigram {...props} />);

  test('LineBigram has image snapshot', () => expect(renderer.create(<LineBigram {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('LineBigram has no image snapshot', () => expect(renderer.create(<LineBigram {...{
 ...defaultProps,
data: {
    name: 'name', energy_state: 'energyState', manifestation: 'manifestation', possibilities: 'possibilities', question: 'question'
  }
}}
  />).toJSON()).toMatchSnapshot());
});
