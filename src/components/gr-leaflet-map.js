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
import { Map,  TileLayer, LatLng, control } from '../../node_modules/leaflet/dist/leaflet-src.esm.js';

class MyLeafletMap extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="/src/components/leaflet.css">


      <div class="mapcontainer" style="width:${this.width}; height:${this.height};">
        <div id="${this.mapid}" style="z-index: 0; width: 100%; height: 100%;">
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
      this.mapid = 'mapid';
    }


    static get properties() { return {
      height: { type: String },
      width: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      mapid: { type: String },
      zoom: { type: Number },
      _map: {type: Object},
    }}

    firstUpdated() {
      var mapel = this.shadowRoot.querySelector('#' + this.mapid);
      this._map = new Map(mapel, {zoomControl: false}).setView([this.latitude, this.longitude], this.zoom);
      new TileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
        attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
        maxZoom: 19,
        zoomControl: false
      }).addTo(this._map);
      this._map.addControl(control.zoom({ position: 'bottomright' }));
      this._map.invalidateSize(false);
    }

    updated() {
      if (this._map != undefined) {
        this._map.panTo(new LatLng(this.latitude, this.longitude));
        this._map.setZoom(this.zoom);
        this._map.invalidateSize(false);
      }
    }
}

window.customElements.define('gr-leaflet-map', MyLeafletMap);
