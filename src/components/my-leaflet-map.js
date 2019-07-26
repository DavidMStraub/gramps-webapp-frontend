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
import { Map,  TileLayer, LatLng } from '../../node_modules/leaflet/dist/leaflet-src.esm.js';

class MyLeafletMap extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="leaflet.css">
      <style>
      #mapid {
        width: ${this.width};
        height: ${this.height};
      }
      </style>


      <div id="mapcontainer">
        <div id="mapid">
          <slot>
          </slot>
        </div>
      </div>
      `
    }

    static get styles() {
        return [
        ]
    }

    constructor() {
      super();
      this.height = '500px';
      this.width = '100%';
      this.zoom = 13;
    }


    static get properties() { return {
      height: { type: String },
      width: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      zoom: { type: Number },
      _map: {type: Object},
    }}

    firstUpdated() {
      var mapel = this.shadowRoot.querySelector('#mapid');
      this._map = new Map(mapel).setView([this.latitude, this.longitude], 13);
      new TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }).addTo(this._map);
    }

    updated() {
      if (this._map != undefined) {
        this._map.panTo(new LatLng(this.latitude, this.longitude));
      }
    }
}

window.customElements.define('my-leaflet-map', MyLeafletMap);
