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

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

import { chevronLeftIcon, chevronRightIcon } from './my-icons.js';

class MyMediaElement extends connect(store)(LitElement) {
  render() {
      if (this.media) {
        var _boundCloseLightbox = this._closeLightbox;
        return html`
        <style>
        div.media-container {
          position: absolute;
          width:100%;
          height:100%;
          max-height:100vh;
          max-width:100vw;
          text-align: center;
        }
        div.inner-container {
          position: relative;
          display: inline-block;
          max-height: 100vh;
          max-width: 100vw;
        }
        div.rect {
          position:absolute;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
          border-radius: 6px;
        }
        div.rect div.label {
          font-size:0.7em;
          color: #fff;
          background-color: rgba(0.5, 0.5, 0.5, 0.25);
          position: relative;
          top: 100%;
          left: 50%;
          padding: 0 0.5em;
          overflow: hidden;
          transform: translate(-50%, 10px);
          border-radius:3px;
          display: none;
        }
        div.rect:hover div.label {
          display: block;
        }
        div.media-container img {
          /* display: block; */
          max-width:100vw;
          max-height:100vh;
        }
        </style>
        <div class="media-container">
          <div class="inner-container">
            <img src="http://127.0.0.1:5000/media/${this.handle}">
            </img>
            ${this._rect.map(function(item)  {
              let left = item.rect[0];
              let top = item.rect[1];
              let width = item.rect[2] - item.rect[0];
              let height = item.rect[3] - item.rect[1];
              return html`
              <a href="view-person/${item.gramps_id}" @click="${_boundCloseLightbox}">
              <div class="rect"
                style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;">
                <div class="label">${item.name_given} ${item.name_surname}</div>
              </div>
              </a>
            `})}
          </div>
        </div>
        ${this._prev ? html`
          <div class="arrow" style="left: 10vw;top: 50vh;">
            <span @click="${this._handle_left}" class="link">${chevronLeftIcon}</span>
          </div>
          ` : ''}
        ${this._next ? html`
          <div class="arrow" style="right: 10vw;top: 50vh;">
            <span @click="${this._handle_right}" class="link">${chevronRightIcon}</span>
          </div>
          ` : ''}
      `
      } else {
        return html`<p>Media object not found!</p>`
      }
  }

    _handle_left() {
      this.dispatchEvent(new CustomEvent('media-selected',
        {bubbles: true, composed: true, detail: {selected: this._prev, media: this.media}})
      );
    }

    _handle_right() {
      this.dispatchEvent(new CustomEvent('media-selected',
        {bubbles: true, composed: true, detail: {selected: this._next, media: this.media}})
      );
    }


    static get styles() {
        return [
          SharedStyles
        ]
    }

    static get properties() { return {
      media: { type: Object },
      handle: { type: String },
      _rect: { type: Object },
      _prev: { type: String },
      _next: { type: String }
    }}

    firstUpdated() {
      window.addEventListener('keydown', this._escHandler.bind(this));
    }

    _escHandler(e) {
      if (e.key === "Escape") {
        this.dispatchEvent(new CustomEvent('lightbox-opened-changed',
        {bubbles: true, composed: true, detail: {opened: false}}));
      } else if ((e.key === "ArrowRight" || e.key === "Right") && this._next != '') {
        this._handle_right();
      } else if ((e.key === "ArrowLeft" || e.key === "Left") && this._prev != '') {
        this._handle_left();
    };
    }

    _closeLightbox() {
      this.dispatchEvent(new CustomEvent('lightbox-opened-changed',
        {bubbles: true, composed: true, detail: {opened: false}}));
      this.dispatchEvent(new CustomEvent('medium-selected',
        {bubbles: true, composed: true, detail: {id: ''}})
        );
    }

    _getRect(state) {
      var rectangles = []
      for (let p in state.api.people) {
        if (state.api.people[p].media != undefined) {
          for (let m of state.api.people[p].media) {
            if (m.ref == this.handle) {
              rectangles.push({type: 'person',
                               gramps_id: state.api.people[p].gramps_id,
                               name_given: state.api.people[p].name_given,
                               name_surname: state.api.people[p].name_surname,
                               rect: m.rect})
            }
          }
        }
      }
      return rectangles
    }

    stateChanged(state) {
      if (state.app.activeMedia != undefined) {
        this.media = state.app.activeMedia.media;
        this.handle = state.app.activeMedia.selected
        var _prev = '';
        var _next = '';
        var _handle = this.handle
        if (this.media.length) {
          for (const [index, element] of this.media.entries()) {
            if (element == _handle) {
              if (index + 1 == this.media.length) {
                _next = '';
              } else {
                _next = this.media[index + 1];
              }
              break;
            }
            _prev = element;
          };
        };
        this._prev = _prev;
        this._next = _next;
        this._rect = this._getRect(state);
      }
    }


}

window.customElements.define('my-media-element', MyMediaElement);
