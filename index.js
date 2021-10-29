import { Select } from './src/select/Select.js'

/* ----- for convenience */
const wrapper = document.createElement('div')
wrapper.classList.add('wrapper')
document.body.insertAdjacentElement('afterbegin', wrapper)
/* for convenience ----- */

/* ----- selection setting */
const selectList = document.querySelectorAll('select') // searches all selections in a document

const getDataFromOption = (option) => {
	const { value, selected, dataset, textContent } = option

	return {
		content: textContent.trim(),
		selected,
		level: dataset.level ?? '1',
		value,
	}
}

selectList.forEach((initialSelect, index) => {
	const { name, options } = initialSelect
	const optionsData = Array.from(options).map((option) => getDataFromOption(option))
	const redoneSelect = new Select('.wrapper', { initialSelect, name, index }, optionsData)

	window[redoneSelect.idSelect] = redoneSelect // to be able to control the selection from the console
})
/* selection setting ----- */

// window['select1'].$select.addEventListener('change', () => {
// 	console.log('Hello')
// })
