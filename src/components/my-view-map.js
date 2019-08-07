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

import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';

import './my-leaflet-map.js';
import './my-leaflet-map-marker.js';


class MyViewMap extends connect(store)(PageViewElement) {
  render() {
    if (this._places == undefined) {
      return html``
    }
    var center = this._getMapCenter();
    return html`
      <style>
      #searchbox {
        position: absolute;
        top: 20px;
        left: ${this._drawer ? html`276px` : html`80px`};
        float: left;
        z-index: 1;
      }
      :host {
        --lumo-contrast-10pct: #ffffff;
      }
      :host [part="value"] {
        color: red;
        font-weight: normal !important;
      }
      :host(.mapsearch) [part="value"] {
        color: red;
        background-color:green;
        font-weight: normal !important;
      }
      </style>
      <div id="searchbox">
        <vaadin-combo-box id="mapsearch" class="mapsearch"
        placeholder="Filtern" item-label-path="name"
        @value-changed="${this._valueChange}"
        ></vaadin-combo-box>
      </div>
      <my-leaflet-map
        height="100vh"
        width="100%"
        latitude="${center[0]}"
        longitude="${center[1]}"
        zoom="6"
        mapid="map-mapview"
      >
      ${this._selected ? html`
        <my-leaflet-map-marker
          latitude="${this._places[this._selected].geolocation[0]}"
          longitude="${this._places[this._selected].geolocation[1]}"
          popup="<a href='view-place/${this._places[this._selected].gramps_id}'>${this._places[this._selected].name}</a>"
        >
        </my-leaflet-map-marker>
        ` : this.sortValues(this._places).map(function (p) {
        if (p.geolocation && p.geolocation[0]) {
            return html`
            <my-leaflet-map-marker
              latitude="${p.geolocation[0]}"
              longitude="${p.geolocation[1]}"
              popup="<a href='view-place/${p.gramps_id}'>${p.name}</a>"
            >
            </my-leaflet-map-marker>
            `
          }
      })}
      </my-leaflet-map>
    `
  }

  static get styles() {
      return [
        SharedStyles
      ]
  }

  constructor() {
    super();
    this._selected = '';
  }

  static get properties() { return {
    _places: { type: Object },
    _drawer: { type: Boolean },
    _selected: {type: String},
    // _hidden: { type: Boolean }
  }}

  _valueChange(e) {
    let combobox = this.shadowRoot.querySelector('#mapsearch');
    if (!combobox.selectedItem) {
      this._selected = '';
    } else {
      this._selected = combobox.selectedItem.gramps_id;
    }
  }

  sortValues(places) {
    return Object.values(places)
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .filter((p) => p.geolocation[0]);
  }

  _getMapCenter() {
    if (!this._places) {
      return [0, 0];
    } else if (this._selected){
      return this._places[this._selected].geolocation;
    } else {
      return this._getCenterOfGravity(Object.values(this._places));
    }
  }

  _getCenterOfGravity(places) {
    if (!places) {
      return [0, 0];
    }
    var x = 0;
    var y = 0;
    var n = 0;
    for (var i =0; i < places.length; i++) {
      let p =  places[i];
      if (!p.geolocation[0]) {
        continue;
      } else {
        x += parseFloat(p.geolocation[0]);
        y += parseFloat(p.geolocation[1]);
        n++;
      }
    }
    x = x / n;
    y = y / n;
    return [x, y];
  }

  stateChanged(state) {
    this._places = state.api.places;
    this._drawer = state.app.drawerOpened;
  }

  firstUpdated() {
    let combobox = this.shadowRoot.querySelector('#mapsearch');
    combobox.items = this.sortValues(this._places);
    combobox.itemValuePath = 'name';
  }

}

window.customElements.define('my-view-map', MyViewMap);
