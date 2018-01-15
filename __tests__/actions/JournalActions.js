import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';

import * as JournalActions from '../../app/actions/JournalActions';
import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE, FETCH_JOURNALS_SUCCESS, IS_LOADING, CLEAR_JOURNALS_STATE, FETCH_ALL_JOURNAL_SUCCESS, CLEAR_ALL_JOURNAL } from '../../app/actions/ActionTypes';
import { API_FETCH_UNATTACHED_JOURNALS, API_FETCH_JOURNALS, API_UPDATE_JOURNAL, API_CREATE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_ID, API_DELETE_UNATTACHED_JOURNAL, API_DELETE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID, API_UPDATE_JOURNAL_SHARE_LIST, API_FETCH_ALL_JOURNAL, API_CLOUDINARY_UPLOAD_URL, API_DELETE_UPLOAD_IMAGES } from '../../app/actions/ApiUrls';
import { JWT_MESSAGE, CLOUDINARY_UPLOAD_PRESET } from '../../app/config';

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
      { type: CLEAR_ALL_JOURNAL },
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
      { type: CLEAR_ALL_JOURNAL },
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
      { type: CLEAR_ALL_JOURNAL },
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
    const existedShareList = [];
    const shareList = [
      { id: '1', displayName: 'nameA', photo: 'xxx' },
      { id: '2', displayName: 'nameB', photo: 'yyy' }
    ];
    const expectedActions = [{ type: CLEAR_JOURNAL_STATE }];
    mockAxios.onPut(API_UPDATE_JOURNAL_SHARE_LIST, {
      readingId, journalId, shareList, existedShareList, jwtMessage
    }).reply(200);
    return store.dispatch(JournalActions.updateJournalShareList({
      readingId, journalId, shareList, existedShareList
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

  test('fetchAllJournal', () => {
    const store = mockStore();
    const allJournal = [{ _id: '1', content: 'aa' }, { _id: '2', content: 'bb' }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_ALL_JOURNAL_SUCCESS, allJournal },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_ALL_JOURNAL, {
      param: { jwtMessage }
    }).reply(200, allJournal);
    return store.dispatch(JournalActions.fetchAllJournal())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  /** The axios will not see the FormData's append file, which means it will treat them as same and mockAxios will always return the same response. */
  test('uploadImages', () => {
    const files = ['1', '2'];
    const fd1 = new FormData();
    fd1.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd1.append('file', files[0]);
    const fd2 = new FormData();
    fd2.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd2.append('file', files[1]);
    mockAxios.onPost(API_CLOUDINARY_UPLOAD_URL).reply(200, 'result1');
    // mockAxios.onPost(API_CLOUDINARY_UPLOAD_URL, fd2, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).reply(200, 'result2');
    return JournalActions.uploadImages(files).then(result => {
      expect(result[0]).toEqual('result1');
      expect(result[1]).toEqual('result1');
    });
  });

  test('deleteUploadImages', () => {
    const publicIds = ['1', '2', '3'];
    mockAxios.onDelete(API_DELETE_UPLOAD_IMAGES).reply(200);
    return JournalActions.deleteUploadImages(publicIds).then(() => {
      expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
    });
  });
});
