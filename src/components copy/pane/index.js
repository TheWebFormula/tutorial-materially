import HTMLComponentElement from '../HTMLComponentElement.js';
import styles from './component.css' assert { type: 'css' };

export default class WFMPaneContainerElement extends HTMLComponentElement {
  static tag = 'wfm-pane-container';
  static useShadowRoot = true;
  static useTemplate = true;
  static styleSheets = [styles];


  constructor() {
    super();

    if (this.hasAttribute('scroll')) document.body.classList.add('pane-layout');
    this.render();
  }

  template() {
    return /*html*/`
      <slot></slot>
      <div class="resize-handle"></div>
    `;
  }
}

customElements.define(WFMPaneContainerElement.tag, WFMPaneContainerElement);
