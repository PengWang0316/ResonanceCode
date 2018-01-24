import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ReadingSearchResult from '../../app/Components/ReadingSearchResult';

describe('ReadingSearchResult test', () => {
  const defaultProps = {
    element: { _id: 'id', reading_name: 'readingName' },
    nameResult: [1, 2, 3],
    handleClickCallback: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<ReadingSearchResult {...props} />);

  test('ReadingSearchResult snapshot', () => expect(renderer.create(<ReadingSearchResult {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleClick', () => {
    const component = getShallowComponent();
    component.find('div').simulate('click');
    expect(defaultProps.handleClickCallback)
      .toHaveBeenLastCalledWith(defaultProps.element._id, defaultProps.element.reading_name);
  });
});
