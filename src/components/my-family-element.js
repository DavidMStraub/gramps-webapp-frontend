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

import './my-children-element.js';
import './my-person-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyFamilyElement extends connect(store)(LitElement) {
  render() {
    const state = store.getState();
    if (!('families' in state.api)) {
      return html`Loading...`;
    }
    this._family = state.api.families[this.gramps_id];
    this._father = state.api.people[this._family.father_id];
    this._mother = state.api.people[this._family.mother_id];
    this._children = this._family.children.map((gid) => state.api.people[gid]);
    return html`
      <p>${this._father ? html`<my-person-element .person=${this._father}></my-person-element>` : 'NN'}
      <span style="display:block;padding-left:1em;">⚭ ${this._family.marriagedate ? this._family.marriagedate : ''} ${this._family.marriageplace ? _("in ") + this._family.marriageplace: ''}</span>
      <my-person-element .person=${this._mother}></my-person-element>
      </p>
      ${this._family.children.length > 0 ?
        html`
        <h3>${this.siblings ? _("Siblings") : _("Children")}</h3>
        <my-children-element .items="${this._children}"></my-children-element>`
        : '' }
    `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
      this._family = {};
      this._father = {};
      this._mother = {};
    }

    static get properties() { return {
      gramps_id: { type: String },
      father: {type: Boolean},
      mother: {type: Boolean},
      siblings: {type: Boolean},
      _family: {type: Object},
      _father: {type: Object},
      _mother: {type: Object},
      _children: {type: Array}
    }}
    //
    // stateChanged(state) {
    //   if (this._family != undefined) {
    //     this._father = state.api.people[this._family.father_id];
    //     this._mother = state.api.people[this._family.mother_id];
    //     this._children = this._family.children.map((gid) => state.api.people[gid]);
    //   }
    // }

}

window.customElements.define('my-family-element', MyFamilyElement);
