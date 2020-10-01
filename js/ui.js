class Button {
  constructor(id, isGoto=false, gotoPageId=undefined, element=undefined) {
    this.id = id;
    this.element = element ? element : gEBI(id);

    this.addEL("mouseover", _ => this.element.src = `./img/button/${id}1.png`);
    this.addEL("mouseleave", _ => this.element.src = `./img/button/${id}.png`);
    if(isGoto) this.addEL("click", _ => pages.show(gotoPageId));
  }

  addEL(eventName, callback) {
    this.element.addEventListener(eventName, callback);
  }
}

class Pages {
  constructor() {
    this.pages = [];
  }

  add(page) {
    this.pages.push(page);
  }

  get(id) {
    return this.pages.find(page => page.id == id);
  }

  hideAll() {
    this.pages.forEach(page => page.hide());
  }

  show(id) {
    this.hideAll();
    this.get(id).show();
  }

}

class Page {
  constructor(id, display="flex") {
    this.element = gEBI(id);
    this.id = id;
    this.display = display;
  }

  show() {
    this.element.classList.remove("disappear", "appear");
    void this.element.offsetWidth;
    this.element.classList.add("appear");
    this.element.style.display = this.display;
  }

  hide() {
    if(this.element.style.display != "none") {
      this.element.classList.remove("disappear", "appear");
      void this.element.offsetWidth;
      this.element.classList.add("disappear");
    }
    this.element.style.display = "none";
  }
}

