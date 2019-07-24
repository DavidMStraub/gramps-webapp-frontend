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

import './my-img-element.js';


class MyPedigreeCard extends LitElement {
  render() {
      return html`
      <style>
      .card {
        width: ${this.width};
        height: 70px;
        padding: 10px;
        border-radius: 10px;
        font-size: 13px;
        line-height: 17.5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
      .card.female {
        border-left: 6px solid #F48FB1;
      }
      .card.male {
        border-left: 6px solid #90CAF9;
      }
      .photo {
        height: 70px;
        float:left;
        margin-right: 10px;
      }
      .name {
        font-weight: 500;
      }
      </style>
      ${(this.person != undefined && !Object.keys(this.person).length) ? html`
        <div class="card">
        NN
        </div>
        ` : html`
        <div class="card ${this.person.gender === 1 ? 'male' : 'female'}">
        <a @click="${this._personSelected}" href="${this.link  === 'pedigree' ? 'view-tree' : 'view-person/' + this.person.gramps_id}">
        <div class="photo">
          ${ this.person.media.length ? html`
          <my-img-element
            host="${this.host}"
            handle="${this.person.media[0].ref}"
            size="70"
            circle square
            nolink
            .rect="${this.person.media[0].rect}">
          </my-img-element>
          ` : ''}
        </div>
        <span class="name">${this.person.name_surname},
        <br>
        ${this.person.name_given}</span>
        <br>
        <span class="dates">
        ${this.person.birthdate ? '*' : ''} ${this.person.birthdate}
        <br>
        ${this.person.deathdate ? '†' : ''} ${this.person.deathdate}
        </span>
        </a>
        </div>
      `}
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    constructor() {
      super();
      this.width = '164px';
      this.link = 'pedigree';
    }

    _personSelected() {
      this.dispatchEvent(new CustomEvent('person-selected', {detail: {gramps_id: this.person.gramps_id}}));
    }


    static get properties() { return {
      person: { type: Object },
      width: {type: String },
      link: {type: String},
      host: {type: String}
    }}

}

window.customElements.define('my-pedigree-card', MyPedigreeCard);
