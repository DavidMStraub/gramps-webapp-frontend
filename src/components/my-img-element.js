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


class MyImgElement extends LitElement {
  render() {
    if (this.rect == undefined) {
      return html`
      <a href="http://127.0.0.1:5000/media/${this.handle}">
      <img
      srcset="http://127.0.0.1:5000/thumbnail/${this.handle}/${this.size},
      http://127.0.0.1:5000/thumbnail/${this.handle}/${1.5 * this.size} 1.5x,
      http://127.0.0.1:5000/thumbnail/${this.handle}/${2 * this.size} 2x"
      src="http://127.0.0.1:5000/thumbnail/${this.handle}/${2 * this.size}"
      style="border-radius:${this.circle ? '50%' : '0'}">
      </a>
      `
    } else {
      return html`
      <a href="http://127.0.0.1:5000/media/${this.handle}">
      <img
      srcset="http://127.0.0.1:5000/thumbnail/${this.handle}/${this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]},
      http://127.0.0.1:5000/thumbnail/${this.handle}/${1.5 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]} 1.5x,
      http://127.0.0.1:5000/thumbnail/${this.handle}/${2 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]} 2x"
      src="http://127.0.0.1:5000/thumbnail/${this.handle}/${2 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]}"
      style="border-radius:${this.circle ? '50%' : '0'}">
      </a>
      `
    }
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      handle: { type: String },
      size: { type: Number },
      rect: { type: Array },
      circle: { type: Boolean },
      square: { type: Boolean }
    }}

}

window.customElements.define('my-img-element', MyImgElement);
