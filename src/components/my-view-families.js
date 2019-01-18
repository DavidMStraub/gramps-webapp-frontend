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

import { navigate } from '../actions/app.js';

import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';

class MyViewFamilies extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      vaadin-grid {
        height:calc(100vh - 112px);
      }
      </style>
      <section>
        <vaadin-grid .items=${this._families} theme="row-dividers" multi-sort>
          <vaadin-grid-selection-column auto-select hidden></vaadin-grid-selection-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="gramps_id">ID</vaadin-grid-sorter>
            </template>
            <template>
              [[item.gramps_id]]
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="father_name" direction="asc">${_('Father')}</vaadin-grid-sorter>
              <vaadin-grid-filter path="father_name"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-person/[[item.father_id]]"><div>[[item.father_name]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="mother_name">${_('Mother')}</vaadin-grid-sorter>
              <vaadin-grid-filter path="mother_name"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-person/[[item.mother_id]]"><div>[[item.mother_name]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="marriagedate">${_('Marriage Date')}</vaadin-grid-sorter>
            </template>
            <template>
              [[item.marriagedate]]
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

  static get properties() { return {
    _families: { type: Object },
    _hidden: { type: Boolean }
  }}

  stateChanged(state) {
    this._families = Object.values(store.getState().api.families);
    this._hidden = !store.getState().app.wideLayout;
  }

  firstUpdated() {
    // const grid = this.shadowRoot.querySelector('vaadin-grid');
    // grid.items = Object.values(store.getState().api.families);
  }

}

window.customElements.define('my-view-families', MyViewFamilies);
