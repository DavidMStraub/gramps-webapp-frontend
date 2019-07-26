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

import './my-leaflet-map.js';
import './my-leaflet-map-marker.js';


class MyViewMap extends connect(store)(PageViewElement) {
  render() {
    return html`
      <style>
      </style>
      <my-leaflet-map
        height="100vh"
        with="200px"
        latitude="48"
        longitude="9"
        zoom="6"
        mapid="map-mapview"
      >
      ${this._places.map(function (p) {
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
  }

  static get properties() { return {
    _places: { type: Object },
    // _hidden: { type: Boolean }
  }}


  stateChanged(state) {
    this._places = Object.values(state.api.places);
  }

  firstUpdated() {
  }

}

window.customElements.define('my-view-map', MyViewMap);
