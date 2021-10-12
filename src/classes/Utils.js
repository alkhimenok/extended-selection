export class Utils {
  getDomElement(selector, all, parent = document) {
    return typeof selector === 'string'
      ? all 
        ?  parent.querySelectorAll(selector) 
        :  parent.querySelector(selector) 
      : selector
  }
  toggleClassName(el, className, condition) {
    if (condition) {
      el.classList.add(className)
    } else {
      el.classList.remove(className)
    }
  }
  filterOnClassName(arr, className) {
    return !className
      ? Array.from(arr)
      : Array.from(arr).filter(el => el.classList.contains(className))
  }
}