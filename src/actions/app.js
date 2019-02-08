/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const ACTIVE_PERSON = 'ACTIVE_PERSON';
export const ACTIVE_PERSON_IF_EMPTY = 'ACTIVE_PERSON_IF_EMPTY';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page_id = path === '/' ? 'view-dashboard' : path.slice(1);
  const page = page_id.split('/')[0]
  const id = page_id.split('/')[1]

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  if (typeof(id) != 'undefined') {
    dispatch(loadPageId(page, id));
  } else {
    dispatch(loadPage(page));
  }


  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPageId = (page, id) => (dispatch) => {
  switch(page) {
    case 'view-tree':
      import('../components/my-view-tree.js').then((module) => {
      });
    case 'view-person':
      import('../components/my-view-person.js').then((module) => {
      });
  }
  dispatch(activePerson(id));
  dispatch(updatePage(page));
  window.scrollTo(0, 0);
}

const loadPage = (page) => (dispatch) => {
  switch(page) {
    case 'view-dashboard':
      import('../components/my-view-dashboard.js').then((module) => {
        // Put code in here that you want to run every time when
        // navigating to view-dashboard after my-view-dashboard.js is loaded.
      });
      break;
    case 'view-people':
      import('../components/my-view-people.js');
      break;
    case 'view-families':
      import('../components/my-view-families.js');
      break;
    case 'view-places':
      import('../components/my-view-places.js');
      break;
    case 'view-events':
      import('../components/my-view-events.js');
      break;
    case 'view-tree':
      import('../components/my-view-tree.js');
      break;
    case 'view-person':
      import('../components/my-view-person.js');
      break;
    default:
      page = 'view404';
      import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

export const activePerson = (id) => {
  return {
    type: ACTIVE_PERSON,
    id
  };
};

export const activePersonIfEmpty = (id) => {
  return {
    type: ACTIVE_PERSON_IF_EMPTY,
    id
  };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wideLayout) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WIDE_LAYOUT,
    wideLayout
  })
  // Open the drawer when we are switching to wide layout and close it when we are
  // switching to narrow.
  dispatch(updateDrawerState(wideLayout));
};

export const updateDrawerState = (opened) => (dispatch, getState) => {
  const app = getState().app;
  // Don't allow closing the drawer when it's in wideLayout.
  if (app.drawerOpened !== opened && (!app.wideLayout || opened)) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};
