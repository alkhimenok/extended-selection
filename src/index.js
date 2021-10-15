import { Select } from './classes/Select.js';
import { Element } from './classes/Element.js';


const markup = `
  <div class="select">
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
            <input class="select__input" type="text" disabled value="Код ОКРБ или наименование закупаемой продукции">
          </section>
        </section>
        <div class="select__content">
          <section class="select__main">
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

const body = new Element('body')
body.getElement()

const wrapper = new Element('div')
wrapper.createElement('', 'wrapper')
wrapper.renderElement(body.element, 'afterbegin')

const selects = new Element('select')
selects.getElements()
selects.element
  .reverse()
  .forEach((element, index) => {
    wrapper.renderToElement(markup, 'afterbegin')

    const parentSelect = new Element('.select__main')
    parentSelect.getElement()

    const select = new Element(element)
    select.getElement()

    new Select({ select, parentSelect, index })
  })
