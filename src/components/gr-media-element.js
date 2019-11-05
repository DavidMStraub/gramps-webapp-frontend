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

import './gr-note-element.js';
import './gr-citations-element.js';

import {
  chevronLeftIcon,
  chevronRightIcon,
  fileIcon
} from './gr-icons.js';

 

class MyMediaElement extends connect(store)(LitElement) {
  render() {
      if (this.media) {
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
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: inline-block;
          max-height: 100vh;
          color: rgba(255, 255, 255, 0.8);
        }
        div.inner-container img {
          display: block;
        }
        div.inner-container a {
          color: rgba(255, 255, 255, 0.8);
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
          display: block;
        }
        div.media-container img {
          /* display: block; */
          max-width:100vw;
          max-height:100vh;
        }
        div.file {
          background-color: rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        div.file svg {
          height: 70%;
          width: 70%;
          top: 15%;
        }
        div.file svg path {
          fill: rgba(0, 0, 0, 0.1);
        }  
        @media (hover: hover) {
          div.rect div.label {
            display: none;
          }

          div.rect:hover div.label {
            display: block;
          }
        }
        .label {
          color: #777;
          font-size: 0.8em;
          font-weight: 500;
          margin-bottom: 0.25em;
        }
        div.meta-container {
          background-color: rgba(255, 255, 255, 0.9);
          color: rgba(0, 0, 0, 0.75);
          text-align: left;
          font-size: 0.8em;
          padding: 1em;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (min-width: 768px) {
          div.inner-container {
            left: calc(50% - 100px);
          }
          div.media-container img {
            max-width:calc(100vw - 200px);
          }
          div.meta-container {
            width: calc(200px - 2em);
            min-height:calc(100% - 2em);
            position: absolute;
            right: -200px;
            top: 0;
          }
        }
        </style>
        <div class="media-container"
         style="transform: translateX(${this._translateX}px);"
         @touchstart="${this._handleTouchStart}"
         @touchmove="${this._handleTouchMove}"
         @touchend="${this._handleTouchEnd}">
            <div class="inner-container">
              ${this._innerContainerContent(this._mime)}
              <div class="meta-container">
              <p class="label">${_("Description")}</p>
              <p>${this._desc}</p>
              
              ${this._date ? html`
              <p class="label">${_("Date")}</p>
              <p>${this._date}</p>`
              : ''}
              
              ${this._notes.length ? html`<h4>${_("Notes")}</h4>` : ''}
              ${this._notes.map(n => html`
              <gr-note-element grampsid=${n}>
              </gr-note-element>
              `)}
              
              ${this._citations.length ? html`<h4>${_("Sources")}</h4>` : ''}
              <gr-citations-element .citations=${this._citations}>
              </gr-citations-element>
              </div>  
            </div>
        </div>
        ${this._prev ? html`
          <div class="arrow" style="left: 5vw;top: 50vh;">
            <span @click="${this._handle_left}" class="link">${chevronLeftIcon}</span>
          </div>
          ` : ''}
        ${this._next ? html`
          <div class="arrow" style="right: 5vw;top: 50vh;">
            <span @click="${this._handle_right}" class="link">${chevronRightIcon}</span>
          </div>
          ` : ''}
      `
      } else {
        return html`<p>Media object not found!</p>`
      }
    }

    _innerContainerContent(mime) {
      if (mime.startsWith('image/')) {
        return this._innerContainerContent_image();
      } else if (mime == 'application/pdf') {
        return this._innerContainerContent_pdf();
      } else {
        return this._innerContainerContent_file(mime);
      }
    }

    _innerContainerContent_image() {
      return html`
          <img src="${window.APIHOST}/api/media/${this.handle}?jwt=${this._token}"
          @error=${this._errorHandler}>
          </img>
          ${this._personRectangles()}`
    }

    _innerContainerContent_pdf() {
      return html`
          <object
            data="${window.APIHOST}/api/media/${this.handle}?jwt=${this._token}"
            type="application/pdf"
            style="width: 80vw; height: 90vh;"
          >
            ${this._innerContainerContent_file('application/pdf')}
          </object>`
    }

    _innerContainerContent_file(mime) {
      return html`
          <a
           mimetype="${mime}"
           href="${window.APIHOST}/api/media/${this.handle}?jwt=${this._token}"
           target="_blank"
          >
          <div  
              class="file"
              style="width:50vh;height:50vh;"
            >${fileIcon}
          </div>
          <br>
          ${_("Download")}
          </a>`
    }

    _personRectangles() {
      var _boundCloseLightbox = this._closeLightbox;
      return this._rect.map(function(item)  {
        if (!item.rect) {
          return '';
        }
        let left = item.rect[0];
        let top = item.rect[1];
        let width = item.rect[2] - item.rect[0];
        let height = item.rect[3] - item.rect[1];
        return html`
        <a href="person/${item.gramps_id}" @click="${_boundCloseLightbox}">
        <div class="rect"
          style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;">
          <div class="label">${item.name_given} ${item.name_surname}</div>
        </div>
        </a>
      `
      });
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

    constructor() {
      super();
      this._translateX = 0;
    }

    static get properties() { return {
      media: { type: Object },
      handle: { type: String },
      _rect: { type: Object },
      _prev: { type: String },
      _next: { type: String },
      _translateX: { type: Number },
      _mime: { type: String }
    }}

    firstUpdated() {
      window.addEventListener('keydown', this._escHandler.bind(this));
    }

    _handleTouchStart(e) {
      this._touchStartX = e.touches[0].pageX;
      this._touchMoveX = this._touchStartX;
    }

    _handleTouchMove(e) {
      this._touchMoveX = e.touches[0].pageX;
      this._translateX = this._touchMoveX - this._touchStartX;
    }

    _handleTouchEnd(e) {
      this._translateX = 0;
      let movedX = this._touchMoveX - this._touchStartX;
      if (movedX < -10  && this._next != '') {
        this._handle_right();
      } else if (movedX > 10 && this._prev != '') {
        this._handle_left();
      }
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

    _errorHandler(e) {
      this.dispatchEvent(new CustomEvent('media-load-error',
        {bubbles: true, composed: true}));
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
      this._token = state.api.token;
      if (state.app.activeMedia != undefined && state.api.media) {
        this.media = state.app.activeMedia.media;
        this.handle = state.app.activeMedia.selected;
        if (this.handle in state.api.media) {
          this._mime = state.api.media[this.handle].mime;
          this._desc = state.api.media[this.handle].desc;
          this._citations = state.api.media[this.handle].citations;
          this._notes = state.api.media[this.handle].notes;
          this._date = state.api.media[this.handle].date;
        }
        var _prev = '';
        var _next = '';
        var _handle = this.handle
        if (this.media != undefined && this.media.length) {
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

window.customElements.define('gr-media-element', MyMediaElement);
