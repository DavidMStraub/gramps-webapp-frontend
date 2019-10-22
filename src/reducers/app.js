/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  UPDATE_PAGE,
  ACTIVE_PERSON,
  ACTIVE_EVENT,
  ACTIVE_PLACE,
  ACTIVE_SOURCE,
  ACTIVE_MEDIA,
  ACTIVE_PERSON_IF_EMPTY,
  UPDATE_OFFLINE,
  UPDATE_WIDE_LAYOUT,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  UPDATE_LIGHTBOX_STATE,
  LOGOUT
} from '../actions/app.js';


const INITIAL_STATE = {
  page: '',
  offline: false,
  drawerOpened: false,
  lightboxOpened: false,
  snackbarOpened: false,
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case ACTIVE_EVENT:
      return {
        ...state,
        activeEvent: action.id
      };
    case ACTIVE_PLACE:
      return {
        ...state,
        activePlace: action.id
      };
    case ACTIVE_SOURCE:
      return {
        ...state,
        activeSource: action.id
      };
    case ACTIVE_MEDIA:
      return {
        ...state,
        activeMedia: action.media
      };
    case ACTIVE_PERSON:
      return {
        ...state,
        activePerson: action.id
      };
    case ACTIVE_PERSON_IF_EMPTY:
      if ('activePerson' in state) {
        return state;
      } else {
        return {
          ...state,
          activePerson: action.id
        };
      }
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_WIDE_LAYOUT:
      return {
        ...state,
        wideLayout: action.wideLayout
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case UPDATE_LIGHTBOX_STATE:
      return {
        ...state,
        lightboxOpened: action.opened
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    case LOGOUT:
        return {
          ...state,
          token: null
        };
          default:
      return state;
  }
};

export default app;
