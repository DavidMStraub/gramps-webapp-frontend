/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  section {
    padding: 24px;
    background: var(--app-section-odd-color);
  }

  section > * {
    /* max-width: 600px; */
    margin-right: auto;
    margin-left: auto;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  h2, h3, h4 {
    text-align: left;
    color: var(--app-dark-text-color);
  }

  h2 {
    font-size: 24px;
    font-weight: 300;
  }

  h3 {
    font-size: 20px;
    font-weight: 400;
  }

  h4 {
    font-size: 16px;
    font-weight: 400;
    margin: 0.67em 0;
  }

  a:link, a:visited, a:hover, a:active {
    color: var(--app-dark-text-color);
    text-decoration:none;
    outline: none;
  }

  paper-card {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 5px;
  }
  

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }
    h3 {
      font-size: 28px;
    }
    h4 {
      font-size: 18px;
    }
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color);
    color: var(--app-light-text-color);
    font-size: 30px;
    line-height: 64px;
  }

  svg {
      height: 1em;
      top: .125em;
      position: relative;
  }
  svg path {
      fill: #aaa;
  }
  .link {
    cursor: pointer;
  }
  .arrow svg {
    height: 2.5em;
    width: 2.5em;
  }

  .arrow:hover svg path {
    fill: #ffffff;
  }

  .arrow svg path {
    fill: #aaaaaa;
  }

  .arrow {
    position: absolute;
  }
  vaadin-grid {
    height:calc(100vh - 48px);
  }
  @media (min-width: 768px) {
    vaadin-grid {
      height:calc(100vh - 48px);
      margin-top: 0;
    }
  }
`;
