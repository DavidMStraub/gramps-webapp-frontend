
export const PEOPLE = 'PEOPLE';
export const FAMILIES = 'FAMILIES';
export const EVENTS = 'EVENTS';
export const STRINGS = 'STRINGS';
export const DBINFO = 'DBINFO';

import { activePersonIfEmpty } from './app.js'

export const loadDbInfo = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/dbinfo`)
    .then(resp => resp.json())
    .then(data => {
      dispatch(getDbInfo(data));
      dispatch(activePersonIfEmpty(data.default_person));
    })
    .catch((error) => console.log(error));
};

export const loadPeople = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/people`)
    .then(resp => resp.json())
    .then(data => dispatch(getPeople(data)))
    .catch((error) => console.log(error));
};

export const loadFamilies = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/families`)
    .then(resp => resp.json())
    .then(data => dispatch(getFamilies(data)))
    .catch((error) => console.log(error));
};

export const loadEvents = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/events`)
    .then(resp => resp.json())
    .then(data => dispatch(getEvents(data)))
    .catch((error) => console.log(error));
};

const getPeople = (data) => {
  return {
    type: PEOPLE,
    people: data
  };
};

const getDbInfo = (data) => {
  return {
    type: DBINFO,
    dbinfo: data
  };
};

const getFamilies = (data) => {
  return {
    type: FAMILIES,
    families: data
  };
};

const getEvents = (data) => {
  return {
    type: EVENTS,
    events: data
  };
};

const _strings = [
  "Birth Date",
  "Death Date",
  "Relationships",
  "People",
  "Families",
  "Dashboard",
  "Given name",
  "Surname",
  "Marriage Date",
  "Name",
  "Father",
  "Mother",
  "Married",
  "Event",
  "Place",
  "Description",
  "Date",
  "Type",
  "Events",
  "Parents",
  "Siblings",
  "Children",
  "Home Page",
  "Details",
  "in",
  "Spouses",
  "Family Tree",
  "Database overview",
  "Number of individuals",
  "Number of families",
  "Number of events",
  "Number of places"
]

export const loadStrings = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/translate?strings=` + JSON.stringify(_strings))
    .then(resp => resp.json())
    .then(data => dispatch(getStrings(data)))
    .catch((error) => console.log(error));
};

const getStrings = (data) => {
  return {
    type: STRINGS,
    strings: data
  };
};
