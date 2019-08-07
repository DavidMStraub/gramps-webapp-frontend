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
import { PageViewElement } from './page-view-element.js';
import './my-pedigree-element.js';
import './my-pedigree-card.js';

import '@polymer/paper-slider/paper-slider.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class MyViewTree extends connect(store)(PageViewElement) {
  render() {
    if (this._gramps_id == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      <section>
        <div>
          <span style="font-size:0.8em;color:#666;padding-top:0.4em;">${_("Number of generations:")}</span>
          <paper-slider min="2" max="6" .value="${this._depth}" @value-changed="${this._updateDepth}" pin step="1" snaps>
          </paper-slider>
        </div>
        <my-pedigree-element .depth="${this._depth}">
        </my-pedigree-element>
      </section>
    `
    }

    static get properties() { return {
      _gramps_id: { type: String },
      _depth: { type: Number }
    }}


    _updateDepth(event) {
      if (event.detail.value) {
        this._depth = event.detail.value;
      }
    }

    constructor() {
      super();
      this._depth = 4;
    }
  

    static get styles() {
        return [
          SharedStyles
        ]
    }

    firstUpdated() {
      var state = store.getState();
      if (state.app.wideLayout) {
        this._depth = 4;
      } else {
        this._depth = 2;
      }
    }

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
    }

}

window.customElements.define('my-view-tree', MyViewTree);
