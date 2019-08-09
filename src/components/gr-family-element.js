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

import './gr-pedigree-card.js';
import './gr-children-element.js';
import './gr-person-element.js';

import { ringsIcon } from './gr-icons.js';

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
    if (this._family.marriageplace  != 'undefined' && this._family.marriageplace != '') {
        this._marriageplace_name = state.api.places[this._family.marriageplace].name;
    }
    this._father = state.api.people[this._family.father_id];
    this._mother = state.api.people[this._family.mother_id];
    this._children = this._family.children.map((gid) => state.api.people[gid]);
    return html`
      <div style="float:left;">
        <gr-pedigree-card .person=${this._father} width="200px" link="person" host="${this._host}" token="${this._token}"></gr-pedigree-card>
      </div>
      <span style="display:block;float:left;padding:0.8em 2em;text-align:center;">
      ${this._family.marriagedate ? html`${ringsIcon} ${this._family.marriagedate}` : ''} ${this._family.marriageplace ? html`<br>${_('in')} <a href="/place/${this._family.marriageplace}">${this._marriageplace_name}</a>`: ''}
      </span>
      <div style="float:left;">
        <gr-pedigree-card .person=${this._mother} width="200px" link="person" host="${this._host}" token="${this._token}"></gr-pedigree-card>
      </div>
      </p>
      <div style="clear:left;">
      </div>
      ${this._family.children.length > 0 ?
        html`
        <h3>${this.siblings ? _("Siblings") : _("Children")}</h3>
        <gr-children-element .items="${this._children}"></gr-children-element>`
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
      _children: {type: Array},
      _host: { type: String },
      _token: { type: String }
    }}

    stateChanged(state) {
      this._host = state.app.host;
      this._token = state.api.token;
    }
    //   if (this._family != undefined) {
    //     this._father = state.api.people[this._family.father_id];
    //     this._mother = state.api.people[this._family.mother_id];
    //     this._children = this._family.children.map((gid) => state.api.people[gid]);
    //   }
    // }

}

window.customElements.define('gr-family-element', MyFamilyElement);
