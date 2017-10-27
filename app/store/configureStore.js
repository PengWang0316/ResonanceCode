import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/Index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/** Creating the store for Redux
  * @param {object} initailState is the object that contains the initail states.
  * @returns {object} Return the store object for Redux.
*/
export default function configureStore(initailState) {
  return createStore(rootReducer, initailState, composeEnhancers(applyMiddleware(thunk)));
}
