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

import './gr-img-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyGalleryElement extends LitElement {
    render() {
      if (!this.images.length) {
        return  html``
      }
      return  html`
      <style>
      div.item {
        float:left; margin:5px;
        height: 200px;
        width: 200px;
      }
      </style>
        ${this.images.map((image, i, arr) => html`
        <div class="item">
          <gr-img-element
            host="${this.host}"
            handle="${image.ref}"
            token="${this.token}"
            mime="${image.mime}"
            .handles="${this.images.map((image) => image.ref)}"
            size="200"
            square
            .rect="${image.rect}"
            next="${arr[i + 1] ? arr[i + 1].ref : ''}"
            prev="${arr[i - 1] ? arr[i - 1].ref : ''}">
          </gr-img-element>
        </div>
      `)}
      <div style="clear:left;"></div>
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      images: { type: Object },
      host: {type: String},
      token: {type: String}
    }}

}

window.customElements.define('gr-gallery-element', MyGalleryElement);
