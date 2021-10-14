import { Select } from './classes/Select.js';
import { Element } from './classes/Element.js';


const markup = `
  <div class="wrapper">
    <div class="select">
      <div class="select__container">
        <div class="select__body">
          <section class="select__header">
            <section class="select__heading">
              <h2 class="select__title">
                Тендеры в роли Поставщика
              </h2>
              <a class="select__btn_show-selected" href="#">
                Показать выбранное (10)
              </a>
            </section>
            <section class="select__selected-options">
              <input class="select__input" type="text" disabled value="Код ОКРБ или наименование закупаемой продукции">
            </section>
          </section>
          <section class="select__main">
          </section>
          <section class="select__footer">
            <button class="select__btn_to-apply">
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
const body = new Element('body').renderToElement(markup)
const selects = new Element('select').getElements()
const parent = new Element('.select__main').getElement()

selects.forEach((select, i) => new Select({ select, parent, i }))