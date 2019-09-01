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
import './gr-gallery-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';



class MyViewSource extends connect(store)(PageViewElement) {
  render() {
    if (this._source == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      <style>
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
      </style>
      <section>
        <div id="title">
          <h2>${this._source.title}</h2>
        </div>


        <table width="100%">
          ${this._source.author == '' ? '' : html`
            <tr>
              <th>${_("Author")}</th>
              <td>${this._source.author}</td>
            </tr>
          `}
          ${this._source.pubinfo == '' ? '' : html`
            <tr>
              <th>${_("Publication Information")}</th>
              <td>${this._source.pubinfo}</td>
            </tr>
          `}
        </table>


        ${this._media.length ? html`<h3>${_("Gallery")}</h3>` : ''}
        <gr-gallery-element .images=${this._media} host="${this._host}" token="${this._token}">
        </gr-gallery-element>

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
      this._media = Array();
    }


    static get properties() { return {
      _source: { type: Object },
      _gramps_id: { type: String },
      _host: { type: String },
      _token: { type: String },
      _media: { type: Object },
    }}


    firstUpdated() {
    }

    stateChanged(state) {
      this._host = state.app.host;
      this._token = state.api.token;
      this._gramps_id = state.app.activeSource;
      this._source = state.api.sources[this._gramps_id];
      if (this._source != undefined) {
        this._media = this._source.media;
      }
    }

}

window.customElements.define('gr-view-source', MyViewSource);
