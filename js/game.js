class Game {
  constructor(id, display="block") {
    this.id = id;
    this.element = gEBI(id);
    this.display = display;
  }

  show() {
    pages.hideAll();
    show(this.element, this.display);
  }

  hide() {
    hide(this.element);
  }
}