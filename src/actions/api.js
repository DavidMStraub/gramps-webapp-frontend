
export const TREE = 'TREE';
export const STRINGS = 'STRINGS';
export const TOKEN = 'TOKEN';
export const LOGOUT = 'LOGOUT';

import { activePersonIfEmpty } from './app.js'


export const getAuthToken = (host, password) => async (dispatch) => {
  fetch(host + `/api/login`, {
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

export const loadTree = (host, token) => async (dispatch) => {
  fetch(host + `/api/tree`, {
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
      dispatch(getTree(data));
      dispatch(activePersonIfEmpty(data.dbinfo.default_person));
    })
    .catch((error) => {
      console.log(error);
    });
};


const storeAuthToken = (data) => {
  return {
    type: TOKEN,
    token: data
  };
};

const getTree = (data) => {
  return {
    type: TREE,
    tree: data
  };
};

export const apiLogout = () => {
  return {
    type: LOGOUT
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
  "Number",
  "Number of generations:",
  "Zoom"
]

export const loadStrings = (host) => async (dispatch) => {
  fetch(host + `/api/translate?strings=` + JSON.stringify(_strings))
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
