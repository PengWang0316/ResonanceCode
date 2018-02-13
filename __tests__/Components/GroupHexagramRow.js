import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import GroupHexagramRow from '../../app/Components/GroupHexagramRow';

jest.mock('../../app/Components/HexagramImage', () => 'HexagramImage');

describe('GroupHexagramRow test', () => {
  const defaultProps = {
    hexagram: { number: 1, name: 'name', imageArr: '7,9-7,9' },
    handleHexagramClick: jest.fn()
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<GroupHexagramRow {...props} />);

  test('GroupHexagramRow snapshot', () => expect(renderer.create(<GroupHexagramRow {...defaultProps} />).toJSON()).toMatchSnapshot());
});
