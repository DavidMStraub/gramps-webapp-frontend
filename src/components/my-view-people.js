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

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { navigate } from '../actions/app.js';

import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';

class MyViewPeople extends connect(store)(PageViewElement) {
  render() {
    return html`
      ${SharedStyles}
      <style>
      vaadin-grid {
        height:70vh;
      }
      a:link, a:visited, a:hover, a:active {
        color:black;
        text-decoration:none;
        outline: none;
      }
      </style>
      <section>
      Lorem
        <vaadin-grid theme="row-dividers" multi-sort>
          <vaadin-grid-selection-column auto-select hidden></vaadin-grid-selection-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="gramps_id">ID</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/view-relationships/[[item.gramps_id]]"><div>[[item.gramps_id]]</div>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="name_given" direction="asc">First name</vaadin-grid-sorter>
              <vaadin-grid-filter path="name_given"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-relationships/[[item.gramps_id]]"><div>[[item.name_given]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="name_surname" direction="asc">Last name</vaadin-grid-sorter>
              <vaadin-grid-filter path="name_surname"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-relationships/[[item.gramps_id]]"><div>[[item.name_surname]]</div></a>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
    `
  }

  firstUpdated() {
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    grid.items = store.getState().api.people;
  }

}

window.customElements.define('my-view-people', MyViewPeople);
