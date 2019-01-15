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
import './my-family-element.js';
import './my-events-element.js';

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
      <section>
        <h2>${this._person.name_surname}, ${this._person.name_given}</h2>
      <h3>${_("Parents")}</h3>
      ${this._parents ? html`<my-family-element
        gramps_id="${this._parents}"
        siblings father mother></my-family-element>` : '' }
      ${this._person.families ? this._person.families.map((f) => html`
        <h3>${_("Partner")}</h3>
        <my-family-element
        gramps_id="${f}"
        father
        mother></my-family-element>`) : '' }
      </section>
    `
    }

    static get properties() { return {
      _gramps_id: { type: String },
      _person: { type: Object },
      _parents: { type: String },
      _events: { type: Object }
    }}

    static get styles() {
        return [
          SharedStyles
        ]
    }

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
      this._person = state.api.people[this._gramps_id];
      if (this._person != undefined) {
        this._parents = this._person.parents;
        this._events = this._person.events.map((handle) => state.api.events[handle]);
      }
    }

}

window.customElements.define('my-view-relationships', MyViewRelationships);
