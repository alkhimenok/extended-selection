import { Utils } from './Utils.js';

export class Element extends Utils {
  constructor(selector) {
    super()
    this.selector = selector
  }

  getElement(parent) {
    return this.element = this.getDomElement(this.selector, false, parent)
  }


  getElements(parent) {
    return this.element = Array.from(this.getDomElement(this.selector, true, parent))
  }


  createElement(content, classes) {
    this.element = document.createElement(this.selector)

    this.doClassList(this.element, 'add', classes)
    this.#checkRender(content, this.element)

    return this.element
  }


  remakeContent(content, type) {
    const duration = parseFloat(window.getComputedStyle(this.element).transitionDuration)
    const delay = duration * 1000 || 200

    if (!duration) {
      this.doClassList(this.element, 'add', '_delay')
      setTimeout(() => this.doClassList(this.element, 'remove', '_delay'), 2000)
    }
    if (type === 'value') {
      this.doClassList(this.element, 'add', '_hide-text')
      
      setTimeout(() => {
        this.element.value = content
        this.doClassList(this.element, 'remove', '_hide-text')
      }, delay)
    } else {
      this.doClassList(this.element, 'add', '_hide')
  
      setTimeout(() => {
        this.element.textContent = null
        this.#checkRender(content, this.element)
        this.doClassList(this.element, 'remove', '_hide')
      }, delay)
    }
  }


  removeElement() {
    if (this.#isElementArray()) {
      this.element.forEach(el => {
        this.#removing(el)
      })
    } else {
      this.#removing(this.element)
    }
  }


  renderElement(parent, position) {
    this.#checkRender(this.element, parent, position)
  }


  renderToElement(element, position) {
    if (this.#isElementArray()) {
      this.element.forEach((parent, i) => {
        if (this.toArray(element)) {
          if (element[i] === undefined) return
          this.#checkRender(element[i], parent, position)
        } else {
          if (typeof element === 'object') {
            element = element.cloneNode(true)
          }

          this.#checkRender(element, parent, position)
        }
      })
    } else {
      this.#checkRender(element, this.element, position)
    }
  }


  #removing(element) {
    this.doClassList(element, 'add', '_delay _hide')
    setTimeout(() => element.remove(), 200)
  }


  #isElementArray() {
    if (Array.isArray(this.element)) {
      return true
    } else {
      return false
    }
  }


  #checkRender(element, parent, position = 'beforeend') {
    if (!element) return
    if (typeof element === 'string') {
      parent.insertAdjacentHTML(position, element)
    } else {
      parent.insertAdjacentElement(position, element)
    }
  }
}