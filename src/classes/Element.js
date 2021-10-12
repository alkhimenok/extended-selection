import { Utils } from './Utils.js';

export class Element extends Utils {
  constructor(selector) {
    super()
    this.selector = selector
  }

  getElement(parent) {
    return this.getDomElement(this.selector, false, parent)
  }
  getElements(parent) {
    return Array.from(this.getDomElement(this.selector, true, parent))
  }
  renderElement(element, parent, position = 'beforeend') {
    parent.insertAdjacentHTML(position, element)
  }
}