import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import { LoadingAnimation } from '../../../app/Components/SharedComponents/LoadingAnimation';

describe('LoadingAnimation test', () => {
  const defaultProps = {
    isLoading: true
  };
  test('LoadingAnimation is loading snapshot', () => expect(renderer.create(<LoadingAnimation {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('LoadingAnimation is not loading snapshot', () => expect(renderer.create(<LoadingAnimation isLoading={false} />).toJSON()).toMatchSnapshot());
});
