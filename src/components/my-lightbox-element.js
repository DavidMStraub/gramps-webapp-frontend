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

import { closeIcon } from './my-icons.js';


class MyLightboxElement extends LitElement {
  render() {
    if (!this.opened) {
      return html``
    } else {
      return html`
      <style>
      #lightbox {
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        position:fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        color: #ffffff;
      }

      .close-lightbox svg {
        height: 2em;
        width: 2em;
      }

      .close-lightbox:hover svg path {
        fill: #ffffff;
      }

      .close-lightbox svg path {
        fill: #aaaaaa;
      }

      .close-lightbox {
        position: absolute;
        right: 1.5em;
        top: 1.5em;
      }
      }
      </style>
      <div id="lightbox" @keydown="${this._handleKeyPress}" tabindex="-1">
        <slot></slot>
      <div class="close-lightbox">
        <span @click="${this._closeLightbox}" class="link">${closeIcon}</span>
      </div>
      </div>
      `
    }
  }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
      this.opened = false;
    }

    _closeLightbox() {
      this.opened = false;
      this.dispatchEvent(new CustomEvent('lightbox-opened-changed',
        {bubbles: true, composed: true, detail: {opened: false}}));
      this.dispatchEvent(new CustomEvent('medium-selected',
        {bubbles: true, composed: true, detail: {id: ''}})
        );
    }

    _handleKeyPress(e) {
      if (e.key === "Escape") {
        this._closeLightbox();
      }
    }

    static get properties() { return {
      opened: { type: Boolean, notify: true, reflectToAttribute: true }
    }}

    _focus() {
      if (this.opened) {
        const lightBox = this.shadowRoot.getElementById('lightbox');
        lightBox.focus();
      }
    }

    updated() {
      this._focus();
    }

}

window.customElements.define('my-lightbox-element', MyLightboxElement);
