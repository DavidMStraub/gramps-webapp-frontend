/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, LitElement } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-badge/paper-badge.js';
import './my-family-element.js';
import './my-events-element.js';
import './my-img-element.js';

import { asteriskIcon, crossIcon, ringsIcon } from './my-icons.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyViewPerson extends connect(store)(PageViewElement) {
  render() {
    if (this._person == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      <style>
      h2 {
        margin: 0em;
      }
      div#photo {
        float:right;
        padding:10px 30px;
        width:230px;
      }
      div#title {
        margin-right: 230px;
        min-height: 150px;
      }
      div#tabs {
        margin-right: 230px;
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
      :host {
        --paper-tab-ink: var(--app-secondary-color);
        --paper-tabs-selection-bar-color: var(--app-secondary-color);
        --paper-badge-background:  var(--app-primary-color);
        --paper-badge-margin-left: 20px;
      }
      paper-tabs {
        /* background-color: var(--app-section-even-color); */
        color: var(--app-dark-text-color);
        font-weight: 400;
        font-size: 15px;
      }
      </style>
      <section>
        ${this._media.length ? html`
        <div id="photo">
          <my-img-element
            handle="${this._media[0].ref}"
            size="200"
            circle square
            .rect="${this._media[0].rect}">
          </my-img-element>
        </div>
        ` : ''}
        <div id="title">
          <h2> ${this._person.name_given} ${this._person.name_surname}</h2>
          <p>${this._person.birthdate ? html`
            ${asteriskIcon} ${this._person.birthdate}
            ` : ''}
            ${this._person.birthplace ? html`
              ${_("in")} <a href="view-place/${this._person.birthplace}">${this._person.birthplace_name}</a>
              ` : ''}
          </p>
          <p>${this._person.deathdate ? html`
            ${crossIcon} ${this._person.deathdate}
            ` : ''}
            ${this._person.deathplace ? html`
              ${_("in")} <a href="view-place/${this._person.daethplace}">${this._person.deathplace_name}</a>
              ` : ''}
          </p>
          </div>
          <div id="tabs">
        <paper-tabs
          autoselect
          .selected="${this._selected}"
          @iron-activate="${this._handleSelected}">
          <paper-tab>${_("Events")}</paper-tab>
          <paper-tab>${_("Parents")}</paper-tab>
          <paper-tab>${_("Families")}</paper-tab>
          <paper-tab><div style="display:inline-block"><span>Galerie</span>${this._media.length ?
            html` <paper-badge label="${this._media.length}"></paper-badge></div>
          ` : ''}</paper-tab>
        </paper-tabs>
        </div>
      </section>

      <section  ?hidden=${this._selected != 0} style="clear:left;">
        ${this._events ?
          html`
          <my-events-element .items="${this._events}"></my-events-element>`
          : '' }
      </section>

      <section  ?hidden=${this._selected != 1}>
      ${this._parents ? html`<my-family-element
        gramps_id="${this._parents}"
        siblings father mother></my-family-element>` : '' }
      </section>
      <section  ?hidden=${this._selected != 2}>
      ${this._person.families ? this._person.families.map((f) => html`
        <my-family-element
        gramps_id="${f}"
        father
        mother></my-family-element>`) : '' }
      </section>
      <section  ?hidden=${this._selected != 3}>
        ${this._media.length ? html`
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
      this._selected = 0;
    }

    static get properties() { return {
      _gramps_id: { type: String },
      _person: { type: Object },
      _parents: { type: String },
      _events: { type: Object },
      _selected: { type: Number }
    }}

    _handleSelected(ev) {
        this._selected = ev.detail.selected;
        window.location.hash = this._selected;
    }

    _onHashChange(ev) {
      this._selected = ev.newURL.split('#')[1];
    }

    firstUpdated() {
      window.addEventListener('hashchange', this._onHashChange);
      if (window.location.hash.split('#')[1] != undefined) {
        this._selected = window.location.hash.split('#')[1];
      }
    }

    _get_place_name(state, event) {
      if (event.place != undefined && event.place != '') {
        event.place_name = state.api.places[event.place].name;
      };
      return event;
    }

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
      this._person = state.api.people[this._gramps_id];
      if (this._person != undefined) {
        this._parents = this._person.parents;
        this._events = this._person.events.map((handle) => state.api.events[handle]);
        this._events = this._events.map((e) => this._get_place_name(state, e));
        if (this._person.birthplace != '') {
          this._person.birthplace_name = state.api.places[this._person.birthplace].name;
        }
        if (this._person.deathplace != '') {
          this._person.deathplace_name = state.api.places[this._person.deathplace].name;
        }
        this._media = this._person.media;
      }
    }

}

window.customElements.define('my-view-person', MyViewPerson);
