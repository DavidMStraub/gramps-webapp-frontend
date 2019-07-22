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

import { translate as _ } from '../translate.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { chevronLeftIcon, chevronRightIcon } from './my-icons.js';

class MyMediaElement extends connect(store)(LitElement) {
  render() {
      if (this.handle) {
        return html`
        <style>
        div.media-container {
          text-align: center;
          max-height: 100vh;
          max-width: 100vw;
        }
        </style>
        <div class="media-container">
          <img
            src="http://127.0.0.1:5000/media/${this.handle}"
            style="max-width:100vw;max-height:100vh;">
          </img>
        </div>
        ${this.prev ? html`
          <div class="arrow" style="left: 10vw;top: 50vh;">
            <span @click="" class="link">${chevronLeftIcon}</span>
          </div>
          ` : ''}
        ${this.next ? html`
          <div class="arrow" style="right: 10vw;top: 50vh;">
            <span @click="" class="link">${chevronRightIcon}</span>
          </div>
          ` : ''}
      `
      } else {
        return html`<p>Media object not found!</p>`
      }
  }

    constructor() {
      super();
      this.next = '';
      this.prev = '';
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      handle: { type: String },
      next: { type: String },
      prev: { type: String },
    }}

    stateChanged(state) {
    }


}

window.customElements.define('my-media-element', MyMediaElement);
