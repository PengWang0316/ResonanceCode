import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';

import SharedJournalListModal from '../../app/Components/SharedJournalListModal';

jest.mock('../../app/Components/JournalRow', () => 'JournalRow');

describe('SharedJournalListModal test', () => {
  const defaultProps = {
    reading: { reading_name: 'readingName', journal_entries: [{ _id: 'idA' }, { _id: 'idB' }] }
  };
  // const getShallowComponent = (props = defaultProps) => shallow(<SharedJournalListModal {...props} />);

  test('SharedJournalListModal snapshot', () => expect(renderer.create(<SharedJournalListModal {...defaultProps} />).toJSON()).toMatchSnapshot());
});
