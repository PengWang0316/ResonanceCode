import React from 'react';
import renderer from 'react-test-renderer';

import App from '../../app/Components/App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  Route: ({ path, render }) => {
    if (render) return `<Route render=${render()} />`;
    return `<Route path=${path} />`;
  },
  Switch: ({ children }) => children
}));
jest.mock('../../app/Components/Navbar', () => 'Navbar');
jest.mock('../../app/Components/containers/LoginContainer', () => 'LoginContainer');
jest.mock('../../app/Components/containers/ReadingsContainer', () => 'ReadingsContainer');
jest.mock('../../app/Components/containers/AddReadingContainer', () => 'AddReadingContainer');
jest.mock('../../app/Components/containers/SearchReadingsContainer', () => 'SearchReadingsContainer');
jest.mock('../../app/Components/containers/SearchHexagramsContainer', () => 'SearchHexagramsContainer');
jest.mock('../../app/Components/containers/SignUpContainer', () => 'SignUpContainer');
jest.mock('../../app/Components/containers/AddJournalContainer', () => 'AddJournalContainer');
jest.mock('../../app/Components/containers/ShowJournalContainer', () => 'ShowJournalContainer');
jest.mock('../../app/Components/containers/SettingsContainer', () => 'SettingsContainer');
jest.mock('../../app/Components/containers/SharedReadingsContainer', () => 'SharedReadingsContainer');
jest.mock('../../app/Components/containers/AllJournalListContainer', () => 'AllJournalListContainer');
jest.mock('../../app/Components/JournalList', () => 'JournalList');
jest.mock('../../app/Components/administration/Hexagrams', () => 'Hexagrams');

describe('App component test', () => {
  test('App snapshot', () => expect(renderer.create(<App />).toJSON()).toMatchSnapshot());
});
