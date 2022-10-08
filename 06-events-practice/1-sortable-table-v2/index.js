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

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc',
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  };

  constructor(headerConfig = [], {data = [], sorted = {}} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.configCells = headerConfig.map(({id, template}) => {
      return {id, template};
    });

    this.render();
  }

  render() {
    const elDiv = document.createElement('div');

    const {id, order} = this.sorted;
    const sortedData = this.sortData(id, order);

    elDiv.innerHTML = this.getTable(sortedData);

    this.element = elDiv.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();
  }

  initEventListeners() {


    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
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
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow (id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
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

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
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

  sortData(id, order) {
    const column = this.headerConfig.find(item => item.id === id);
    const {sortType} = column;

    const direction = order === 'asc' ? 1 : -1;

    return [...this.data].sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      default:
        return direction * (a[id] - b[id]);
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
