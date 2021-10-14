export class Utils {
  getDomElement(selector, all, parent = document) {
    return typeof selector === 'string'
      ? all
        ? parent.querySelectorAll(selector)
        : parent.querySelector(selector)
      : selector
  }
  doClassList(selector, type, classes) {
    const element = this.getDomElement(selector)
    const names = this.#checkClassNames(classes)

    for (const name of names) {
      if (type === 'remove') {
        element.classList.remove(name)
      } else if (type === 'toggle') {
        element.classList.toggle(name)
      } else if (type === 'add') {
        element.classList.add(name)
      } else if (type === 'contains') {
        return element.classList.contains(name)
      } else {
        throw new Error(`element.classList.${type} is not a function`)
      }
    }
  }
  toggleClassName(element, className, condition) {
    if (condition) {
      element.classList.add(className)
    } else {
      element.classList.remove(className)
    }
  }
  filterOnClassName(array, className) {
    return !className
      ? this.toArray(array)
      : this.toArray(array).filter(element => element.classList.contains(className))
  }
  toArray(element, pause = ' ') {
    return typeof element === 'string' ? element.split(pause) : Array.from(element)
  }
  #checkClassNames(classes) {
    if (!classes) return ''
    return Array.isArray(classes) ? classes : classes.split(' ')
  }
}