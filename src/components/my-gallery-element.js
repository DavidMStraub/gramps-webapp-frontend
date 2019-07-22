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
      }
      </style>
        ${this.images.map((image, i, arr) => html`
        <div class="item">
          <my-img-element
            handle="${image.ref}"
            size="200"
            square
            .rect="${image.rect}"
            next="${arr[i + 1] ? arr[i + 1].ref : ''}"
            prev="${arr[i - 1] ? arr[i - 1].ref : ''}">
          </my-img-element>
        </div>
        `)}
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      images: { type: Object }
    }}

}

window.customElements.define('my-gallery-element', MyGalleryElement);
