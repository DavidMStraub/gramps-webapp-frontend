/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewRelationships extends connect(store)(PageViewElement) {
  render() {
    const gramps_id = store.getState().app.activePerson
    return html`
      ${SharedStyles}
      <section>
        <h2>Relationships</h2>
        <p>ID: ${gramps_id}</p>
      </section>
    `
    }
}

window.customElements.define('my-view-relationships', MyViewRelationships);
