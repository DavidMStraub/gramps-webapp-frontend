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
import './gr-note-element.js';
import './gr-citations-element.js';

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
          ${this._source.repositories == '' ? '' : html`
            <tr>
              <th>${_("Repositories")}</th>
              <td>${this._repositories.join(', ')}</td>
            </tr>
          `}
        </table>

        ${this._media.length ? html`<h3>${_("Media")}</h3>` : ''}
        <gr-gallery-element .images=${this._media} token="${this._token}">
        </gr-gallery-element>


        ${this._notes.length ? html`<h3>${_("Notes")}</h3>` : ''}
        ${this._notes.map(n => html`
        <gr-note-element grampsid=${n}>
        </gr-note-element>
        `)}
  
        ${this._citations.length ? html`<h3>${_("Citations")}</h3>` : ''}
        <gr-citations-element .citations=${this._citations} nosources>
        </gr-citations-element>

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
      _token: { type: String },
      _media: { type: Object },
    }}

    firstUpdated() {
    }

    _addMimeType(mhandles, state) {
      return mhandles.map(function(mobj) {
        mobj.mime = state.api.media[mobj.ref].mime;
        return mobj;
      })
    }

    stateChanged(state) {
      this._token = state.api.token;
      this._gramps_id = state.app.activeSource;
      this._source = state.api.sources[this._gramps_id];
      if (this._source != undefined) {
        this._media = this._addMimeType(this._source.media, state);
        this._notes = this._source.notes;
        this._citations = Object.values(state.api.citations).filter(c => c.source == this._gramps_id).map(c => c.gramps_id);
        this._repositories = this._source.repositories.map(repo => state.api.repositories[repo].title);
       }
    }

}

window.customElements.define('gr-view-source', MyViewSource);
