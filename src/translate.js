import { store } from './store.js';

export const translate = (s) => {
    const strings = store.getState().api.strings
    if  (s in strings) {
      return strings[s];
    } else {
      return  s;
    }

};
