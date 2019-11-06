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
import { loadStrings, loadTree, getAuthToken, refreshAuthToken, apiLogout } from '../actions/api.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-collapse/iron-collapse.js';

import './gr-lightbox-element.js';
import './gr-media-element.js';

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
  activePerson,
  updateOffline,
  updateDrawerState,
  updateLightboxState,
  updateActiveMedia,
  updateLayout,
  appLogout
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './snack-bar.js';
import {
  menuIcon,
  accountIcon,
  familyIcon,
  personDetailIcon,
  homeIcon,
  mapIcon,
  pedigreeIcon,
  placeIcon,
  calendarIcon,
  homeAccountIcon,
  logoutIcon,
  bookIcon
} from './gr-icons.js';

import { SharedStyles } from './shared-styles.js';

class MyApp extends connect(store)(LitElement) {
  render() {
    // Anything that's related to rendering should be done in here.
    if (!this._token && !this._refresh_token) {
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
      <paper-button raised @click="${this._submitLogin}">login</paper-button>
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

      .app-drawer-content {
        background-color: var(--app-drawer-background-color);
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
        z-index: 3;
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
        z-index: 1000;
      }

      .drawer-list > a, .drawer-list > span {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
        outline: none;
      }

      .drawer-list > a.button, .drawer-list > span.button{
        display: inline-block;
        padding: 8px 0 0 24px;
      }

      .drawer-list > a.button svg, .drawer-list > span.button svg{
        height: 1.5em;
        width: 1.5em;
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
        min-height: 100vh;
        padding-top: 48px;
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

        .main-content {
          padding-top: 0;
        }
  
        [main-title] {
          margin-right: 0;
        }
      }
      .link {
        cursor: pointer;
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall" style="display: ${this._drawerOpened ? 'none' : 'initial'};">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
      </app-toolbar>
    </app-header>

    <!-- Drawer content -->
    <app-drawer .opened="${this._drawerOpened}" .persistent="${this._wideLayout}"
        @opened-changed="${this._drawerOpenedChanged}" style="z-index:9999;">
      <div class="app-drawer-content" style="height: 100%; overflow: auto;">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'dashboard'}" href="/dashboard">${homeIcon} ${_('Home Page')}</a>
          <hr>
          <a ?selected="${this._page === 'people'}" href="/people">${accountIcon} ${_('People')}</a>
          <a ?selected="${this._page === 'families'}" href="/families">${familyIcon} ${_('Families')}</a>
          <a ?selected="${this._page === 'events'}" href="/events">${calendarIcon} ${_('Events')}</a>
          <a ?selected="${this._page === 'sources'}" href="/sources">${bookIcon} ${_('Sources')}</a>
          <a ?selected="${this._page === 'places'}" href="/places">${placeIcon} ${_('Places')}</a>
          <a ?selected="${this._page === 'map'}" href="/map">${mapIcon} ${_('Map')}</a>
          <hr>
          <span class="activePerson">${this._mainPerson ? html`<span class="link" @click="${this._setMainPersonActive}">${homeAccountIcon}</span>
          ` : ''}
          ${this._activePerson ? this._activePerson.name_surname +  ',': ''}
          ${this._activePerson ? this._activePerson.name_given: ''}</span>
          <a ?selected="${this._page === 'person'}" href="/person/${this._activePerson.gramps_id}">${personDetailIcon} ${_('Details')}</a>
          <a ?selected="${this._page === 'tree'}" href="/tree">${pedigreeIcon} ${_('Family Tree')}</a>
          <hr>
          <span class="button link" @click="${this._logout}">${logoutIcon}</span>
        </nav>
      </div>
    </app-drawer>

    <!-- Main content -->
    <main role="main" class="main-content">
      <gr-view-dashboard class="page" ?active="${this._page === 'dashboard'}"></gr-view-dashboard>
      <gr-view-people class="page" ?active="${this._page === 'people'}"></gr-view-people>
      <gr-view-person class="page" ?active="${this._page === 'person'}" id="gr-view-person"></gr-view-person>
      <gr-view-families class="page" ?active="${this._page === 'families'}"></gr-view-families>
      <gr-view-events class="page" ?active="${this._page === 'events'}"></gr-view-events>
      <gr-view-sources class="page" ?active="${this._page === 'sources'}"></gr-view-sources>
      <gr-view-places class="page" ?active="${this._page === 'places'}"></gr-view-places>
      <gr-view-map class="page" ?active="${this._page === 'map'}"></gr-view-map>
      <gr-view-tree class="page" ?active="${this._page === 'tree'}"></gr-view-tree>
      <gr-view-event class="page" ?active="${this._page === 'event'}" id="gr-view-event"></gr-view-event>
      <gr-view-place class="page" ?active="${this._page === 'place'}" id="gr-view-place"></gr-view-place>
      <gr-view-source class="page" ?active="${this._page === 'source'}" id="gr-view-source"></gr-view-source>
      <gr-view404 class="page" ?active="${this._page === 'view404'}"></gr-view404>
    </main>

    <gr-lightbox-element .opened="${this._lightboxOpened}">
      <gr-media-element handle="${this._activeMedium}">
      </gr-media-element>
    </gr-lightbox-element>


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
    this._loadDispatched = false;
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 768px)`,
        (matches) => store.dispatch(updateLayout(matches)));
    this.addEventListener('lightbox-opened-changed', (e) => this._lightboxOpenedChanged(e));
    this.addEventListener('media-load-error', throttle(this._refreshToken, 5000));
    this.addEventListener('media-selected', (e) => this._mediaSelected(e));
  }

  _setMainPersonActive() {
    if (this._page === 'person') {
      // In the person view, need to rewrite the URL as well
      window.history.pushState({}, '', '/person/' + this._mainPerson);
    }
    // set active person to main person
    store.dispatch(activePerson(this._mainPerson));
  }

  _loadData(token, refreshToken) {
    this._loadDispatched = true;
    store.dispatch(loadTree(token, refreshToken));
    store.dispatch(loadStrings());
  }

  _refreshToken() {
    let state = store.getState();
    let refreshToken = state.api.refresh_token;
    if (refreshToken) {
      store.dispatch(refreshAuthToken(refreshToken));
    }
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

  _logout() {
    this._token = null;
    this._refresh_token = null;
    this._loaded = false;
    store.dispatch(apiLogout());
    store.dispatch(appLogout());
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

  _toggleCollapse(e) {
    const ironToggle = this.shadowRoot.querySelector('#collapse-advanced');
    ironToggle.show();
    const moreButton = this.shadowRoot.querySelector('#more-options');
    moreButton.style.display = "none";
  }

  _submitLogin(e) {
    const loginInput = this.shadowRoot.querySelector('#login-input');
    store.dispatch(getAuthToken(loginInput.value));
  }

  _handleInputKeypress(e) {
    if (e.key == 'Enter') {
      this._submitLogin(e);
    }
  }

  stateChanged(state) {
    if (this._token && !this._loaded  && !this._loadDispatched) {
      this._loadData(state.api.token, state.api.refresh_token);
    }
    else if (this._token != state.api.token && !this._loaded) {
      this._loadDispatched = false;
      this._loadData(state.api.token, state.api.refresh_token);
    }
    this._token = state.api.token;
    if (state.api.expires) {
      let tokenExpiresIn = (state.api.expires - Date.now());
      if (tokenExpiresIn < 30 * 1000) {
        // If we have less than half a minute left, refresh the token
        throttle(this._refreshToken, 5000)();
      }
    }
    if (!this._loaded) {
      if ('api' in state
          && 'people' in state.api
          && Object.keys(state.api.people).length
          && Object.keys(state.api.families).length
          && Object.keys(state.api.events).length
          && Object.keys(state.api.strings).length
          && Object.keys(state.api.dbinfo).length) {
          this._loaded = true;
      } else {
        this._loaded = false;
      }
    }
    if (this._loaded) {
      this._token = state.api.token;
      this._refresh_token = state.api.refresh_token;
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
      this._mainPerson = state.api.dbinfo.default_person;
    }
  }
}

window.customElements.define('gr-app', MyApp);


function throttle (callback, limit) {
  var wait = false; 
  return function () { 
      if (!wait) {
          callback.call();
          wait = true;              
          setTimeout(function () {   
              wait = false;         
          }, limit);
      } else {
      }
  }
}