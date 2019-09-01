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


class MyCitationsElement extends connect(store)(LitElement) {
  render() {
    if (this._citations == undefined || !this._sources) {
        return html``;
    }
    return html`
    <ul>
      ${this._sources.map(source => html`
      <li><a href="/source/${source.gramps_id}">${source.title}</a>
        ${this._citations.map(function(citation) {
          if (citation.source != source.gramps_id) {
            return html``;
          }
          return html`
        <ul>
          <li>${citation.page}</li>
        </ul>
        `})}
      </li>`)}
    </ul>
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
    citations: { type: Array },
    _sources: { type: Array }
  }}

  stateChanged(state) {
    this._citations = this.citations.map(c => state.api.citations[c]);
    this._sources = this.citations.map(c => state.api.sources[state.api.citations[c].source]);
    this._sources = [...new Set(this._sources)];  // eliminate duplicates
  }
}

window.customElements.define('gr-citations-element', MyCitationsElement);
