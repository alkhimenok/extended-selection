const getMurkupCastomSelect = (id, name) => {
	return `
		<form class="select" id="${id}" name="${name}" action="#">
			<div class="select__container">
				<div class="select__body">
					<fieldset class="select__header" form="${id}">
						<section class="select__heading">
							<h2 class="select__title">
								Тендеры в роли Заказчика
							</h2>
							<button class="select__btn_show-selected">
                Показать выбранное (<span class="select__count-selected">3</span>)
              </button>
						</section>
						<section class="select__selected-option">
							<input class="select__input" type="search" disabled	value="Код ОКРБ или наименование закупаемой продукции" placeholder="Поиск">
						</section>
					</fieldset>
					<div class="select__content">
						<section class="select__options-list">
						</section>
						<fieldset class="select__footer" form="${id}">
							<button class="select__btn_accept">
								применить
							</button>
							<button class="select__btn_clear">
								очистить
							</button>
						</fieldset>
					</div>
				</div>
			</div>
		</form>
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
	constructor(parentSelector, selectData, optionsData) {
		this.$parentSelect = document.querySelector(parentSelector)

		this.$initialSelect = selectData.initialSelect
		this.nameSelect = selectData.name
		this.indexSelec = selectData.index + 1
		this.idSelect = `select${this.indexSelec}`

		this.optionsData = optionsData

		this.#destroyInitialSelect()
		this.#remakeSelect()
		this.#addSelectHandlers()

		if (this.selectedOptions.length) {
			this.acceptSelectedOptions()
		}
	}

	get #isThereAreSelected() {
		return this.$select.classList.contains('_there-are-selected')
	}

	get #isOptionsShow() {
		return this.$select.classList.contains('_show-options')
	}

	#getSelectedOptions() {
		return this.options.filter((option) => option.classList.contains('_selected'))
	}

	#getNextSublist($child) {
		const $option = $child.closest('.option')

		return $option.nextElementSibling?.classList.contains('select__options-sublist') ? $option.nextElementSibling : null
	}

	#getPrevArrow($sublist) {
		return $sublist?.previousElementSibling ? $sublist.previousElementSibling.querySelector('.arrow') : null
	}

	#getOptionComponent($option) {
		return {
			$checkbox: $option.querySelector('.checkbox'),
			$input: $option.querySelector('.checkbox__input'),
		}
	}

	#destroyInitialSelect() {
		this.$initialSelect.remove()
	}

	#remakeSelect() {
		const murkupCastomSelect = getMurkupCastomSelect(this.idSelect, this.nameSelect)

		this.$parentSelect.insertAdjacentHTML('beforeend', murkupCastomSelect)

		this.#setSelectComponents()
		this.#fillSelect()
		this.hideAllSublists()
	}

	#setSelectComponents() {
		this.$select = this.$parentSelect.querySelector(`#${this.idSelect}`)
		this.$titleSelect = this.$select.querySelector('.select__title')
		this.$btnShowSelected = this.$select.querySelector('.select__btn_show-selected')
		this.$countOptionsSelected = this.$select.querySelector('.select__count-selected')
		this.$inputSelect = this.$select.querySelector('.select__input')
		this.$optionsList = this.$select.querySelector('.select__options-list')
		this.$btnAccept = this.$select.querySelector('.select__btn_accept')
		this.$btnClear = this.$select.querySelector('.select__btn_clear')

		this.sublists = []
		this.options = []
		this.lines = []
		this.selectedOptions = []
		this.mainOptionText = ''
	}

	#fillSelect() {
		const parents = { 1: this.$optionsList }
		let prevLevel = 1

		this.optionsData.forEach((itemData) => {
			const { content, level, selected, value } = itemData

			while (prevLevel > level && prevLevel > 0) {
				delete parents[prevLevel]
				--prevLevel
			}

			if (!parents[level]) {
				const $currentSublist = this.#createSublist(parents[prevLevel])

				this.sublists.push($currentSublist)

				parents[level] = $currentSublist
				prevLevel = level
			}

			this.#renderOption(parents[level], content, level, selected, value)
		})
	}

	#createSublist($parent) {
		const $sublist = document.createElement('div')
		$sublist.classList.add('select__options-sublist')
		$parent.insertAdjacentElement('beforeend', $sublist)

		return $sublist
	}

	#renderOption($parent, content, level, selected, value) {
		const idOption = `option${this.indexSelec}-${value}`
		const murkupCastomOption = getMurkupCastomOption(idOption, content, level, selected, value)

		$parent.insertAdjacentHTML('beforeend', murkupCastomOption)

		const $currentOption = $parent.querySelector(`#${idOption}`)
		const $currentVerticalLine = $currentOption.querySelector('.arrow__vertical-line')

		this.options.push($currentOption)
		this.lines.push($currentVerticalLine)

		if (selected) this.selectedOptions.push($currentOption)
	}

	#addSelectHandlers() {
		this.checkTarget = this.#checkTarget.bind(this)
		this.$select.addEventListener('click', this.checkTarget)

		this.switchOptionSelection = this.#switchOptionSelection.bind(this)
		this.$optionsList.addEventListener('change', this.switchOptionSelection)

		this.clearValue = this.#clearValue
		this.$inputSelect.addEventListener('focus', this.clearValue)

		this.shearchOption = this.#shearchOption.bind(this)
		this.$inputSelect.addEventListener('input', this.shearchOption)
	}

	#removeSelectHandlers() {
		this.$select.removeEventListener('click', this.checkTarget)
		this.$optionsList.removeEventListener('change', this.switchOptionSelection)
		this.$inputSelect.removeEventListener('focus', this.clearValue)
		this.$inputSelect.removeEventListener('input', this.shearchOption)
	}

	#checkTarget(e) {
		const { target } = e

		if (this.#isThereAreSelected && target === this.$btnShowSelected) {
			this.showOptions()
		} else if (!this.#isThereAreSelected && target === this.$inputSelect) {
			this.showOptions()
		} else if (this.#isOptionsShow && target === this.$titleSelect) {
			this.hideOptions()
		} else if (target === this.$btnAccept) {
			this.acceptSelectedOptions()
		} else if (target === this.$btnClear) {
			this.clearSelectedOptions()
		} else if (target.closest('.arrow')) {
			this.#toggleShowSublist(target.closest('.arrow'))
		} else {
			return
		}
	}

	#setMainOption() {
		let num = Infinity
		this.selectedOptions = this.#getSelectedOptions()

		this.mainOptionText = this.selectedOptions
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

	#saveAcceptedOptions() {
		this.#resetSearch()

		this.selectedOptions.length ? this.$select.classList.add('_there-are-selected') : this.$select.classList.remove('_there-are-selected')
	}

	#resetSearch() {
		this.options.forEach(($option) => {
			const $optionText = $option.querySelector('.option__text')

			$optionText.textContent = $option.textContent.trim()

			$option.classList.remove('_none')
		})
	}

	#toggleShowSublist($currentArrow) {
		const $currentSublist = this.#getNextSublist($currentArrow)

		if ($currentSublist) {
			if ($currentSublist.classList.contains('_none')) {
				this.#showSublist($currentSublist)
			} else {
				this.#hideSublist($currentSublist)
			}
		} else {
			$currentArrow.classList.add('_no-sublist')
		}
	}

	#showSublist($sublist) {
		this.#doShowSublist($sublist, true)
	}

	#hideSublist($sublist) {
		this.#doShowSublist($sublist, false)
	}

	#doShowSublist($sublist, flag) {
		const $arrow = this.#getPrevArrow($sublist)

		if (flag) {
			$sublist.classList.remove('_none')
			$arrow.classList.add('_show-sublist')
		} else {
			$sublist.classList.add('_none')
			$arrow.classList.remove('_show-sublist')
		}

		this.#setHeight()
	}

	#setHeight() {
		this.lines.forEach(($line) => {
			const $currentSublist = this.#getNextSublist($line)

			if ($currentSublist) $line.style.height = `${$currentSublist.clientHeight}px`
		})
	}

	#switchOptionSelection(e) {
		const $inputCheckbox = e.target
		const idCurrentOption = $inputCheckbox.closest('.option').id
		const indexCurrentOption = this.options.reduce((acc, item, index) => (item.id === idCurrentOption ? (acc = index) : acc), null)

		if ($inputCheckbox.checked) {
			this.chooseOption(indexCurrentOption + 1)
		} else {
			this.cancelOption(indexCurrentOption + 1)
		}

		e.preventDefault()
	}

	#doOptionsSelection(num, flag) {
		const $currentOption = this.options[num - 1]
		const { $checkbox, $input } = this.#getOptionComponent($currentOption)

		if (flag) {
			$currentOption.classList.add('_selected')
			$checkbox.classList.add('_checked')
			$input.checked = true
		} else {
			$currentOption.classList.remove('_selected')
			$checkbox.classList.remove('_checked')
			$input.checked = false
		}
	}

	#clearValue(e) {
		e.currentTarget.value = ''
	}

	#shearchOption(e) {
		this.showAllSublists()

		const { target } = e
		const { value } = target
		const { length } = value
		const inputExpression = new RegExp(value, 'i')

		this.options.forEach(($option) => {
			const $optionText = $option.querySelector('.option__text')
			const { textContent } = $optionText
			const text = textContent.trim()
			const position = text.search(inputExpression)

			if (position !== -1) {
				const start = text.slice(0, position)
				const center = text.slice(position, position + length)
				const end = text.slice(position + length)

				$optionText.innerHTML = start + `<span class="_highlight">${center}</span>` + end

				$option.classList.remove('_none')
			} else {
				$optionText.innerHTML = text
				$option.classList.add('_none')
			}
		})

		this.#setHeight()
	}

	showSelect() {
		this.$select.classList.remove('_none')

		setTimeout(() => this.$select.classList.remove('_hide'), 0)
	}

	hideSelect() {
		this.$select.classList.add('_hide')

		setTimeout(() => this.$select.classList.add('_none'), 200)
	}

	destroySelect() {
		this.#removeSelectHandlers()
		this.hideSelect()

		setTimeout(() => this.$select.remove(), 200)
	}

	showAllSublists() {
		this.sublists.forEach((sublist) => this.#showSublist(sublist))
	}

	hideAllSublists() {
		this.sublists.forEach((sublist) => this.#hideSublist(sublist))
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

		if (this.#isThereAreSelected) {
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

		this.$countOptionsSelected.textContent = this.selectedOptions.length

		this.hideOptions()

		console.log(this.selectedOptions)
		return this.selectedOptions
	}

	clearSelectedOptions() {
		this.#setMainOption()

		this.selectedOptions.forEach(($option) => {
			$option.querySelector('.checkbox__input').click()
		})

		this.#setMainOption()
		this.#saveAcceptedOptions()
	}

	chooseOption(num) {
		this.#doOptionsSelection(num, true)
	}

	cancelOption(num) {
		this.#doOptionsSelection(num, false)
	}
}