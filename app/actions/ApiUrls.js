export const BASE_URL = 'https://kairoscope-backend.glitch.me'; // Development server
// BASE_URL = ""; //Production server
export const API_BASE_URL = `${BASE_URL}/api/v1`;
export const API_FACEBOOK_LOGIN = `${API_BASE_URL}/auth/facebookLogin`;
export const API_JWTMESSAGE_VERIFY = `${API_BASE_URL}/jwtMessageVerify`;
export const API_USERNAME_PASSWORD_LOGIN = `${API_BASE_URL}/auth/usernamePasswordLogin`;
export const API_CHECK_USERNAME_AVAILABLE = `${API_BASE_URL}/auth/checkUsernameAvailable`;
export const API_REGISTER_NEW_USER = `${API_BASE_URL}/auth/registerNewUser`;
export const API_FETCH_READINGS = `${API_BASE_URL}/fetchReadings`;
export const API_FETCH_READINGS_BASEON_HEXAGRAM = `${API_BASE_URL}/fetchReadingsBaseOnHexagram`;
export const API_FETCH_HEXAGRAMS = `${API_BASE_URL}/fetchHexagrams`;
export const API_SEARCH_READINGS = `${API_BASE_URL}/searchReadings`;
export const API_FETCH_UNATTACHED_JOURNALS = `${API_BASE_URL}/fetchUnattachedJournals`;
export const API_FETCH_JOURNALS = `${API_BASE_URL}/fetchJournals`;
export const API_FETCH_LINES_BIGRAMS = `${API_BASE_URL}/fetchLinesBigrams`;
