export default class SortableTable {

  /*
    {
      "id": "shkolniy-ryukzak-(ranets)-scooli-star-wars-sw13824",
      "title": "Школьный рюкзак (ранец) Scooli Star Wars SW13824",
      "description": "Вес: 280; мягкие лямки; ортопедическая спинка; жесткий каркас; пенал; Замок: молния; Пол: для мальчиков; Возрастная группа: школьный; Тип: ранец",
      "quantity": 89,
      "subcategory": {
        "id": "shkolnye-tovary",
        "title": "Школьные товары",
        "count": 16,
        "category": {
          "id": "detskie-tovary-i-igrushki",
          "title": "Детские товары и игрушки",
          "count": 83,
          "weight": 1
        },
        "weight": 6
      },
      "status": 1,
      "images": [
        {
          "url": "http://magazilla.ru/jpg_zoom1/905979.jpg",
          "source": "905979.jpg"
        }
      ],
      "price": 16,
      "discount": 0,
      "sales": 9
    }
  */

  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.configCells = headerConfig.map(({id, template}) => {
      return {id, template};
    });

    this.render();
  }

  render() {
    const elDiv = document.createElement('div');
    elDiv.innerHTML = this.getTable();

    const elTable = elDiv.firstElementChild;
    this.element = elTable;

    this.subElements = this.getSubElements(elTable);
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
      </div>
    `;
  }

  /*
    <div data-element="header" class="sortable-table__header sortable-table__row">
      <div class="sortable-table__cell" data-id="images" data-sortable="false" data-order="asc">
        <span>Image</span>
      </div>
      <div class="sortable-table__cell" data-id="title" data-sortable="true" data-order="asc">
        <span>Name</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    </div>
  */

  getTableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
      </div>
    `;
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  /*
    <div data-element="body" class="sortable-table__body">
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/246743.jpg">
        </div>
        <div class="sortable-table__cell">3D очки Epson ELPGS03</div>

        <div class="sortable-table__cell">16</div>
        <div class="sortable-table__cell">91</div>
        <div class="sortable-table__cell">6</div>
      </a>
    </div>
  */

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>
    `;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>
      `;
    }).join('');
  }

  getTableRow(item) {
    return this.configCells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {column.dataset.order = '';});
    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const column = this.headerConfig.find(item => item.id === field);
    const {sortType} = column;

    const direction = order === 'asc' ? 1 : -1;

    return [...this.data].sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      default:
        throw new Error('Unknown type of sorting');
      }
    });
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove () {
    if (this.element) {
      this.element.remove(); // из документа удалит
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

