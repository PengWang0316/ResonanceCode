import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { SEND_EXTRA_MESSAGE } from '../../app/actions/ActionTypes';
import sendExtraMessage from '../../app/actions/ExtraMessageActions';

const mockStore = configureMockStore([thunk]);
describe('Test ExtraMessageActions', () => {
  test('sendExtraMessage', () => {
    const message = 'extra message.';
    const store = mockStore();
    const expectedActions = [
      { type: SEND_EXTRA_MESSAGE, message }
    ];
    store.dispatch(sendExtraMessage(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
