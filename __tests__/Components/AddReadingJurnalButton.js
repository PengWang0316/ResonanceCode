import React from 'react';
// import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import AddReadingJournalButton from '../../app/Components/AddReadingJournalButton';

jest.mock('react-router-dom', () => ({ Link: 'Link' }));

describe('Test AddReadingJournalButton', () => {
  test('AddReadingJournalButton snapshot', () => {
    const snapshot = renderer.create(<AddReadingJournalButton />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
