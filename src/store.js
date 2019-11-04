/*
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app from './reducers/app.js';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management

const MY_KEY = 'gramps_webapp'

export const saveState = (state) => {
  if (state.api != undefined) {
    let reduced_state = {app: state.app, api: {token: state.api.token, refresh_token: state.api.refresh_token}};
    let stringifiedState = JSON.stringify(reduced_state);
    localStorage.setItem(MY_KEY, stringifiedState);
  }
}
export const loadState = () => {
  let json = localStorage.getItem(MY_KEY) || '{}';
  let state = JSON.parse(json);

  if (state) {
    if  (state.app) {
      state.app.lightboxOpened = false;
    }
    return state;
  } else {
    return undefined;  // To use the defaults in the reducers
  }
}

export const store = createStore(
  state => state,
  loadState(),  // If there is local storage data, load it.
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk)),
);

// This subscriber writes to local storage anytime the state updates.
store.subscribe(() => {
  saveState(store.getState());
});



// Initially loaded reducers.
store.addReducers({
  app
});
