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

import { arrowRightIcon } from './my-icons.js';
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
      <style>
      div#container {
        position: relative;
        overflow-x: auto;
        overflow-y: visible;
        height: ${2**(this.depth - 1) * 100}px;
      }
      div.card {
        position: absolute;
      }
      div.branch-right, div.branch-left {
        position: absolute;
        border-color: #aaa;
        border-style: solid;
        border-width: 0px;
      }
      div.branch-right.male {
        border-top-left-radius: 15px;
        border-left-width: 1px;
        border-top-width: 1px;
      }
      div.branch-right.female {
        border-bottom-left-radius: 15px;
        border-left-width: 1px;
        border-bottom-width: 1px;
      }
      div.branch-left.male {
        border-bottom-width: 1px;
      }
      div.branch-left.female {
        border-top-width: 1px;
      }
      div.icon svg path {
        fill: #ccc;
      }
      .gray {
        color: #aaa;
      }
      </style>
      <div id="container">
      ${this._people.map((g, i) => html`
        ${g.map((p, j) => Object.keys(p).length ? html`
          <div
          class="card"
          style="
            left: ${i * 230}px;
            top: ${((2**(this.depth - i - 1) ) * (j + 0.5) - 0.5) * 100}px;
          ">
            <my-pedigree-card
              .person=${p}
              @person-selected="${this._personSelected}"
            >
            </my-pedigree-card>
              <div
            class="branch-right ${p.gender === 1 ? 'male' : 'female'}"
            style="
            left: 0px;
            top: ${p.gender === 1 ? 45 : -(2**(this.depth - i - 2) ) * 100 + 45}px;
            margin-left:-20px;
            width: 20px;
            height: ${(2**(this.depth - i - 2) ) * 100}px;
            "
            >
            </div>
            <div
            class="branch-left ${p.gender === 1 ? 'male' : 'female'}"
            style="
            left: 0px;
            top: ${p.gender === 1 ?  45 : -(2**(this.depth - i - 2) ) * 100 + 45}px;
            margin-left:-40px;
            width: 20px;
            height: ${(2**(this.depth - i - 2) ) * 100}px;
            "
            >
            </div>
          </div>
        ` : '')}
      `)}
      ${this._children.map((p, i) => Object.keys(p).length ? html`
        <div
        style="
          height:20px;
          left:0px;
          font-size:0.8em;
          position: absolute;
          top: ${((2**(this.depth - 0 - 1) ) * (0 + 0.5) - 0.5 + 1) * 100 + i * 20}px;
        ">
        <a @click="${() => this._selectPerson(p.gramps_id)}" href="view-tree"><span class="gray">└</span>&nbsp; ${p.name_given}</a>
        </div>
      ` : '')}
      </div>
      `
    }

    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      _people: { type: Array },
      _children: { type: Array },
      depth:  { type: Number }
    }}

    stateChanged(state) {
      this._people = this._getTree(state, state.app.activePerson, this.depth);
      this._children = this._getChildren(state, state.app.activePerson);
    }

    _personSelected(e) {
      store.dispatch(activePerson(e.detail.gramps_id));
    }

    _selectPerson(gramps_id) {
      store.dispatch(activePerson(gramps_id));
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


    _getChildren(state, gramps_id) {
      if (gramps_id == undefined) {
        return [];
      }
      const _person = state.api.people[gramps_id];
      if (_person.families == []) {
        return [];
      }
      var _children = _person.families.flatMap((f) => state.api.families[f].children);
      _children = _children.map((id) => state.api.people[id])
      return _children;
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
