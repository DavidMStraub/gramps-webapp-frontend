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


class MyPedigreeCard extends LitElement {
  render() {
      return html`
      <style>
      .card {
        width: 220px;
        height: 60px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 14px;
      }
      </style>
      ${(!Object.keys(this.person).length) ? html`
        <div class="card">
        NN
        </div>
        ` : html`
        <div class="card">
        <a @click="${this._personSelected}" href="/view-tree">${this.person.name_surname}, ${this.person.name_given}</a>
        </div>
      `}
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    _personSelected() {
      this.dispatchEvent(new CustomEvent('person-selected', {detail: {gramps_id: this.person.gramps_id}}));
    }


    static get properties() { return {
      person: { type: Object },
    }}

}

window.customElements.define('my-pedigree-card', MyPedigreeCard);
