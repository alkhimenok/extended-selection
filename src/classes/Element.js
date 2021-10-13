import { Utils } from './Utils.js';

export class Element extends Utils {
  constructor(selector) {
    super()
    this.selector = selector
    this.element = this.getDomElement(this.selector, false)
  }

  getElement(parent) {
    return this.getDomElement(this.selector, false, parent)
  }
  getElements(parent) {
    return Array.from(this.getDomElement(this.selector, true, parent))
  }
  renderToElement(element, parent = this.element, position = 'beforeend') {
    parent.insertAdjacentHTML(position, element)
  }
  // renderToElement() {}
}