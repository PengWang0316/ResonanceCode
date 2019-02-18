import {
  BASE_URL, AWS_READING_URL, AWS_JOURNAL_URL, AWS_HEXAGRAM_URL, AWS_USER_URL,
} from '../config';

// BASE_URL = ""; //Production server
export const API_BASE_URL = `${BASE_URL}/api/v1`;
export const API_FACEBOOK_LOGIN = `${API_BASE_URL}/auth/facebookLogin`;
export const API_GOOGLE_LOGIN = `${API_BASE_URL}/auth/googleLogin`;
export const API_JWTMESSAGE_VERIFY = `${API_BASE_URL}/jwtMessageVerify`;
export const API_USERNAME_PASSWORD_LOGIN = `${API_BASE_URL}/auth/usernamePasswordLogin`;
export const API_CHECK_USERNAME_AVAILABLE = `${API_BASE_URL}/auth/checkUsernameAvailable`;
export const API_REGISTER_NEW_USER = `${API_BASE_URL}/auth/registerNewUser`;
export const API_FETCH_READINGS = `${AWS_READING_URL}/readings`;
export const API_FETCH_READINGS_AMOUNT = `${AWS_READING_URL}/readings/amount`;
export const API_FETCH_READINGS_BASEON_HEXAGRAM = `${AWS_READING_URL}/readings/hexagram`;
export const API_FETCH_HEXAGRAMS = `${AWS_HEXAGRAM_URL}/hexagrams`;
export const API_FETCH_ALL_HEXAGRAMS = API_FETCH_HEXAGRAMS;
export const API_FETCH_HEXAGRAM_BASED_ON_IMG = `${AWS_HEXAGRAM_URL}/hexagram`;
export const API_SEARCH_READINGS = `${AWS_READING_URL}/readings/search`;
export const API_FETCH_ALL_READING_LIST = `${AWS_READING_URL}/readings/allList`;
export const API_FETCH_JOURNALS = `${AWS_READING_URL}/journals`;
export const API_FETCH_UNATTACHED_JOURNALS = `${AWS_JOURNAL_URL}/unattachedJournals`;
export const API_FETCH_LINES_BIGRAMS = `${API_BASE_URL}/fetchLinesBigrams`;
export const API_CREATE_READING = `${AWS_READING_URL}/readings`;
export const API_DELETE_READING = `${AWS_READING_URL}/readings`;
export const API_FETCH_SEARCH_READINGS = `${AWS_READING_URL}/readings/search/name`;
export const API_UPDATE_JOURNAL = `${API_BASE_URL}/journal`;
export const API_CREATE_JOURNAL = `${AWS_READING_URL}/journal`;
export const API_CREATE_UNATTACHED_JOURNAL = `${AWS_JOURNAL_URL}/journal`;
export const API_FETCH_JOURNAL_BASED_ON_ID = `${AWS_READING_URL}/journal`;
export const API_FETCH_UNATTACHED_JOURNAL_BASED_ON_ID = `${AWS_JOURNAL_URL}/unattachedJournal`;
export const API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID = `${AWS_READING_URL}/journals/byIds`;
export const API_DELETE_UNATTACHED_JOURNAL = `${AWS_JOURNAL_URL}/unattachedJournal`;
export const API_DELETE_JOURNAL = `${AWS_READING_URL}/journals/delete`;
export const API_UPDATE_HEXAGRAM = `${AWS_HEXAGRAM_URL}/hexagram`;
export const API_UPDATE_SETTING_COIN_MODE = `${API_BASE_URL}/updateSettingCoinMode`;
export const API_FETCH_ALL_USER_LIST = `${AWS_USER_URL}/users/list`;
export const API_FETCH_USERS_AMOUNT = `${API_BASE_URL}/fetchUsersAmount`;
export const API_UPDATE_JOURNAL_SHARE_LIST = `${API_BASE_URL}/updateJournalShareList`;
export const API_FETCH_SHARED_READINGS = `${API_BASE_URL}/fetchSharedReadings`;
export const API_FETCH_SHARED_READINGS_AMOUNT = `${API_BASE_URL}/fetchSharedReadingsAmount`;
export const API_FETCH_ALL_JOURNAL = `${API_BASE_URL}/fetchAllJournal`;
export const API_SAVE_PUSH_SUBSCRIPTION = `${API_BASE_URL}/savePushSubscription`;
export const API_TURN_OFF_PUSH_SUBSCRIPTION = `${API_BASE_URL}/turnOffPushSubscription`;
// export const API_FETCH_READING_BASEON_ID = `${API_BASE_URL}/fetchReadingBasedOnId`;
export const API_OUTPUT_PDF_BASEON_ID = `${API_BASE_URL}/outputPdfBasedOnId`;
export const API_CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/kevinwang/image/upload';
export const API_DELETE_UPLOAD_IMAGES = `${API_BASE_URL}/deleteUploadImages`;
// export const API_FETCH_USER_GROUPS = `${API_BASE_URL}/fetchUserGroups`;
export const API_UPDATE_USER_GROUP = `${API_BASE_URL}/updateUserGroup`;
export const API_DELETE_USER_GROUP = `${API_BASE_URL}/deleteUserGroup`;
export const API_SAVE_CUSTOM_NAME = `${API_BASE_URL}/saveCustomName`;
