/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, LitElement } from 'lit-element';

import { translate as _ } from '../translate.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { bookIcon, paperclipIcon, quoteCloseIcon } from './gr-icons.js';

import './gr-note-element.js';


class MyCitationsElement extends connect(store)(LitElement) {
  render() {
    var _host = this._host;
    var _token = this._token;
    var _addMimeType = this._addMimeType;
    let state = store.getState();
    this._citations = this.citations.map(c => state.api.citations[c]);
    this._sources = this.citations.map(c => state.api.sources[state.api.citations[c].source]);
    this._sources = [...new Set(this._sources)];  // eliminate duplicates
    return html`
      <style>
      h3 svg {
        height: 1.6em;
        top: .46em;
        position: relative;
      }
      h4 svg {
        height: 2em;
        top: 0.6em;
        position: relative;
      }
      h3 svg path, h4 svg path {
        fill: rgba(0, 0, 0, 0.2);
      }
      .handle {
        font-size: 0.8em;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 0.3em 0.5em;
        margin: 0 0.3em;
        border-radius: 0.5em;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
      }
      div.citation {
        margin-left: 1em;
      }
      div.citation-content {
        margin-left: 2em;
      }
      </style>
      ${this._sources.map(source => html`
      <h3><a href="/source/${source.gramps_id}">${bookIcon} ${source.title}  <span style="font-size:0.5em;top:-0.4em;position:relative;"><span class="handle">${source.gramps_id}</span></span></a>
      ${source.media.length || source.notes.length ? paperclipIcon : ''}
      </h3>
      ${this._citations.map(function(citation) {
          if (citation.source != source.gramps_id) {
            return html``;
          }
          return html`
          <div class="citation">
            <h4>${quoteCloseIcon}  ${citation.page ? citation.page : _("Citation")}</h4>
            <div class="citation-content">
              ${citation.notes.map(n => html`
              <gr-note-element grampsid=${n}>
              </gr-note-element>
              `)}
            </div>
            <div style="clear:left;"></div>

            <div class="citation-content">
              <gr-gallery-element
                .images=${_addMimeType(citation.media, store.getState())}
                host=${_host}
                token=${_token}>
              </gr-gallery-element>
            </div>
            <div style="clear:left;"></div>
          </div>
        `})}
      `)}
    `
  }

  static get styles() {
      return [
        SharedStyles
      ]
  }

  firstUpdated() {
  }

  static get properties() { return {
    citations: { type: Array }
  }}

  _addMimeType(mhandles, state) {
    return mhandles.map(function(mobj) {
      mobj.mime = state.api.media[mobj.ref].mime;
      return mobj;
    })
  }

  stateChanged(state) {
    this._host = state.app.host;
    this._token = state.api.token;
  }
}

window.customElements.define('gr-citations-element', MyCitationsElement);
