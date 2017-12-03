import { BASE_URL } from '../config';

// BASE_URL = ""; //Production server
export const API_BASE_URL = `${BASE_URL}/api/v1`;
export const API_FACEBOOK_LOGIN = `${API_BASE_URL}/auth/facebookLogin`;
export const API_GOOGLE_LOGIN = `${API_BASE_URL}/auth/googleLogin`;
export const API_JWTMESSAGE_VERIFY = `${API_BASE_URL}/jwtMessageVerify`;
export const API_USERNAME_PASSWORD_LOGIN = `${API_BASE_URL}/auth/usernamePasswordLogin`;
export const API_CHECK_USERNAME_AVAILABLE = `${API_BASE_URL}/auth/checkUsernameAvailable`;
export const API_REGISTER_NEW_USER = `${API_BASE_URL}/auth/registerNewUser`;
export const API_FETCH_READINGS = `${API_BASE_URL}/fetchReadings`;
export const API_FETCH_READINGS_AMOUNT = `${API_BASE_URL}/fetchReadingsAmount`;
export const API_FETCH_READINGS_BASEON_HEXAGRAM = `${API_BASE_URL}/fetchReadingsBaseOnHexagram`;
export const API_FETCH_HEXAGRAMS = `${API_BASE_URL}/fetchHexagrams`;
export const API_FETCH_ALL_HEXAGRAMS = `${API_BASE_URL}/fetchALLHexagrams`;
export const API_FETCH_HEXAGRAM_BASED_ON_IMG = `${API_BASE_URL}/fetchHexagramBasedOnImg`;
export const API_SEARCH_READINGS = `${API_BASE_URL}/searchReadings`;
export const API_FETCH_ALL_READING_LIST = `${API_BASE_URL}/fetchAllReadingList`;
export const API_FETCH_JOURNALS = `${API_BASE_URL}/fetchJournals`;
export const API_FETCH_UNATTACHED_JOURNALS = `${API_BASE_URL}/fetchUnattachedJournals`;
export const API_FETCH_LINES_BIGRAMS = `${API_BASE_URL}/fetchLinesBigrams`;
export const API_CREATE_READING = `${API_BASE_URL}/reading`;
export const API_DELETE_READING = `${API_BASE_URL}/deleteReading`;
export const API_FETCH_SEARCH_READINGS = `${API_BASE_URL}/fetchReadingsBasedOnName`;
export const API_UPDATE_JOURNAL = `${API_BASE_URL}/journal`;
export const API_CREATE_JOURNAL = `${API_BASE_URL}/journal`;
export const API_FETCH_JOURNAL_BASED_ON_ID = `${API_BASE_URL}/journal`;
export const API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID = `${API_BASE_URL}/journalBasedOnJournalReading`;
export const API_DELETE_UNATTACHED_JOURNAL = `${API_BASE_URL}/deleteUnattachedJournal`;
export const API_DELETE_JOURNAL = `${API_BASE_URL}/deleteJournal`;
export const API_UPDATE_HEXAGRAM = `${API_BASE_URL}/hexagram`;
export const API_UPDATE_SETTING_COIN_MODE = `${API_BASE_URL}/updateSettingCoinMode`;
export const API_FETCH_ALL_USER_LIST = `${API_BASE_URL}/fetchAllUserList`;
export const API_FETCH_USERS_AMOUNT = `${API_BASE_URL}/fetchUsersAmount`;
export const API_UPDATE_JOURNAL_SHARE_LIST = `${API_BASE_URL}/updateJournalShareList`;
export const API_FETCH_SHARED_READINGS = `${API_BASE_URL}/fetchSharedReadings`;
export const API_FETCH_SHARED_READINGS_AMOUNT = `${API_BASE_URL}/fetchSharedReadingsAmount`;
export const API_FETCH_ALL_JOURNAL = `${API_BASE_URL}/fetchAllJournal`;
