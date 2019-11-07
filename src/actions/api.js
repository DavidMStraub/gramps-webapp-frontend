
export const TREE = 'TREE';
export const NOTE = 'NOTE';
export const STRINGS = 'STRINGS';
export const TOKEN = 'TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const LOGOUT = 'LOGOUT';

import { activePersonIfEmpty } from './app.js'




export const loadNote = (token, refreshToken, id) => async (dispatch) => {
  fetch(window.APIHOST + `/api/note/` + id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    .then(resp => {
      var respStatus = resp.status;
      if (respStatus == 401) {
        dispatch(refreshAuthToken(refreshToken));
        return {};
      } else if (respStatus == 403 || respStatus == 422) {
        dispatch(apiLogout());
      }
      if (respStatus != 200) {
        return {"gramps_id": id, "content": "error"};
      }
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .then(data => {
      dispatch(getNote(data));
    })
    .catch((error) => {
      console.log(error);
    });
};


export const getAuthToken = (username, password) => async (dispatch) => {
  fetch(window.APIHOST + `/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': username, 'password': password})
    })
    .then(resp => resp.json())
    .then(data => {
      // Set expected token refresh date to now + 15 minutes
      let expires = Date.now() + 15 * 60 * 1000;
      dispatch(storeAuthToken(data.access_token, expires));
      dispatch(storeRefreshToken(data.refresh_token));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const refreshAuthToken = (refreshToken) => async (dispatch) => {
  fetch(window.APIHOST + `/api/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + refreshToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      var respStatus = resp.status;
      if (respStatus == 403 || respStatus == 422) {
        dispatch(apiLogout());
      }
      return resp.json();
    })
    .then(data => {
      // Set expected token refresh date to now + 15 minutes
      let expires = Date.now() + 15 * 60 * 1000;
      dispatch(storeAuthToken(data.access_token, expires));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const loadTree = (token, refreshToken) => async (dispatch) => {
  fetch(window.APIHOST + `/api/tree`, {
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
        dispatch(refreshAuthToken(refreshToken));
        return null;
      } else if (respStatus == 403 || respStatus == 422) {
        dispatch(apiLogout());
      }
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .then(data => {
      if (data) {
        dispatch(getTree(data));
        if (data.dbinfo.default_person != '') {
          dispatch(activePersonIfEmpty(data.dbinfo.default_person));
        } else {
          let first_person = Object.keys(data.people)[0];
          dispatch(activePersonIfEmpty(data.people[first_person].gramps_id));
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};


const storeAuthToken = (data, expires) => {
  return {
    type: TOKEN,
    token: data,
    expires: expires
  };
};

const storeRefreshToken = (data, expires) => {
  return {
    type: REFRESH_TOKEN,
    token: data,
    expires: expires
  };
};

const getTree = (data) => {
  return {
    type: TREE,
    tree: data
  };
};


const getNote = (data) => {
  return {
    type: NOTE,
    note: data
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
  "Zoom",
  "Author",
  "Publication info",
  "Source",
  "Sources",
  "Citation",
  "Citations",
  "Repository",
  "Repositories",
  "Note",
  "Notes",
  "Media"
]

export const loadStrings = () => async (dispatch) => {
  fetch(window.APIHOST + `/api/translate?strings=` + JSON.stringify(_strings))
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
