import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import { LoadingAnimation } from '../../../app/Components/SharedComponents/LoadingAnimation';

describe('LoadingAnimation test', () => {
  const defaultProps = {
    isLoading: true
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<LoadingAnimation {...props} />);

<<<<<<< HEAD
  test('LoadingAnimation is loading snapshot', () => expect(renderer.create(<LoadingAnimation {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('LoadingAnimation is not loading snapshot', () => expect(renderer.create(<LoadingAnimation isLoading={false} />).toJSON()).toMatchSnapshot());
=======
  test('LoadingAnimation isLoading snapshot', () => expect(renderer.create(<LoadingAnimation {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('LoadingAnimation not isLoading snapshot', () => expect(renderer.create(<LoadingAnimation isLoading={false} />).toJSON()).toMatchSnapshot());
>>>>>>> 01d89d95cd9adb97c92c6c974c6582dd77f2dda1
});
