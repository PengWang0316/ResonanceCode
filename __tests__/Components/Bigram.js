import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import Bigram from '../../app/Components/Bigram';

jest.mock('../../app/Components/BigramLine', () => 'BigramLine');
jest.mock('../../app/Components/BigramCircle', () => 'BigramCircle');

describe('Bigram test', () => {
  const defaultProps = {
    line25: 0,
    line46: 1,
    line13: 2,
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<Bigram {...props} />);

  test('Bigram snapshot', () => expect(renderer.create(<Bigram {...defaultProps} />).toJSON()).toMatchSnapshot());
});
