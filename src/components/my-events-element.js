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

class MyEventsElement extends LitElement {
  render() {
    return html`
    <vaadin-grid .items=${this.items} theme="row-dividers">
      <vaadin-grid-column path="date" header="${_('Date')}"></vaadin-grid-column>
      <vaadin-grid-column path="type" header="${_('Type')}"></vaadin-grid-column>
      <vaadin-grid-column path="description" header="${_('Description')}"></vaadin-grid-column>
      <vaadin-grid-column path="place" header="${_('Place')}"></vaadin-grid-column>
    </vaadin-grid>
    `
  }

  constructor() {
    super();
    this.items = [];
  }

  firstUpdated() {
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    grid.heightByRows = true;
  }

  static get properties() { return {
    items: { type: Array },
  }}

}

window.customElements.define('my-events-element', MyEventsElement);
