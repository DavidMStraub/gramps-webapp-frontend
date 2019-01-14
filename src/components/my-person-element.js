/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, LitElement } from '@polymer/lit-element';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class MyPersonElement extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <a href="/view-relationships/${this.person.gramps_id}">
      ${this.person.name_surname}${(this.person.name_surname && this.person.name_given) ? ',' : ''}
      ${this.person.name_given}</a>${this.person.birthdate ? html`&nbsp;&nbsp; ∗ ` : ''}
      ${this.person.birthdate}${this.person.deathdate ? html`&nbsp;&nbsp; † ` : ''}
      ${this.person.deathdate}
    `
    }

    static get properties() { return {
      person: { type: Array },
    }}

}

window.customElements.define('my-person-element', MyPersonElement);
