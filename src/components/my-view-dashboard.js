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

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewDashboard extends connect(store)(PageViewElement) {
  render() {
    return html`
      <section>
        <h2>${_('Home Page')}</h2>
        <p>${this._db_name}</p>

      </section>
    `
  }

  static get styles() {
      return [
        SharedStyles
      ]
  }

  static get properties() { return {
    _db_name: { type: String },
  }}

  stateChanged(state) {
    this._db_name = state.api.dbinfo.name;
  }
}

window.customElements.define('my-view-dashboard', MyViewDashboard);
