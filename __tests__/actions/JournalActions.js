import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';

import * as JournalActions from '../../app/actions/JournalActions';
import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE, FETCH_JOURNALS_SUCCESS, IS_LOADING, CLEAR_JOURNALS_STATE } from '../../app/actions/ActionTypes';
import { API_FETCH_UNATTACHED_JOURNALS, API_FETCH_JOURNALS, API_UPDATE_JOURNAL, API_CREATE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_ID, API_DELETE_UNATTACHED_JOURNAL, API_DELETE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID, API_UPDATE_JOURNAL_SHARE_LIST } from '../../app/actions/ApiUrls';
import { JWT_MESSAGE } from '../../app/config';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);
const jwtMessage = 'jwtMessage';
localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;

describe('Test JournalActions', () => {
  // beforeAll(_ => { localStorage.__STORE__[JWT_MESSAGE] = jwtMessage; }); // Setting up a mocked localStorage value.

  test('fetchUnattachedJournals', () => {
    const store = mockStore();
    const journals = [{ _id: 1 }, { _id: 2 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_JOURNALS_SUCCESS, journals },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_UNATTACHED_JOURNALS, { params: { jwtMessage } }).reply(200, journals);
    return store.dispatch(JournalActions.fetchUnattachedJournals())
      .then(_ => {
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('fetchJournals', () => {
    const store = mockStore();
    const readingId = '1';
    const journals = [{ _id: 1 }, { _id: 2 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_JOURNALS_SUCCESS, journals },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_JOURNALS, { params: { jwtMessage, readingId } }).reply(200, journals);
    return store.dispatch(JournalActions.fetchJournals(readingId))
      .then(_ => {
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('fetchJournal', () => {
    const store = mockStore();
    const journalId = '1';
    const journal = { _id: 1 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_JOURNAL_SUCCESS, journal },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_JOURNAL_BASED_ON_ID, { params: { jwtMessage, journalId } })
      .reply(200, journal);
    return store.dispatch(JournalActions.fetchJournal(journalId))
      .then(_ => {
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('fetchUnattachedJournal', () => {
    const store = mockStore();
    const journalId = '1';
    const journal = { _id: 1 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_JOURNAL_SUCCESS, journal },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_JOURNAL_BASED_ON_ID, {
      params: { jwtMessage, journalId, isUnattachedJournal: true }
    }).reply(200, journal);
    return store.dispatch(JournalActions.fetchUnattachedJournal(journalId))
      .then(_ => {
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('updateJournal', () => {
    const store = mockStore();
    const journal = { _id: 11 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CLEAR_JOURNAL_STATE },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPut(API_UPDATE_JOURNAL, { journal, jwtMessage }).reply(200, null);
    return store.dispatch(JournalActions.updateJournal(journal))
      .then(_ => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('createJournal', () => {
    const store = mockStore();
    const journal = { _id: 11 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CLEAR_JOURNAL_STATE },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPost(API_CREATE_JOURNAL, { journal, jwtMessage }).reply(200, null);
    return store.dispatch(JournalActions.createJournal(journal))
      .then(_ => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('deleteJournal', () => {
    const store = mockStore();
    const journalId = '111';
    const readingIds = ['11', '22'];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CLEAR_JOURNAL_STATE },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPost(API_DELETE_JOURNAL, { journalId, readingIds, jwtMessage }).reply(200, null);
    return store.dispatch(JournalActions.deleteJournal({ journalId, readingIds })).then(_ => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
    });
  });

  test('deleteUnattachedJournal', () => {
    const store = mockStore();
    const journalId = '111';
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CLEAR_JOURNAL_STATE },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onDelete(API_DELETE_UNATTACHED_JOURNAL).reply(200, null); // Because the delete method should not have any body, so the mock axios could not send params. Otherwise, the axios will return a 404.
    return store.dispatch(JournalActions.deleteUnattachedJournal(journalId)).then(_ => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
    });
  });

  test('fetchJournalBasedOnReadingJournal', () => {
    const store = mockStore();
    const journalId = '111';
    const readingId = '222';
    const journal = {
      id: '111',
      shareList: [
        { userId: 'userId1', displayName: 'Charles', photo: 'xxxx' },
        { userId: 'userId2', displayName: 'Peng', photo: 'aaaa' }
      ]
    };
    const expectedActions = [
      { type: FETCH_JOURNAL_SUCCESS, journal }
    ];
    mockAxios.onGet(
      API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID,
      { params: { readingId, journalId, jwtMessage } }
    ).reply(200, journal);
    return store.dispatch(JournalActions.fetchJournalBasedOnReadingJournal({
      readingId, journalId
    })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
    });
  });

  test('updateJournalShareList', () => {
    const store = mockStore();
    const readingId = '1';
    const journalId = '2';
    const shareList = [
      { id: '1', displayName: 'nameA', photo: 'xxx' },
      { id: '2', displayName: 'nameB', photo: 'yyy' }
    ];
    const expectedActions = [{ type: CLEAR_JOURNAL_STATE }];
    mockAxios.onPut(API_UPDATE_JOURNAL_SHARE_LIST, {
      readingId, journalId, shareList, jwtMessage
    }).reply(200);
    return store.dispatch(JournalActions.updateJournalShareList({
      readingId, journalId, shareList
    })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
    });
  });

  test('clearJournalsState', () => {
    const store = mockStore();
    const expectedActions = [{ type: CLEAR_JOURNALS_STATE }];
    store.dispatch(JournalActions.clearJournalsState());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
