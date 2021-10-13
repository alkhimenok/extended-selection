import { Element } from './Element.js';


export class Option extends Element { ///////////////////////////////////////////
  constructor(options) {
    super()
    this.parent = options.parent
    this.option = options.option

    this.fillSelect()
  }

  fillSelect() {
    const { value, textContent, dataset } = this.option
    this.id = `option${value}`
    this.level = dataset.level ?? 1
    const castomOption = `
        <fieldset class="select__option option" id="${this.id}" name="${this.id}" data-level="${this.level}">
          <label class="option__label">
            <label class="option__checkbox checkbox">
              <input class="checkbox__input" type="checkbox">
            </label>
            <span class="option__text">
              ${textContent}
            </span>
          </label>
          <div class="option__arrow arrow">
            <span class="arrow__icon"></span>
            <span class="arrow__vertical-line"></span>
          </div>
        </fieldset>
      `

    this.renderToElement(castomOption, this.parent)

    this.$currentOption = this.parent.elements[this.id]

    this.setPadding(this.$currentOption, this.level)

    this.addHandler = this.addHandler.bind(this)
    this.$currentOption.addEventListener('click', this.addHandler)
  }

  setPadding(option, level) {
    this.$currentOptionText = option.querySelector('.option__text')
    this.$currentArrow = option.querySelector('.arrow')

    this.$currentOptionText.style.paddingLeft = `${20 + 15 * level}px`
    this.$currentArrow.style.left = `${40 + 15 * level}px`
  }

  addHandler(e) {
    if (e.target === this.$currentArrow) {
      e.target.classList.toggle('_show-sub-list')
    }
  }
}