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

class MyViewPlaces extends connect(store)(PageViewElement) {
  render() {
    return html`
      <section>
        <vaadin-grid .items=${this._places} theme="row-dividers" multi-sort>
          <vaadin-grid-selection-column auto-select hidden></vaadin-grid-selection-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="gramps_id">ID</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/place/[[item.gramps_id]]"><div>[[item.gramps_id]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="name" direction="asc">${_('Name')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="name"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/place/[[item.gramps_id]]"><div>[[item.name]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="type_string">${_('Type')}</vaadin-grid-sorter>
            </template>
            <template>
              [[item.type_string]]
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
    _places: { type: Object },
    _hidden: { type: Boolean }
  }}

  stateChanged(state) {
    this._places = Object.values(state.api.places);
    this._hidden = !store.getState().app.wideLayout;
  }

  firstUpdated() {
  }

}

window.customElements.define('gr-view-places', MyViewPlaces);
