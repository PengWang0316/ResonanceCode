import React from 'react';
import renderer from 'react-test-renderer';

import AlertPanel from '../../app/Components/AlertPanel';

describe('AlertPanel Test', () => {
  test('AlertPanel snapshot', () => expect(renderer.create(<AlertPanel />).toJSON()).toMatchSnapshot());
});
