import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import GroupHexagramTable from '../../app/Components/GroupHexagramTable';

jest.mock('../../app/Components/GroupHexagramRow', () => 'GroupHexagramRow');

describe('GroupHexagramTable test', () => {
  const defaultProps = {
    hexagramArray: [{ name: 'name' }],
    handleHexagramClick: jest.fn(),
    tableTitle: 'test title'
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<GroupHexagramTable {...props} />);

  test('GroupHexagramTable snapshot', () => expect(renderer.create(<GroupHexagramTable {...defaultProps} />).toJSON()).toMatchSnapshot());
});
