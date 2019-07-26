/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { loadPeople, loadFamilies, loadEvents, loadStrings, loadPlaces, loadDbInfo, getAuthToken } from '../actions/api.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

import './my-lightbox-element.js';
import './my-media-element.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// We are lazy loading its reducer.
import api from '../reducers/api.js';
store.addReducers({
  api
});

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLightboxState,
  updateActiveMedia,
  updateLayout,
  storeHost
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './snack-bar.js';
import { menuIcon, accountIcon, familyIcon, personDetailIcon, homeIcon, mapIcon, pedigreeIcon, placeIcon, calendarIcon } from './my-icons.js';

class MyApp extends connect(store)(LitElement) {
  render() {
    // Anything that's related to rendering should be done in here.
    if (!this._token) {
      return html`
      <style>
      div#outer {
        display: grid;
        height: 100vh;
        margin: 0;
        place-items: center center;
      }

      div#inner {
        /* text-align: center; */
      }
      </style>
      <div id="outer">
      <div id="inner">
      <form id="login-form">
      <paper-input @keypress="${this._handleInputKeypress}" label="password" type="password" id="login-input" autofocus></paper-input>
      <paper-input @keypress="${this._handleInputKeypress}" label="host" type="url" id="host-input" placeholder="https://example.com:1234"></paper-input>
      <paper-button @click="${this._submitLogin}">login</paper-button>
      </form>
      </div>
      </div>
      `
    }
    if (!this._loaded) {
      return html`
      <style>
      div#outer {
        display: grid;
        height: 100vh;
        margin: 0;
        place-items: center center;
      }

      div#inner {
        text-align: center;
      }

      paper-spinner-lite {
        width: 3em;
        height: 3em;
        --paper-spinner-color: #5D4037;
      }

      img#logo {
        height: 5em;
      }
      </style>
      <div id="outer">
      <div id="inner">
      <p><img id="logo" src="images/logo.svg"></p>
      <p><paper-spinner-lite active></paper-spinner-lite></p>
      <p>Loading family tree ...</p>
      </div>
      </div>
      `
    }
    return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

        --app-primary-color: #2979FF;
        --app-secondary-color: #5D4037;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: #EFEBE9;
        --app-section-even-color: white;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: #BCAAA4;
        --app-drawer-selected-color: var(--app-light-text-color);
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      [main-title] {
        /* font-family: 'Fondamento'; */
        font-size: 30px;
        margin-right: 44px;
      }

      .menu-btn {
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        height: 44px;
        width: 44px;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list > a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
        outline: none;
      }

      .drawer-list svg {
        height: 1em;
        top: .125em;
        position: relative;
      }

      .drawer-list svg path {
        fill: var(--app-drawer-text-color);
      }

      .drawer-list a[selected] svg path {
        fill: var(--app-drawer-selected-color);
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
      }

      .main-content {
        /* padding-top: 64px; */
        min-height: 100vh;

      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
        text-align: center;
      }

      nav > hr {
        border: 0.5px solid rgba(255, 255, 255, 0.1);
        margin-left: -24px;
        margin-right: -24px;
      }

      span.activePerson {
        font-weight: 200;
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        outline: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Wide layout */
      @media (min-width: 768px) {
        app-header,
        .main-content,
        footer {
          margin-left: var(--app-drawer-width);
        }
        .menu-btn {
          display: none;
        }

        [main-title] {
          margin-right: 0;
        }
      }
    </style>

    <!-- Header -->

    <!-- Drawer content -->
    <app-drawer .opened="${this._drawerOpened}" .persistent="${this._wideLayout}"
        @opened-changed="${this._drawerOpenedChanged}">
      <nav class="drawer-list">
        <a ?selected="${this._page === 'view-dashboard'}" href="/view-dashboard">${homeIcon} ${_('Home Page')}</a>
        <hr>
        <a ?selected="${this._page === 'view-people'}" href="/view-people">${accountIcon} ${_('People')}</a>
        <a ?selected="${this._page === 'view-families'}" href="/view-families">${familyIcon} ${_('Families')}</a>
        <a ?selected="${this._page === 'view-events'}" href="/view-events">${calendarIcon} ${_('Events')}</a>
        <a ?selected="${this._page === 'view-places'}" href="/view-places">${placeIcon} ${_('Places')}</a>
        <a ?selected="${this._page === 'view-map'}" href="/view-map">${mapIcon} ${_('Map')}</a>
        <hr>
        <span class="activePerson">${this._activePerson ? this._activePerson.name_surname +  ',': ''}
        ${this._activePerson ? this._activePerson.name_given: ''}</span>
        <a ?selected="${this._page === 'view-person'}" href="/view-person/${this._activePerson.gramps_id}">${personDetailIcon} ${_('Details')}</a>
        <a ?selected="${this._page === 'view-tree'}" href="/view-tree">${pedigreeIcon} ${_('Family Tree')}</a>
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main role="main" class="main-content">
      <my-view-dashboard class="page" ?active="${this._page === 'view-dashboard'}"></my-view-dashboard>
      <my-view-people class="page" ?active="${this._page === 'view-people'}"></my-view-people>
      <my-view-person class="page" ?active="${this._page === 'view-person'}" id="my-view-person"></my-view-person>
      <my-view-families class="page" ?active="${this._page === 'view-families'}"></my-view-families>
      <my-view-events class="page" ?active="${this._page === 'view-events'}"></my-view-events>
      <my-view-places class="page" ?active="${this._page === 'view-places'}"></my-view-places>
      <my-view-map class="page" ?active="${this._page === 'view-map'}"></my-view-map>
      <my-view-tree class="page" ?active="${this._page === 'view-tree'}"></my-view-tree>
      <my-view-event class="page" ?active="${this._page === 'view-event'}" id="my-view-event"></my-view-event>
      <my-view-place class="page" ?active="${this._page === 'view-place'}" id="my-view-place"></my-view-place>
      <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
    </main>

    <my-lightbox-element .opened="${this._lightboxOpened}">
      <my-media-element handle="${this._activeMedium}">
      </my-media-element>
    </my-lightbox-element>


    <!-- <footer>
      <p></p>
    </footer>-->

    <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _lightboxOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _wideLayout: { type: Boolean },
      _people: {type: Array},
      _activePerson: {type: String},
      _loaded : {type: Boolean},
      _token : {type: String}
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    this._loaded = false;
    this._lightboxOpened = false;
    this._token = '';
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 768px)`,
        (matches) => store.dispatch(updateLayout(matches)));
    this.addEventListener('lightbox-opened-changed', (e) => this._lightboxOpenedChanged(e));
    this.addEventListener('media-selected', (e) => this._mediaSelected(e));
  }


  _loadData(host, token) {
    store.dispatch(loadDbInfo(host, token));
    store.dispatch(loadStrings(host));
    store.dispatch(loadPeople(host, token));
    store.dispatch(loadFamilies(host, token));
    store.dispatch(loadEvents(host, token));
    store.dispatch(loadPlaces(host, token));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

  _lightboxOpenedChanged(e) {
    store.dispatch(updateLightboxState(e.detail.opened));
  }

  _mediaSelected(e) {
    store.dispatch(updateActiveMedia(e.detail));
  }

  _submitLogin(e) {
    const hostInput = this.shadowRoot.querySelector('#host-input');
    store.dispatch(storeHost(hostInput.value));
    const loginInput = this.shadowRoot.querySelector('#login-input');
    store.dispatch(getAuthToken(hostInput.value, loginInput.value));
  }

  _handleInputKeypress(e) {
    if (e.key == 'Enter') {
      this._submitLogin(e);
    }
  }

  stateChanged(state) {
    if (state.api.token && !this._token) {
      this._loadData(state.app.host, state.api.token);
    }
    this._token = state.api.token;
    if (!this._loaded) {
      if ('api' in state
          && Object.keys(state.api.people).length
          && Object.keys(state.api.families).length
          && Object.keys(state.api.events).length
          && Object.keys(state.api.strings).length
          && Object.keys(state.api.dbinfo).length) {
          this._loaded = true;
      }
    }
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._lightboxOpened = state.app.lightboxOpened;
    this._wideLayout = state.app.wideLayout;
    this._people = state.api.people;
    this._activeMedium = state.app.activeMedium;
    this._activePerson = state.api.people[state.app.activePerson];
    this._activeEvent = state.api.people[state.app.activeEvent];
  }
}

window.customElements.define('my-app', MyApp);
