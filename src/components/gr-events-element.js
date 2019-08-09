/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, LitElement } from 'lit-element';

import { translate as _ } from '../translate.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

export const GridStyles = css`
vaadin-grid-cell-content {
    white-space: normal;
    vertical-align: text-top;
   }
}
`

class MyEventsElement extends LitElement {
  render() {
    return html`
    <vaadin-grid .items=${this.items} theme="row-dividers">
      <vaadin-grid-column path="date" header="${_('Date')}"></vaadin-grid-column>
      <vaadin-grid-column>
        <template class="header">${_('Type')}</template>
        <template>
          <a href="/event/[[item.handle]]"><div>[[item.type]]</div></a>
          <template is="dom-if" if="[[item.role]]">
            ([[item.role]])
          </template>
        </template>
      </vaadin-grid-column>
      <vaadin-grid-column path="description" header="${_('Description')}"></vaadin-grid-column>
      ${this.place ? html`
      <vaadin-grid-column>
        <template class="header">
          <vaadin-grid-sorter path="place_name">${_('Place')}</vaadin-grid-sorter>
          <vaadin-grid-filter path="place_name"></vaadin-grid-filter>
        </template>
        <template>
          <a href="/place/[[item.place]]"><div>[[item.place_name]]</div></a>
        </template>
      </vaadin-grid-column>
    ` : ''}
    </vaadin-grid>
    `
  }

  static get styles() {
      return [
        GridStyles,
        SharedStyles
      ]
  }

  constructor() {
    super();
    this.items = [];
    this.place = false;
  }

  firstUpdated() {
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    grid.heightByRows = true;
  }

  static get properties() { return {
    items: { type: Array },
    place: { type: Boolean }
  }}

}

window.customElements.define('gr-events-element', MyEventsElement);
