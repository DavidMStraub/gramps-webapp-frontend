import { store } from 'store.js';

export const translate = (s) => {
    const strings = store.getState().api.strings
    return strings[s];
};
