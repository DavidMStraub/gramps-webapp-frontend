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

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewRelationships extends connect(store)(PageViewElement) {
  render() {
    if (this._person == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      ${SharedStyles}
      <section>
        <h2>${this._person.name_surname}, ${this._person.name_given}</h2>
        <p>ID: ${this._gramps_id}</p>
        <p>${_("Birth Date")}: ${this._person.birthdate} in ${this._person.birthplace}</p>
        <p>${_("Death Date")}: ${this._person.deathdate} in ${this._person.deathplace}</p>
      </section>
    `
    }

    static get properties() { return {
      _gramps_id: { type: String },
      _person: { type: Object }
    }}

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
      this._person = state.api.people[this._gramps_id];
    }

}

window.customElements.define('my-view-relationships', MyViewRelationships);
