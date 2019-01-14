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


import '@vaadin/vaadin-grid/theme/material/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';


class MyChildrenElement extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <vaadin-grid .items=${this.items} theme="row-dividers">
        <vaadin-grid-column path="name_given" header="${_('Given name')}">
          <template>
            <a href="/view-relationships/[[item.gramps_id]]"><div>[[item.name_given]]</div></a>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column path="birthdate" header="${_('Birth Date')}"></vaadin-grid-column>
        <vaadin-grid-column path="deathdate" header="${_('Death Date')}"></vaadin-grid-column>
      </vaadin-grid>
    `
    }

    static get properties() { return {
      items: { type: Array },
    }}

    firstUpdated() {
      const grid = this.shadowRoot.querySelector('vaadin-grid');
      grid.heightByRows = true;
    }

}

window.customElements.define('my-children-element', MyChildrenElement);
