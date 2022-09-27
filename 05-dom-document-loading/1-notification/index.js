export default class NotificationMessage {
  static notification;

  element = '';
  time = 0;

  constructor(mess = '', {duration = 2000, type = 'success'} = {}) {
    this.mess = mess;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  show(parent = document.body) {
    if (NotificationMessage.notification) {
      NotificationMessage.notification.remove();
    }

    NotificationMessage.notification = this;

    parent.append(this.element);

    this.time = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    const div = document.createElement('div');

    div.innerHTML = this.template;

    this.element = div.firstElementChild;
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.mess}
          </div>
        </div>
      </div>
    `;
  }

  remove() {
    clearTimeout(this.time);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.notification = null;
  }
}
