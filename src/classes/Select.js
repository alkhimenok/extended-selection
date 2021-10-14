import { Element } from './Element.js';
import { Option } from './Option.js';


export class Select extends Element {
  constructor(options) {
    super()
    this.select = options.select
    this.$select = this.select.element
    this.parentSelect = options.parentSelect
    this.$parentSelect = this.parentSelect
    this.index = options.index

    this.remakeSelect()
  }


  remakeSelect() {
    const { options, name } = this.$select
    const selectId = `select${this.index}`
    const castomSelect = `<form class="select__options-list" id="${selectId}" name="${name}" action="#"></form>`

    this.parentSelect.renderToElement(castomSelect)

    this.currentSelect = new Element(`#${selectId}`)
    this.currentSelect.getElement()

    this.fillSelect(options)

    this.select.removeElement()
  }


  fillSelect(options) { //////////////////////////////////////
    const parents = { 1: this.currentSelect }
    let prevLevel = 1

    this.toArray(options)
      .forEach(item => {
        let { level } = item.dataset
        level ??= 1

        while (prevLevel > level) {
          if (prevLevel < 0) break
          delete parents[prevLevel]
          --prevLevel
        }

        if (!parents[level]) {
          const newParent = new Element('div')
          newParent.createElement('', 'select__options-sublist')
          newParent.renderElement(parents[prevLevel].element, 'beforeend')

          prevLevel = level
          parents[level] = newParent
        }

        const option = new Element(item)
        option.getElement()

        new Option({ option, select: this.currentSelect, parent: parents[level] })
      })
  }
}