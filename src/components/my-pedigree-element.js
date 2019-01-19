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

import './my-pedigree-card.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { activePerson } from '../actions/app.js';


class MyPedigreeElement extends connect(store)(LitElement) {
  render() {
      return html`
      ${this._people.map((g) => html`
        <hr> ${g.map((p) => html`
          <my-pedigree-card
            .person=${p}
            @person-selected="${this._personSelected}"
          >
          </my-pedigree-card>
        `)}
      `)}
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      _people: { type: Array },
      depth:  { type: Number }
    }}

    stateChanged(state) {
      this._people = this._getTree(state, state.app.activePerson, this.depth);
    }

    _personSelected(e) {
      store.dispatch(activePerson(e.detail.gramps_id));
    }

    _getTree(state, start_id, depth) {
      var _people = [];
      _people.push([this._getPerson(state, start_id)]);
      if (depth == 1) {
        return _people;
      }
      _people.push(this._getParents(state, start_id));
      if (depth == 2) {
        return _people;
      }
      for (var i = 3; i <= depth; i++){
        _people.push(_people.slice(-1)[0].map((p) => this._getParents(state, p.gramps_id)).flat());
      }
      return _people;
    }

    _getPerson(state, gramps_id) {
      if (gramps_id == undefined) {
        return {};
      }
      return state.api.people[gramps_id];
    }

    _getParents(state, gramps_id) {
      if (gramps_id == undefined) {
        return [{}, {}];
      }
      const _person = state.api.people[gramps_id];
      if (_person.parents == '') {
        return [{}, {}];
      }
      const _parents = state.api.families[_person.parents];
      if (_parents.father_id) {
        var _father = this._getPerson(state, _parents.father_id);
      } else {
        var _father = {};
      }
      if (_parents.mother_id) {
        var _mother = this._getPerson(state, _parents.mother_id);
      } else {
        var _mother = {};
      }
      return [_father, _mother];
    }
    //
    //   var _person = state.api.people[state.app.activePerson];
    //   this._people.push(_person);
    //   var _arr = this.addParents(state, _person.gramps_id, this._people);
    //   var _father = _arr[0];
    //   var _mother = _arr[1];
    //   this._people = _arr[2];
    //   if (_father){
    //     var _arr = this.addParents(state, _father, this._people);
    //     var _father = _arr[0];
    //     var _mother = _arr[1];
    //     this._people = _arr[2];
    //   }
    //   if (_mother){
    //     var _arr = this.addParents(state, _mother, this._people);
    //     var _father = _arr[0];
    //     var _mother = _arr[1];
    //     this._people = _arr[2];
    //   }
    // }
    //
    // addParents(state, gramps_id, people_arr) {
    //   var _person = state.api.people[gramps_id];
    //   if (!_person.parents) {
    //     return ['', '', people_arr];
    //   }
    //   var _parents = state.api.families[_person.parents];
    //   if (!_parents.father_id) {
    //     people_arr.push({})
    //   } else {
    //     people_arr.push(state.api.people[_parents.father_id])
    //   }
    //   if (!_parents.mother_id) {
    //     people_arr.push({})
    //   } else {
    //     people_arr.push(state.api.people[_parents.mother_id])
    //   }
    //   return [_parents.father_id, _parents.mother_id, people_arr];
    // }
}

window.customElements.define('my-pedigree-element', MyPedigreeElement);
