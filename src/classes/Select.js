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
    this.$currentSelect = this.currentSelect.getElement()

    this.fillSelect(options)
    // //////////////////////////
    this.newSelect = new Element('.select')
    this.$newSelect = this.newSelect.getElement()

    this.addHandlerSelect = this.addHandlerSelect.bind(this)
    this.$newSelect.addEventListener('click', this.addHandlerSelect)
    // //////////////////////////
    this.select.removeElement()
  }


  addHandlerSelect(e) {// //////////////////////////
    if (this.doClassList(e.target, 'contains', 'select__input')) {
      this.doClassList(e.currentTarget, 'add', '_show-options')
      this.doClassList(e.currentTarget, 'remove', '_there-are-selected')

    }
    // if (this.doCla/ssList(e.target, 'contains', 'select__title')) {
    //   this.doClassList(e.currentTarget, 'remove', '_show-options')
    //   this.doClassList(e.currentTarget, 'remove', '_there-are-selected')

    // }
    if (this.doClassList(e.target, 'contains', 'select__btn_accept') || this.doClassList(e.target, 'contains', 'select__title')) {
      this.doClassList(e.currentTarget, 'remove', '_show-options')
      const selectedOption = new Element('._selected')
      const $selectedOption = selectedOption.getElements(this.$newSelect)
      const count = $selectedOption.length
      const countSelectedOption = new Element('.select__count-selected')
      const $countSelectedOption = countSelectedOption.getElement(this.$newSelect)
      const selectInput = new Element('.select__input')
      const $selectInput = selectInput.getElement()

      let maxOption = Infinity
      let res = null

      for (let option of $selectedOption) {
        if (option.dataset.level < maxOption) {
          maxOption = option.dataset.level
          res = option
        }
      }

      if (count) {
        $selectInput.value = res.innerText
        $countSelectedOption.textContent = count
        this.doClassList(e.currentTarget, 'add', '_there-are-selected')
      } else {
        $selectInput.value = 'Код ОКРБ или наименование закупаемой продукции'

      }
    }
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
          newParent.renderElement(parents[prevLevel].element)

          prevLevel = level
          parents[level] = newParent
        }

        const option = new Element(item)
        option.getElement()

        new Option({ option, select: this.currentSelect, parent: parents[level] })
      })

    this.hideSubList()
  }


  hideSubList() { //////////////////////////////////////////
    const subLists = new Element('.select__options-sublist')
    const $subLists = subLists.getElements()

    $subLists.forEach(subList => this.doClassList(subList, 'add', '_none'))
  }
}