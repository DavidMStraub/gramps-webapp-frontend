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
import './my-gallery-element.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewEvent extends connect(store)(PageViewElement) {
  render() {
    if (this._event == undefined) {
      return html``
    }
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
          ${this._participants[_('Primary')] ? html`
          von ${this._participants[_('Primary')].map((p, i, arr) => this._participantLink(p, i==arr.length - 1))}
          ` : ''}
          ${this._participants[_('Family')] ? html`
          von ${this._participants[_('Family')].map((p, i, arr) => this._participantLink(p, i==arr.length - 1))}
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
            if (role != _('Primary') && role != _('Family')) {
              return html`
              <tr>
                <th>${role}</th>
                <td>${this._participants[role].map((p, i, arr) =>
                      this._participantLink(p, (i==arr.length - 1)))}</td>
              </tr>
              `
            }
          })}
          </table>
          </p>
        <p>${this._event.description}</p>

        ${this._media.length ? html`<h3>${_("Gallery")}</h3>` : ''}
        <my-gallery-element .images=${this._media} host=${this._host}>
        </my-gallery-element>

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
      this._media = Array();
    }

    static get properties() { return {
      _event: { type: Object },
      _handle: { type: String },
      _host: { type: String },
      _media: { type: Object },
    }}

    firstUpdated() {
    }

    _participantLink(p, lastItem) {
      if (p == undefined) {
        return ''
      }
      if (p.type == 'Person') {
        return html`
        <a href="/view-person/${p.person.gramps_id}">${p.person.name_given}
        ${p.person.name_surname}</a>${lastItem ? '' : ', '}
        `
      } else if (p.type == 'Family') {
        return html`
        <a href="/view-person/${p.family.father_id}">${p.family.father_name}</a>
        ${_('and')}
        <a href="/view-person/${p.family.mother_id}">${p.family.mother_name}</a>${lastItem ? '' : ', '}
        `
      }
    }

    stateChanged(state) {
      this._host = state.app.host;
      this._handle = state.app.activeEvent;
      this._event = state.api.events[this._handle];

      if (this._event != undefined) {
        if (this._event.place != '' && state.api.places[this._event.place] != undefined) {
          this._event.place_name = state.api.places[this._event.place].name;
        }
        this._media = this._event.media;
        this._participants = Object.assign({}, this._event.participants);
        Object.keys(this._participants).map((role) => {
          this._participants[role] = this._participants[role].map(function(p) {
            if (p.type == 'Person') {
              return({type: p.type, person: state.api.people[p.gramps_id]});
            } else if (p.type == 'Family') {
              return({type: p.type, family: state.api.families[p.gramps_id]});
            }
          })
        });
      }
    }

}

window.customElements.define('my-view-event', MyViewEvent);
