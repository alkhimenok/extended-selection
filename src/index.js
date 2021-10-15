import { Select } from './classes/Select.js';
import { Element } from './classes/Element.js';


const body = new Element('body')
const $body = body.getElement()
const wrapper = new Element('div')
wrapper.createElement('', 'wrapper')
wrapper.renderElement($body, 'afterbegin')

const selects = new Element('select')
const $selects = selects.getElements()
$selects
  .reverse()
  .forEach((element, index) => {
    const redoneSelect = new Element(element)
    redoneSelect.getElement()

    new Select({ redoneSelect, parentSelect: wrapper, index })
  })
