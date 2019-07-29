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

import { clipIcon } from './my-icons.js';

import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';

class MyViewEvents extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      vaadin-grid {
        height:calc(100vh - 48px);
      }
      </style>
      <section>
        <vaadin-grid .items=${this._events} theme="row-dividers" multi-sort>
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
              <vaadin-grid-sorter path="date" direction="desc">${_('Date')}</vaadin-grid-sorter>
              <vaadin-grid-filter path="date"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-event/[[item.handle]]"><div>[[item.date]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="type">${_('Type')}</vaadin-grid-sorter>
            </template>
            <template>
              [[item.type]]
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="place_name">${_('Place')}</vaadin-grid-sorter>
              <vaadin-grid-filter path="place_name"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/view-place/[[item.place]]"><div>[[item.place_name]]</div></a>
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
    _events: { type: Object },
    _hidden: { type: Boolean },
  }}

  _get_place_name(state, event) {
    if (event.place != undefined && event.place != '') {
      event.place_name = state.api.places[event.place].name;
    };
    return event;
  }

  stateChanged(state) {
    this._events = Object.values(state.api.events).map((e) => this._get_place_name(state, e));
    this._hidden = !store.getState().app.wideLayout;
  }

  firstUpdated() {
  }

}

window.customElements.define('my-view-events', MyViewEvents);
