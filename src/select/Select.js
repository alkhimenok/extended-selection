export class Select {
  constructor(parentSelector, selectData, optionData) {
    this.parentSelector = parentSelector
    this.selectData = selectData
    this.optionData = optionData

    this.$parentSelector = document.querySelector(this.parentSelector)

    this.$initialSelect = this.selectData.initialSelect
    this.nameSelect = this.selectData.name
    this.indexSelec = this.selectData.index
    this.idSelect = this.nameSelect + this.indexSelec
    
    this.#destroyInitialSelect()
  }

  #destroyInitialSelect() {
    this.$initialSelect.remove()
  }

  // logName() {
  //   return [this.parentSelector, this.selectData, this.optionsData]
  // }
}