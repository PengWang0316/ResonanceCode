import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SearchHexagramsForm from '../../app/Components/SearchHexagramsForm';

describe('SearchHexagramsForm test', () => {
  const defaultProps = {
    handleSubmit: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<SearchHexagramsForm {...props} />);

  test('SearchHexagramsForm snapshot', () => expect(renderer.create(<SearchHexagramsForm {...defaultProps} />).toJSON()).toMatchSnapshot());

  test('handleSubmit', () => {
    const component = getShallowComponent();
    const mockFunc = jest.fn();
    window.document.getElementById = jest.fn().mockReturnValue({ value: 0 });
    component.find('form').simulate('submit', { preventDefault: mockFunc });
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(window.document.getElementById).toHaveBeenCalledWith('upper');
    expect(window.document.getElementById).toHaveBeenCalledWith('lower');
    expect(window.document.getElementById).toHaveBeenCalledWith('line13');
    expect(window.document.getElementById).toHaveBeenCalledWith('line25');
    expect(window.document.getElementById).toHaveBeenLastCalledWith('line46');
    expect(defaultProps.handleSubmit).toHaveBeenLastCalledWith({
      upperId: 0, lowerId: 0, line13Id: 0, line25Id: 0, line46Id: 0
    });
  });
});
