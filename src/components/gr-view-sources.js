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

import { paperclipIcon } from './gr-icons.js';

import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-selection-column.js';

class MyViewSources extends connect(store)(PageViewElement) {
  render() {
    return html`
      <section>
        <vaadin-grid .items=${this._sources} theme="row-dividers" multi-sort>
          <vaadin-grid-selection-column auto-select hidden></vaadin-grid-selection-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
            <template class="header">
              <vaadin-grid-sorter path="gramps_id">ID</vaadin-grid-sorter>
            </template>
            <template>
              <a href="/source/[[item.gramps_id]]"><div>[[item.gramps_id]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="title" direction="asc">${_('Name')}</vaadin-grid-sorter>
              <br>
              <vaadin-grid-filter path="title"></vaadin-grid-filter>
            </template>
            <template>
              <a href="/source/[[item.gramps_id]]"><div>[[item.title]]</div></a>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="author">${_('Author')}</vaadin-grid-sorter>
            </template>
            <template>
              [[item.author]]
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column ?hidden="${this._hidden}">
          <template>
            <template is="dom-if" if="[[item.has_attachment]]">
              ${paperclipIcon}
            </template>
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
    _sources: { type: Object },
    _hidden: { type: Boolean }
  }}

  stateChanged(state) {
    this._sources = Object.values(state.api.sources);
    this._sources = this._sources.map(function(s) {
      s.has_attachment = false;
      if (s.media.length > 0  || s.notes.length > 0) {
        s.has_attachment = true;
      }
      return s;
    })
    console.log(this._sources);
    this._hidden = !store.getState().app.wideLayout;
  }

  firstUpdated() {
  }

}

window.customElements.define('gr-view-sources', MyViewSources);
