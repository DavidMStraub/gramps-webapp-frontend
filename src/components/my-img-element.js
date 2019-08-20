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
      var img = html`
      <img
      srcset="${this.host}/thumbnail/${this.handle}/${this.size}?jwt=${this.token},
      ${this.host}/thumbnail/${this.handle}/${1.5 * this.size}?jwt=${this.token} 1.5x,
      ${this.host}/thumbnail/${this.handle}/${2 * this.size}?jwt=${this.token} 2x"
      src="${this.host}/thumbnail/${this.handle}/${2 * this.size}?jwt=${this.token}"
      style="border-radius:${this.circle ? '50%' : '0'};max-height:100vh;">
      `
    } else {
      var img = html`
      <img
      srcset="${this.host}/thumbnail/${this.handle}/${this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]}?jwt=${this.token},
      ${this.host}/thumbnail/${this.handle}/${1.5 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]}?jwt=${this.token} 1.5x,
      ${this.host}/thumbnail/${this.handle}/${2 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]}?jwt=${this.token} 2x"
      src="${this.host}/thumbnail/${this.handle}/${2 * this.size}/${this.rect[0]}/${this.rect[1]}/${this.rect[2]}/${this.rect[3]}?jwt=${this.token}"
      style="border-radius:${this.circle ? '50%' : '0'};max-height:100vh;">
      ${this.link ? html`</a>` : ''}
      `
    }
    if (this.nolink) {
      return img;
    } else {
        return html`
        <span @click="${this._lightbox_handle}" class="link">${img}</span>
        `;
      // return html`<a href="${this.host}/media/${this.handle}">${img}</a>`;
    }
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
      this.nolink = false;
      this.handles = Array();
    }

    _lightbox_handle() {
      this.dispatchEvent(new CustomEvent('media-selected',
        {bubbles: true, composed: true, detail: {selected: this.handle, media: this.handles}})
      );
      this.dispatchEvent(new CustomEvent('lightbox-opened-changed',
      {bubbles: true, composed: true, detail: {opened: true}}));
    }

    static get properties() { return {
      handle: { type: String },
      token: { type: String },
      handles: {type: Object},
      size: { type: Number },
      rect: { type: Array },
      circle: { type: Boolean },
      square: { type: Boolean },
      nolink: { type: Boolean },
      host: {type: String}
    }}

}

window.customElements.define('my-img-element', MyImgElement);
