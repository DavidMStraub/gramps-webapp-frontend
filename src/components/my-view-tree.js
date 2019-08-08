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
import './my-pedigree-element.js';
import './my-pedigree-card.js';

import '@polymer/paper-slider/paper-slider.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class MyViewTree extends connect(store)(PageViewElement) {
  render() {
    if (this._gramps_id == undefined) {
      return html`
      <section>
        <p>Loading ...</p>
      </section>
      `
    }
    return html`
      <style>
      .label {
        font-size: 0.8em;
        color: #666666;
        padding-top: 0.4em;
      }
      </style>
      <section id="pedigree-section">
        <div>
          <span class="label">${_("Number of generations:")}</span>
          <paper-slider min="2" max="6" .value="${this._depth}" @value-changed="${this._updateDepth}" pin step="1" snaps>
          </paper-slider>
        </div>
        <div style="transform: scale(${this._zoom}); transform-origin: top left;" id="pedigree-container">
          <my-pedigree-element .depth="${this._depth}" id="pedigree">
          </my-pedigree-element>
        </div>
      </section>
    `
    }

    static get properties() { return {
      _gramps_id: { type: String },
      _depth: { type: Number },
      _zoom: { type: Number }
    }}


    _updateDepth(event) {
      if (event.detail.value) {
        this._depth = event.detail.value;
      }
    }

    constructor() {
      super();
      this._depth = 4;
      this._zoom = 1;
    }
  
    static get styles() {
        return [
          SharedStyles
        ]
    }

    getZoom() {
      let sec = this.shadowRoot.getElementById('pedigree-section');
      let sec_width = sec.offsetWidth;
      let tree_width = this._depth * 230 * this._zoom;
      let new_zoom = (sec_width - 24) / tree_width * this._zoom;
      if (new_zoom > 1) {
        return 1;
      } else if (new_zoom < 0.2) {
        return 0.2;
      } else {
        return new_zoom;
      }
    }

    setZoom() {
      this._zoom = this.getZoom();
    }

    _resizeHandler(e) {
      clearTimeout(this._resizeTimer);
      var self = this;
      this._resizeTimer = setTimeout(function() {
        self.setZoom();
      }, 250)
    }

    firstUpdated() {
      window.addEventListener('resize', this._resizeHandler.bind(this));
      var state = store.getState();
      if (state.app.wideLayout) {
        this._depth = 4;
      } else {
        this._depth = 3;
      }
      this.setZoom();
    }

    stateChanged(state) {
      this._gramps_id = state.app.activePerson;
    }

    updated(changedProps) {
      if (changedProps.has('_depth')) {
        this.setZoom();
      }
    }
}

window.customElements.define('my-view-tree', MyViewTree);
