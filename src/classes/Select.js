import { Element } from './Element.js';
import { Option } from './Option.js';


export class Select extends Element { ///////////////////////////////////////////
  constructor(options) {
    super()
    this.select = options.select
    this.parent = options.parent
    this.index = options.index

    this.remakeSelect()
  }


  remakeSelect() {
    const { options, name } = this.select
    const id = `select${this.index}`
    const castomSelect = `<form class="select__options-list" id="${id}" name="${name}" action="#"></form>`

    this.renderToElement(castomSelect, this.parent)

    const $currentSelect = this.getDomElement(`#${id}`)

    Array.from(options).forEach(option => new Option({
      option,
      parent: $currentSelect,
    }))

    this.checkedOption = this.checkedOption.bind(this)
    $currentSelect.addEventListener('change', this.checkedOption)

    this.select.remove()
  }


  checkedOption(e) {
    const checkboxInput = e.target
    const checkbox = checkboxInput.closest('.checkbox')
    const currentOption = checkboxInput.closest('.option')

    this.toggleClassName(checkbox, '_checked', checkboxInput.checked)
    this.toggleClassName(currentOption, '_selected', checkboxInput.checked)
  }
}