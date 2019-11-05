/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, LitElement } from 'lit-element';
import { loadNote } from '../actions/api.js';

import '@polymer/paper-card/paper-card.js';

import { translate as _ } from '../translate.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { documentIcon } from './gr-icons.js';

class MyNoteElement extends connect(store)(LitElement) {
  render() {
    if (this._note == undefined) {
      return html`
      <p>Loading ...</p>
      `
    }
    if (this._note.content == "error") {
      return html`
      <paper-card>
        <div class="card-content">
        <p>Error. <a class="link" @click="${this._reloadNote}">Reload</a></p>
        </div>
      </paper-card>
      `
    }
    return html`
      <style>
      paper-card {
        margin: 10px 0px;
        width: 100%;
      }
      .card-content p {
        margin: 1em 0;
      }
      .card-content p:first-child {
        margin-top: 0;
      }
      .card-content p:last-child {
        margin-bottom: 0;
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
      .note-head {
        margin-bottom: 1em;
      }
      .note-head svg {
        height: 1.5em;
        top: .42em;
        position: relative;
      }
      .note-head svg path {
        fill: rgba(0, 0, 0, 0.35);
      }
      </style>
      <paper-card>
        <div class="card-content">
          <div class="note-head">
            ${documentIcon}
            <span class="handle">${this.grampsid}</span>
          </div>
          <div id="note-content"></div>
        </div>
      </paper-card>
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
    grampsid: { type: String },
    _note: { type: Object },
  }}

  connectedCallback() {
    super.connectedCallback();
    let state = store.getState();
    if (state.api.token != undefined) {
      this.getNote();
    }
  }

  _reloadNote() {
    this._note = undefined;
    store.dispatch(loadNote(this._token, this._refresh_token, this.grampsid));
  }

  getNote() {
    let state = store.getState();
    this._token = state.api.token;
    this._refresh_token = state.api.refresh_token;
    store.dispatch(loadNote(this._token, this._refresh_token, this.grampsid));
  }

  stateChanged(state) {
    if (this._token == undefined) {
      this.getNote();
    } else if (this._token != state.api.token) {
      this.getNote();
    }
    if (state.api.notes != undefined && state.api.notes[this.grampsid] != undefined) {
      this._note = state.api.notes[this.grampsid];
      let noteContent = this.shadowRoot.getElementById("note-content")
      if (noteContent !=  undefined) {
        noteContent.innerHTML = this._note.content;
      }
    }
  }
}

window.customElements.define('gr-note-element', MyNoteElement);
