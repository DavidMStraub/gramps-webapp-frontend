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
import './my-family-element.js';
import './my-events-element.js';
import './my-img-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewEvent extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      h2 {
      }
      div.item {
        float:left; margin:5px;
      }
      svg {
          height: 1em;
          top: .125em;
          position: relative;
      }
      svg path {
          fill: #aaa;
      }
      th {
        color: #777;
        font-size: 0.75em;
        font-weight: 500;
        text-align: right;
        max-width: 20em;
        padding-right: 1em;
      }
      td {
        margin: 0;
      }
      </style>
      <section>
        <div id="title">
          <h2>${this._event.type}
          ${this._participants['Primär'] ? html`
          von ${this._participants['Primär'].map((p) => this._personLink(p))}
          ` : ''}
          </h2>
        </div>
        <p>
          <table width="100%">
          ${this._event.date ? html`
            <tr>
              <th>${_('Date')}</th>
              <td>${this._event.date}</td>
            </tr>
            ` : ''}
          ${this._event.place ? html`
            <tr>
              <th>${_('Place')}</th>
              <td><a href="/view-place/${this._event.place}">${this._event.place_name}</a></td>
            </tr>
            ` : ''}
          ${Object.keys(this._participants).map((role) => {
            if (role != 'Primär') {
              return html`
              <tr>
                <th>${role}</th>
                <td>${this._participants[role].map((p, i, arr) => this._personLink(p, (i==arr.length - 1)))}</td>
              </tr>
              `
            }
          })}
          </table>
          </p>
        <p>${this._event.description}</p>
        ${this._media.length ? html`
          <h3>Galerie</h3>
          ${this._media.map((medium) => html`
          <div class="item">
            <my-img-element
              handle="${medium.ref}"
              size="200"
              square
              .rect="${medium.rect}">
            </my-img-element>
          </div>
          `)}
        ` : '' }
      </section>
    `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
    }

    static get properties() { return {
      _event: { type: Object },
      _handle: { type: String }
    }}

    firstUpdated() {
    }

    _personLink(p, lastItem) {
      if (p == undefined) {
        return ''
      }
      return html`
      <a href="/view-person/${p.gramps_id}">${p.name_given}
      ${p.name_surname}</a>${lastItem ? '' : ', '}
      `
    }

    stateChanged(state) {
      this._handle = state.app.activeEvent;
      this._event = state.api.events[this._handle];

      if (this._event != undefined) {
        if (this._event.place != '') {
          this._event.place_name = state.api.places[this._event.place].name;
        }
        this._media = this._event.media;
        this._participants = Object.assign({}, this._event.participants);
        Object.keys(this._participants).map((role, ids) => {
          this._participants[role] = this._participants[role].map((id) => state.api.people[id])
        });
      }
    }

}

window.customElements.define('my-view-event', MyViewEvent);
