/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { TREE, STRINGS, TOKEN, LOGOUT } from '../actions/api.js';


const INITIAL_STATE = {
  people: {},
  families: {},
  events: {},
  places: {},
  strings: {},
  dbinfo: {},
  token: ''
};

const api = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKEN:
      return {
        ...state,
        token: action.token
      };
    case LOGOUT:
      return INITIAL_STATE;
    case TREE:
      return {
        ...state,
        people: action.tree.people,
        places: action.tree.places,
        families: action.tree.families,
        events: action.tree.events,
        dbinfo: action.tree.dbinfo,
      };
    case STRINGS:
      return {
        ...state,
        strings: action.strings.data
      };
    default:
      return state;
  }
};

export default api;
