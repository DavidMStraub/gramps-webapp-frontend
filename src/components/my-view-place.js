/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-badge/paper-badge.js';
import './my-family-element.js';
import './my-leaflet-map.js';
import './my-leaflet-map-marker.js';
import './my-gallery-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewPlace extends connect(store)(PageViewElement) {
  render() {
    if (this._place == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      <style>
      h2 {
      }
      div.item {
        float:left; margin:5px;
      }
      svg {
          height: 1em;
          top: .125em;
          position: relative;
      }
      svg path {
          fill: #aaa;
      }
      th {
        color: #777;
        font-size: 0.75em;
        font-weight: 500;
        text-align: right;
        max-width: 20em;
        padding-right: 1em;
        padding-top:0.3em;
      }
      td {
        margin: 0;
      }
      :host {
        --paper-tab-ink: var(--app-secondary-color);
        --paper-tabs-selection-bar-color: var(--app-secondary-color);
        --paper-badge-background:  var(--app-primary-color);
        --paper-badge-margin-left: 20px;
      }
      paper-tabs {
        /* background-color: var(--app-section-even-color); */
        color: var(--app-dark-text-color);
        font-weight: 400;
        font-size: 15px;
      }
      </style>
      <section>
        <div id="title">
          <h2>${this._place.name}</h2>
        </div>

        <table width="100%">
          <tr>
            <th>${_('Type')}</th>
            <td>${this._place.type_string}</td>
          </tr>
        </table>

        ${this._media.length ? html`<h3>${_("Gallery")}</h3>` : ''}
        <my-gallery-element .images=${this._media} host="${this._host}">
        </my-gallery-element>

        ${(this._place.geolocation && this._place.geolocation[0]) ? html`<h3>${_("Map")}</h3>
        <my-leaflet-map
          latitude=${this._place.geolocation[0]}
          longitude=${this._place.geolocation[1]}
          zoom=15
        >
          <my-leaflet-map-marker
            latitude=${this._place.geolocation[0]}
            longitude=${this._place.geolocation[1]}
          >
          </my-leaflet-map-marker>
        </my-leaflet-map>
        ` : ''}

      </section>

    `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
      this._selected = 0;
      this._media = Array();
    }


    static get properties() { return {
      _place: { type: Object },
      _gramps_id: { type: String },
      _host: { type: String },
      _events: { type: Object },
      _media: { type: Object },
      _hierarchy: { type: Object },
      _selected: { type: Number }
    }}


    _handleSelected(ev) {
        this._selected = ev.detail.selected;
        window.location.hash = this._selected;
    }

    _onHashChange(ev) {
      this._selected = ev.newURL.split('#')[1];
    }

    firstUpdated() {
      window.addEventListener('hashchange', this._onHashChange);
      if (window.location.hash.split('#')[1] != undefined) {
        this._selected = window.location.hash.split('#')[1];
      }
    }

    _personLink(p, lastItem) {
      if (p == undefined) {
        return ''
      }
      return html`
      <a href="/view-person/${p.gramps_id}">${p.name_given}
      ${p.name_surname}</a>${lastItem ? '' : ', '}
      `
    }

    stateChanged(state) {
      this._host = state.app.host;
      this._gramps_id = state.app.activePlace;
      this._place = state.api.places[this._gramps_id];
      if (this._place != undefined) {
        this._media = this._place.media;
        this._hierarchy = this._place._hierarchy;
      }
    }

}

window.customElements.define('my-view-place', MyViewPlace);
