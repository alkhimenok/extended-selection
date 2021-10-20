const getMurkupCastomSelect = (id, name) => {
	return `
    <div class="select" id="${id}">
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
              <input class="select__input" type="search" disabled value="Код ОКРБ или наименование закупаемой продукции" placeholder="Поиск">
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
}
const getMurkupCastomOption = (id, content, level, selected, value) => {
	return `
    <fieldset class="select__option option ${selected ? '_selected' : ''}" id="${id}" name="${id}" data-value="${value}" data-level="${level}">
      <label class="option__label">
        <label class="option__checkbox checkbox ${selected ? '_checked' : ''}">
          <input class="checkbox__input" type="checkbox" ${selected ? 'checked' : ''}>
        </label>
        <span class="option__text" style="padding-left: ${20 + 15 * level}px;">
          ${content}
        </span>
      </label>
      <div class="option__arrow arrow" style="left: ${40 + 15 * level}px;">
        <span class="arrow__close"></span>
        <span class="arrow__icon"></span>
        <span class="arrow__vertical-line"></span>
      </div>
    </fieldset>
    `
}

export class Select {
	constructor(parentSelector, selectData, optionData) {
		this.$parentSelect = document.querySelector(parentSelector)

		this.$initialSelect = selectData.initialSelect
		this.nameSelect = selectData.name
		this.indexSelec = selectData.index
		this.idSelect = `select${this.indexSelec}`

		this.optionData = optionData

		this.#destroyInitialSelect()
		this.#remakeSelect()
		this.#addSelectHandlers()

    if (this.selectedOption.length) {
      this.acceptSelectedOptions()
    }
	}

	#destroyInitialSelect() {
		this.$initialSelect.remove()
	}

	#remakeSelect() {
		const murkupCastomSelect = getMurkupCastomSelect(this.idSelect, this.nameSelect)

		this.$parentSelect.insertAdjacentHTML('afterbegin', murkupCastomSelect)

		this.#setSelectComponents()
		this.#fillSelect()
		this.#hideSubList()
	}

	#setSelectComponents() {
		this.$select = this.$parentSelect.querySelector(`#${this.idSelect}`)
		this.$titleSelect = this.$select.querySelector('.select__title')
		this.$btnShowSelected = this.$select.querySelector('.select__btn_show-selected')
		this.$countOptionsSelected = this.$select.querySelector('.select__count-selected')
		this.$inputSelect = this.$select.querySelector('.select__input')
		this.$formSelect = this.$select.querySelector('form')
		this.$btnAccept = this.$select.querySelector('.select__btn_accept')
		this.$btnClear = this.$select.querySelector('.select__btn_clear')
		this.sublists = []
		this.optionList = []
		this.selectedOption = []
		this.arrows = []
    this.mainOptionText = "";
	}

	#fillSelect() {
		const parents = { 1: this.$formSelect }
		let prevLevel = 1

		this.optionData.forEach((itemData) => {
			const { content, level, selected, value } = itemData

			while (prevLevel > level && prevLevel > 0) {
				delete parents[prevLevel]
				--prevLevel
			}

			if (!parents[level]) {
				const $currentSublist = this.#createSublist(parents[prevLevel])

				this.sublists.push($currentSublist) //////

				parents[level] = $currentSublist
				prevLevel = level
			}

			this.#renderOption(parents[level], content, level, selected, value)
		})
	}

	#createSublist(parent) {
		const sublist = document.createElement('div')
		sublist.classList.add('select__options-sublist')
		parent.insertAdjacentElement('beforeend', sublist)

		return sublist
	}

	#renderOption(parent, content, level, selected, value) {
		const idOption = `option${value}-${this.indexSelec}`
		const murkupCastomOption = getMurkupCastomOption(idOption, content, level, selected, value)

		parent.insertAdjacentHTML('beforeend', murkupCastomOption)

		const currentOption = parent.querySelector(`#${idOption}`)

		this.optionList.push(currentOption)

		if (selected) this.selectedOption.push(currentOption)
	}

	#addSelectHandlers() {
		this.checkTarget = this.#checkTarget.bind(this)
		this.$select.addEventListener('click', this.checkTarget)

		this.shearchOption = this.shearchOption.bind(this)
		this.$inputSelect.addEventListener('input', this.shearchOption)

		this.chooseOption = this.chooseOption.bind(this)
		this.$formSelect.addEventListener('change', this.chooseOption)
	}

	chooseOption(e) {
		e.preventDefault()
		const $inputCheckbox = e.target
		const $castomCheckbox = e.target.closest('.checkbox')
		const $currentOption = e.target.closest('.option')

		if ($inputCheckbox.checked) {
			$castomCheckbox.classList.add('_checked')
			$currentOption.classList.add('_selected')
		} else {
			$castomCheckbox.classList.remove('_checked')
			$currentOption.classList.remove('_selected')
		}
	}

	#checkTarget(e) {
		const { target } = e

		if (this.$select.classList.contains('_there-are-selected')) {
			if (target === this.$btnShowSelected) {
				this.showOptions()
			}
		} else {
			if (target === this.$inputSelect) {
				this.showOptions()
			}
		}

		if (target.closest('.arrow')) {
      this.#showCurrentSubList(target.closest('.arrow'))
		}

		if (target === this.$titleSelect && this.$select.classList.contains('_show-options')) {
			this.hideOptions()
		}

		if (target === this.$btnAccept) {
			this.acceptSelectedOptions()
		} else if (target === this.$btnClear) {
			this.clearSelectedOptions()
		}
	}

  #showCurrentSubList(e) { /////////////////////////////////////
    const $currentOption = e.closest('.option')
    if ($currentOption.nextElementSibling?.classList.contains('select__options-sublist')) {
      $currentOption.nextElementSibling.classList.toggle('_none')
      e.classList.toggle('_show-sublist')

      this.setHeight()
    }
    else {
      e.classList.add('_no-sublist')
    }
  }

	showOptions() {
		if (this.$inputSelect.disabled) {
			this.$select.classList.add('_show-options')

			this.$titleSelect.textContent = 'Реализуемые товары'
			this.$inputSelect.value = 'Поиск'

			this.$inputSelect.disabled = false
		}
	}

	hideOptions() {
		this.$select.classList.remove('_show-options')

		if (this.$select.classList.contains('_there-are-selected')) {
			this.$titleSelect.textContent = 'Тендеры в роли Заказчика'
			this.$inputSelect.value = this.mainOptionText
		} else {
			this.$titleSelect.textContent = 'Тендеры в роли Поставщика'
			this.$inputSelect.value = 'Код ОКРБ или наименование закупаемой продукции'
		}

		this.$inputSelect.disabled = true
	}

	acceptSelectedOptions() {
		this.#setMainOption()
		this.#saveAcceptedOptions()

		this.$countOptionsSelected.textContent = this.selectedOption.length

		this.hideOptions()

		console.log(this.selectedOption)
		return this.selectedOption
	}

	clearSelectedOptions() {
		///////////////////////////////////////////...............................................................
		this.#setMainOption()

		this.selectedOption.forEach((option) => {
			option.querySelector('.checkbox__input').click()
		})

		this.#setMainOption()
		this.#saveAcceptedOptions()
	}

	shearchOption(e) {
		///////////////////////////////////////////...............................................................
		this.#showSublist()

		const { target } = e
		const { value } = target
		const { length } = value

		const inputExpression = new RegExp(value, 'i')

		this.optionList.forEach((option) => {
			///////////////////////////////////////
			const $optionText = option.querySelector('.option__text')
			const { textContent } = $optionText
			const text = textContent.trim()
			const position = text.search(inputExpression)

			if (position !== -1) {
				const start = text.slice(0, position)
				const center = text.slice(position, position + length)
				const end = text.slice(position + length)

				$optionText.innerHTML = start + `<span class="_highlight">${center}</span>` + end

				option.classList.remove('_none')
			} else {
				$optionText.innerHTML = text
				option.classList.add('_none')
			}
		})

		this.setHeight()
	}

	setHeight() {
		///////////////////////////////////////////
		const $lines = this.$formSelect.querySelectorAll('.arrow__vertical-line')

		$lines.forEach((line) => {
			if (line.closest('.option').nextElementSibling?.classList.contains('select__options-sublist')) {
				const o = line.closest('.option').nextElementSibling
				line.style.height = `${o.clientHeight}px`
			}
		})
	}

	#hideSubList() {
		///////////////////////////////////////////...............................................................
		this.sublists.forEach((subList) => subList.classList.add('_none'))
	}

	#showSublist() {
		///////////////////////////////////////////...............................................................
		this.sublists.forEach((subList) => {
			subList.classList.remove('_none')
		})
	}

	#setMainOption() {
		let num = Infinity
		this.selectedOption = this.#getselectedOption()

		this.mainOptionText = this.selectedOption
			.reduce((acc, option) => {
				const { value, level } = option.dataset

				level < num ? (num = level) : num
				return value > acc ? option : acc
			}, null)
			?.textContent.trim()
			.split(' ')
			.filter((letter) => !letter == '')
			.join(' ')
	}

	#getselectedOption() {
		return this.optionList.filter((option) => option.classList.contains('_selected'))
	}

	#saveAcceptedOptions() {
		this.#resetSearch()

		this.selectedOption.length ? this.$select.classList.add('_there-are-selected') : this.$select.classList.remove('_there-are-selected')
	}

	#resetSearch() {
		///////////////////////////////////////////...............................................................
		this.optionList.forEach((option) => {
			const optionText = option.querySelector('.option__text')

			option.classList.remove('_none')

			optionText.textContent = option.textContent.trim()
		})
	}
}
