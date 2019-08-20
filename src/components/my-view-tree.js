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
        <my-pedigree-element
          depth="3">
        </my-pedigree-element>
      </section>
    `
    }

    static get properties() { return {
      _gramps_id: { type: String },
    }}

    static get styles() {
        return [
          SharedStyles
        ]
    }

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
    }

}

window.customElements.define('my-view-tree', MyViewTree);
