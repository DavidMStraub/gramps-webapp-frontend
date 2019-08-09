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
import { asteriskIcon, crossIcon, ringsIcon } from './gr-icons.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class MyPersonElement extends LitElement {
  render() {
    return html`
      <style>
      svg {
          height: 1em;
          top: .125em;
          position: relative;
      }
      svg path {
          fill: #aaa;
      }
      .gray {
        font-size: 0.9em;
      }
      </style>
      <a href="/person/${this.person.gramps_id}">
      ${this.person.name_surname}${(this.person.name_surname && this.person.name_given) ? ',' : ''}
      ${this.person.name_given}</a>
      <span class="gray">
      ${this.person.birthdate ? html`&nbsp;&nbsp; ${asteriskIcon} ${this.person.birthdate}` : ''}
      ${this.person.birthplace ? html` ${_("in")} ${this.person.birthplace}` : ''}
      </span>
      <span class="gray">
      ${this.person.deathdate ? html`&nbsp;&nbsp; ${crossIcon} ${this.person.deathdate}` : ''}
      ${this.person.deathplace ? html` ${_("in")} ${this.person.deathplace}` : ''}
      </span>
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      person: { type: Array },
    }}

}

window.customElements.define('gr-person-element', MyPersonElement);
