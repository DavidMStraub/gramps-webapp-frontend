
export const PEOPLE = 'PEOPLE';
export const FAMILIES = 'FAMILIES';
export const EVENTS = 'EVENTS';
export const STRINGS = 'STRINGS';
export const DBINFO = 'DBINFO';
export const PLACES = 'PLACES';
export const TOKEN = 'TOKEN';
export const LOGOUT = 'LOGOUT';

import { activePersonIfEmpty } from './app.js'

export const getAuthToken = (host, password) => async (dispatch) => {
  fetch(host + `/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'password': password})
    })
    .then(resp => resp.json())
    .then(data => {
      dispatch(storeAuthToken(data.access_token));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const loadDbInfo = (host, token) => async (dispatch) => {
  fetch(host + `/dbinfo`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => {
      var respStatus = resp.status;
      if (respStatus == 401) {
        dispatch(logout());
      }
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .then(data => {
      dispatch(getDbInfo(data));
      dispatch(activePersonIfEmpty(data.default_person));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const loadPeople = (host, token) => async (dispatch) => {
  fetch(host + `/people`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => resp.json())
    .then(data => dispatch(getPeople(data)))
    .catch((error) => console.log(error));
};

export const loadPlaces = (host, token) => async (dispatch) => {
  fetch(host + `/places`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => resp.json())
    .then(data => dispatch(getPlaces(data)))
    .catch((error) => console.log(error));
};

export const loadFamilies = (host, token) => async (dispatch) => {
  fetch(host + `/families`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => resp.json())
    .then(data => dispatch(getFamilies(data)))
    .catch((error) => console.log(error));
};

export const loadEvents = (host, token) => async (dispatch) => {
  fetch(host + `/events`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => resp.json())
    .then(data => dispatch(getEvents(data)))
    .catch((error) => console.log(error));
};


const storeAuthToken = (data) => {
  return {
    type: TOKEN,
    token: data
  };
};

const getPeople = (data) => {
  return {
    type: PEOPLE,
    people: data
  };
};

const getPlaces = (data) => {
  return {
    type: PLACES,
    places: data
  };
};

const getDbInfo = (data) => {
  return {
    type: DBINFO,
    dbinfo: data
  };
};

const logout = () => {
  return {
    type: LOGOUT
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
  "Number of places",
  "Places",
  "Type",
  "and",
  "Primary",
  "Family",
  "Gallery",
  "Map",
  "Unknown",
  "Custom",
  "Country",
  "State",
  "County",
  "City",
  "Parish",
  "Locality",
  "Street",
  "Province",
  "Region",
  "Department",
  "Neighborhood",
  "District",
  "Borough",
  "Municipality",
  "Town",
  "Village",
  "Hamlet",
  "Farm",
  "Building",
  "Number"
]

export const loadStrings = (host) => async (dispatch) => {
  fetch(host + `/translate?strings=` + JSON.stringify(_strings))
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
