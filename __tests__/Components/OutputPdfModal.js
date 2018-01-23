import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import OutputPdfModal from '../../app/Components/OutputPdfModal';

jest.mock('../../app/Components/SharedComponents/LoadingAnimation', () => 'LoadingAnimation');

describe('OutputPdfModal test', () => {
  // const defaultProps = {};
  // const getShallowComponent = (props = defaultProps) => shallow(< {...props} />);

  test('OutputPdfModal snapshot', () => expect(renderer.create(<OutputPdfModal />).toJSON()).toMatchSnapshot());
});
