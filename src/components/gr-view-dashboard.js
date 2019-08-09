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

import { updateLightboxState } from '../actions/app.js';


import '@polymer/paper-card/paper-card.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewDashboard extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      paper-card {
        width: 100%;
        margin-bottom: 15px;
      }
      .card-content h3 {
        margin: 0em 0em 0.75em 0em;
        line-height: 1em;
        font-size: 24px;
      }
      .card-content table {
        width: 100%;
      }
      .card-content b {
        font-weight: 500;
      }
      section.cards {
        column-count: 3;
        column-gap: 15px;
      }
      </style>
      <section>
      <h2>${_('Home Page')}</h2>
      </section>
      <section class="cards">
      <paper-card>
          <div class="card-content">
            <h3>${_("Database overview")}</h3>
            <p>${_("Name")}: ${this._dbinfo.name}</p>
            <table>
              <tr>
                <td>${_("Number of individuals")}</td>
                <td>${this._dbinfo.number_people}</td>
              </tr>
              <tr>
                <td>${_("Number of families")}</td>
                <td>${this._dbinfo.number_families}</td>
              </tr>
              <tr>
                <td>${_("Number of places")}</td>
                <td>${this._dbinfo.number_places}</td>
              </tr>
              <tr>
                <td>${_("Number of events")}</td>
                <td>${this._dbinfo.number_events}</td>
              </tr>
            </table>
          </div>
      </paper-card>
      </section>
    `
  }

  static get styles() {
      return [
        SharedStyles
      ]
  }

  static get properties() { return {
    _dbinfo: { type: Object },
  }}

  stateChanged(state) {
    this._dbinfo = state.api.dbinfo;
  }
}

window.customElements.define('gr-view-dashboard', MyViewDashboard);
