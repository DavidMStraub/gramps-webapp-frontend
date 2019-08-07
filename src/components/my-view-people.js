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

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

import { translate as _ } from '../translate.js';

// This element is connected to the Redux store.
import { store } from '../store.js';


import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-selection-column.js';

class MyViewPeople extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      vaadin-grid {
        height:calc(100vh - 48px);
      }
      </style>
      <section>
        <vaadin-grid .items=${this._people} theme="row-dividers" multi-sort>
          <vaadin-grid-selection-column auto-select hidden></vaadin-grid-selection-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="gramps_id">ID</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/view-person/[[item.gramps_id]]"><div>[[item.gramps_id]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="name_given" direction="asc">${_('Given name')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="name_given"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-person/[[item.gramps_id]]"><div>[[item.name_given]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column ?hidden="true">
            <template class="header">
              <vaadin-grid-sorter path="name_surname" direction="asc">${_('Surname')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="name_surname"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-person/[[item.gramps_id]]"><div>[[item.name_surname]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="birthdate">${_('Birth Date')}</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/view-person/[[item.gramps_id]]"><div>[[item.birthdate]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="deathdate">${_('Death Date')}</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/view-person/[[item.gramps_id]]"><div>[[item.deathdate]]</div></a>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
    `
  }

  static get styles() {
      return [
        SharedStyles
      ]
  }

  constructor() {
    super();
    this._hidden = false;
  }

  static get properties() { return {
    _people: { type: Object },
    _hidden: { type: Boolean }
  }}

  stateChanged(state) {
    this._people = Object.values(state.api.people);
    this._hidden = !state.app.wideLayout;
  }

  firstUpdated() {
    // const grid = this.shadowRoot.querySelector('vaadin-grid');
    // grid.items = Object.values(store.getState().api.people);
  }

}

window.customElements.define('my-view-people', MyViewPeople);
