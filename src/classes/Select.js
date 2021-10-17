import { Element } from './Element.js';
import { Option } from './Option.js';


export class Select extends Element {
  constructor(options) {
    super()
    this.redoneSelect = options.redoneSelect
    this.parentSelect = options.parentSelect
    this.index = options.index

    this.$redoneSelect = this.redoneSelect.element
    this.$parentSelect = this.parentSelect.element

    this.selectId = `select${this.index}`

    this.remakeSelect()
  }


  remakeSelect() {
    const { options, name } = this.$redoneSelect
    const murkupSelect = `
      <div class="select" id="${this.selectId}">
        <div class="select__container">
          <div class="select__body">
            <section class="select__header">
              <section class="select__heading">
                <h2 class="select__title">
                  Тендеры в роли Поставщика
                </h2>
                <a class="select__btn_show-selected" href="#">
                  Показать выбранное (<span class="select__count-selected">10</span>)
                </a>
              </section>
              <section class="select__selected-options">
                <input class="select__input_search" type="search" disabled value="Код ОКРБ или наименование закупаемой продукции" placeholder="Поиск">
              </section>
            </section>
            <div class="select__content">
              <section class="select__main">
                <form class="select__options-list" name="${name}" action="#"></form>
              </section>
              <section class="select__footer">
                <button class="select__btn_accept">
                  применить
                </button>
                <button class="select__btn_clear">
                  Очистить
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
      `

    this.parentSelect.renderToElement(murkupSelect)

    this.setSelectComponents()
    this.fillSelect(options)
    this.addSelectHandlers()

    this.redoneSelect.removeElement()
  }


  setSelectComponents() {
    this.select = new Element(`#${this.selectId}`)
    this.$select = this.select.getElement()

    this.titleSelect = new Element('.select__title')
    this.$titleSelect = this.titleSelect.getElement(this.$select)

    this.btnShowSelected = new Element('.select__btn_show-selected')
    this.$btnShowSelected = this.btnShowSelected.getElement(this.$select)

    this.countOptionsSelected = new Element('.select__count-selected')
    this.$countOptionsSelected = this.countOptionsSelected.getElement(this.$select)

    this.inputSearch = new Element('.select__input_search')
    this.$inputSearch = this.inputSearch.getElement(this.$select)

    this.formSelect = new Element('form')
    this.$formSelect = this.formSelect.getElement(this.$select)

    this.btnAccept = new Element('.select__btn_accept')
    this.$btnAccept = this.btnAccept.getElement(this.$select)

    this.btnClear = new Element('.select__btn_clear')
    this.$btnClear = this.btnClear.getElement(this.$select)

    this.sublists = []

    this.optionList = []

    this.selectedOption = []

    this.arrows = []

    this.mainOptionText = ''
  }


  fillSelect(options) {///////////////////////////////////////////...............................................................
    const parents = { 1: this.formSelect }
    let prevLevel = 1

    this.toArray(options)
      .forEach(item => {
        let level = item.dataset.level ?? 1

        while (prevLevel > level && prevLevel > 0) {
          delete parents[prevLevel]
          --prevLevel
        }

        if (!parents[level]) {
          const currentSublist = this.#createSublist(parents[prevLevel].element)

          this.sublists.push(currentSublist.element)

          parents[level] = currentSublist
          prevLevel = level
        }

        const option = new Element(item)
        option.getElement()

        const exemplar = new Option({ option, select: this.formSelect, parent: parents[level], index: this.index })

        this.optionList.push(exemplar.currentOption.element)
      })

    // this.#setHeight()
    this.#hideSubList()
  }


  addSelectHandlers() {
    this.checkTarget = this.#checkTarget.bind(this)
    this.$select.addEventListener('click', this.checkTarget)

    this.shearchOption = this.shearchOption.bind(this)
    this.$inputSearch.addEventListener('input', this.shearchOption)
  }


  showOptions() {
    if (this.$inputSearch.disabled) {
      this.doClassList(this.$select, 'add', '_show-options')

      this.titleSelect.remakeContent('Реализуемые товары')
      this.inputSearch.remakeContent('Поиск', 'value')

      this.$inputSearch.disabled = false
    }
  }


  hideOptions() {
    this.doClassList(this.$select, 'remove', '_show-options')

    if (this.doClassList(this.$select, 'contains', '_there-are-selected')) {
      this.titleSelect.remakeContent('Тендеры в роли Заказчика')
      this.inputSearch.remakeContent(this.mainOptionText, 'value')
    } else {
      this.titleSelect.remakeContent('Тендеры в роли Поставщика')
      this.inputSearch.remakeContent('Код ОКРБ или наименование закупаемой продукции', 'value')
    }

    this.$inputSearch.disabled = true
  }


  acceptSelectedOptions() {
    this.#setMainOption()
    this.#saveAcceptedOptions()

    this.$countOptionsSelected.textContent = this.selectedOption.length

    this.hideOptions()

    console.log(this.selectedOption);
    return this.selectedOption
  }


  clearSelectedOptions() { ///////////////////////////////////////////...............................................................
    this.#setMainOption()

    this.selectedOption
      .forEach(option => {
        this.getDomElement('.checkbox__input', false, option).click()
      })

    this.#setMainOption()
    this.#saveAcceptedOptions()
  }


  shearchOption(e) { ///////////////////////////////////////////...............................................................
    this.#showSublist()

    const { target } = e
    const { value } = target
    const { length } = value

    const inputExpression = new RegExp(value, 'i')

    this.optionList.forEach(option => { ///////////////////////////////////////
      const optionText = new Element('.option__text')
      const $optionText = optionText.getElement(option)
      const { textContent } = $optionText
      const text = textContent.trim()
      const position = text.search(inputExpression)

      if (position !== -1) {
        const start = text.slice(0, position)
        const center = text.slice(position, position + length)
        const end = text.slice(position + length)

        $optionText.innerHTML = start + `<span class="_highlight">${center}</span>` + end

        this.doClassList(option, 'remove', '_none')
      } else {
        $optionText.innerHTML = text
        this.doClassList(option, 'add', '_none')
      }
    })

    this.setHeight()
  }


  #checkTarget(e) {
    const { target } = e

    if (this.doClassList(this.$select, 'contains', '_there-are-selected')) {
      if (target === this.$btnShowSelected) {
        this.showOptions()
      }
    } else {
      if (target === this.$inputSearch) {
        this.showOptions()
      }
    }

    if ((target === this.$titleSelect) && (this.doClassList(this.$select, 'contains', '_show-options'))) {
      this.hideOptions()
    }

    if (target === this.$btnAccept) {
      this.acceptSelectedOptions()
    } else if (target === this.$btnClear) {
      this.clearSelectedOptions()
    }
  }


  #createSublist(parent) {
    const sublist = new Element('div')
    sublist.createElement('', 'select__options-sublist')
    sublist.renderElement(parent)

    return sublist
  }


  setHeight() { ///////////////////////////////////////////
    const $lines = this.getDomElement('.arrow__vertical-line', true)

    $lines.forEach(line => {
      if (line.closest('.option').nextElementSibling?.classList.contains('select__options-sublist')) {
        const o = line.closest('.option').nextElementSibling
        console.log(o.clientHeight);
        line.style.height = `${o.clientHeight}px`
      }
    })
  }


  #hideSubList() { ///////////////////////////////////////////...............................................................
    this.sublists.forEach(subList => this.doClassList(subList, 'add', '_none'))
  }


  #showSublist() { ///////////////////////////////////////////...............................................................
    this.sublists.forEach(subList => {
      this.doClassList(subList, 'remove', '_none')
    })
  }


  #setMainOption() {
    let num = Infinity
    this.selectedOption = this.#getselectedOption()

    this.mainOptionText = this.selectedOption
      .reduce((acc, option) => {
        const { value, level } = option.dataset

        level < num ? num = level : num
        return value > acc ? option : acc
      }, null)?.textContent
      .trim()
      .split(' ')
      .filter(letter => !letter == '')
      .join(' ')
  }


  #getselectedOption() {
    return this.filterOnClassName(this.optionList, '_selected')
  }


  #saveAcceptedOptions() {
    this.#resetSearch()
    this.toggleClassName(this.$select, '_there-are-selected', this.selectedOption.length)
  }


  #resetSearch() { ///////////////////////////////////////////...............................................................
    this.optionList.forEach(option => {
      const optionText = new Element('.option__text').getElement(option)

      this.doClassList(option, 'remove', '_none')

      optionText.textContent = option.textContent.trim()
    })
  }
}
// #setHeight() { ///////////////////////////////////////////...............................................................
  //   this.sublists.forEach(sublist => {
  //     const arrow = new Element('.arrow')
  //     const $arrow = arrow.getElement(sublist.previousElementSibling)
      
  //     this.arrows.push($arrow)

  //     $arrow.dataset.height = window.getComputedStyle(sublist).height
  //   })
  // }

    // setHeight() { ///////////////////////////////////////////...............................................................
  //   this.arrows.forEach(arrow => {
  //     const line = arrow.querySelector('.arrow__vertical-line')
  //     line.style.height = arrow.dataset.height
  //     this.doClassList(arrow, 'toggle', '_show-sublist')
  //   })
  // }