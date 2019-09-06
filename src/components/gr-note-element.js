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


class MyNoteElement extends connect(store)(LitElement) {
  render() {
    if (this._note == undefined) {
      return html`
      <p>Loading ...</p>
      `
    }
    if (this._note.content == "error") {
      return html`
      <h4>${_("Note")} ${this.grampsid}</h4>
      <p>Error. <a class="link" @click="${this._reloadNote}">Reload</a></p>
      `
    }
    return html`
      <paper-card>
        <div class="card-content">
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
    store.dispatch(loadNote(this._host, this._token, this.grampsid));
  }

  getNote() {
    let state = store.getState();
    this._host = state.app.host;
    this._token = state.api.token;
    store.dispatch(loadNote(this._host, this._token, this.grampsid));
  }

  stateChanged(state) {
    if (this._token == undefined) {
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
