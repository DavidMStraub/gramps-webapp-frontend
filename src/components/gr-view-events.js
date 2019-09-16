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

class MyViewEvents extends connect(store)(PageViewElement) {
  render() {
    return html`
      <section>
        <vaadin-grid class="fullscreen" .items=${this._events} theme="row-dividers" multi-sort>
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
              <vaadin-grid-sorter path="date_sortval" direction="desc">${_('Date')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="date"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/event/[[item.handle]]"><div>[[item.date]]</div></a>
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
              <vaadin-grid-sorter path="primary_participants">${_('Participants')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="primary_participants"></vaadin-grid-filter>
            </template>
            <template>
              [[item.primary_participants]]
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

  _get_event_participants(state, event) {
    if (event.participants != undefined && event.participants[_("Primary")] != undefined) {
      var p_people = event.participants[_("Primary")].map(function(p, index) {
        if (p.type == 'Person') {
          return(state.api.people[p.gramps_id].name_given + ' ' + state.api.people[p.gramps_id].name_surname);
        }
      }).join(', ');
    } else {
      var p_people = ''
    }
    if (event.participants != undefined && event.participants[_("Family")] != undefined) {
      var p_families = event.participants[_("Family")].map(function(p, index) {
        if (p.type == 'Family') {
          return(state.api.families[p.gramps_id].father_name + ', ' + state.api.families[p.gramps_id].mother_name);
        }
      }).join(', ');
    } else {
      var p_families = ''
    }
    event.primary_participants =  p_people + p_families;
    return event;
  }

  stateChanged(state) {
    this._events = Object.values(state.api.events).map((e) => this._get_event_participants(state, e));
    this._hidden = !store.getState().app.wideLayout;
  }

  firstUpdated() {
  }

}

window.customElements.define('gr-view-events', MyViewEvents);
