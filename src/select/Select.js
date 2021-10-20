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

export class Select {
	constructor(parentSelector, selectData, optionData) {
		this.$parentSelect = document.querySelector(parentSelector)

		this.$initialSelect = selectData.initialSelect
		this.nameSelect = selectData.name
		this.indexSelec = selectData.index
		this.idSelect = this.nameSelect + this.indexSelec

		this.optionData = optionData

		this.#destroyInitialSelect()
		this.#remakeSelect()
	}

	#destroyInitialSelect() {
		this.$initialSelect.remove()
	}

	#remakeSelect() {
		const murkupCastomSelect = getMurkupCastomSelect(this.idSelect, this.nameSelect)

		this.$parentSelect.insertAdjacentHTML('afterbegin', murkupCastomSelect)

		this.#setSelectComponents()
		this.#fillSelect()
	}

	#setSelectComponents() {
		this.select = this.$parentSelect.querySelector(`#${this.idSelect}`)
		this.titleSelect = this.select.querySelector('.select__title')
		this.btnShowSelected = this.select.querySelector('.select__btn_show-selected')
		this.countOptionsSelected = this.select.querySelector('.select__count-selected')
		this.inputSelect = this.select.querySelector('.select__input')
		this.formSelect = this.select.querySelector('form')
	}

	#fillSelect() {
		const parents = { 1: this.formSelect }
    let prevLevel = 1

		this.optionData.forEach((itemData) => {
			const { content, selected, level, value } = itemData

			while (prevLevel > level && prevLevel > 0) {
				delete parents[prevLevel]
				--prevLevel
			}

			if (!parents[level]) {
				const currentSublist = this.#createSublist(parents[prevLevel])

				parents[level] = currentSublist
				prevLevel = level
			}

			console.log(prevLevel)
		})
	}

	#createSublist(parent) {
		const sublist = document.createElement('div')
    sublist.classList.add('select__options-sublist')
    parent.insertAdjacentElement('beforeend', sublist)

		return sublist
	}
	// logName() {
	//   return [this.parentSelector, this.selectData, this.optionsData]
	// }
}
