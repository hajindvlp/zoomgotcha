window.onload = () => {
  initialize();
}

let pages = new Pages();
let buttons = [];
const studentGame = new StudentGame("zoomGame");

function initialize() {
  setPages();
  setButtons();

  pages.show("mainContainer");
}

function setPages() {
  let pageElements = gEBC("page");

  pageElements.forEach(pageElement => {
    pages.add(new Page(pageElement.id, pageElement.style.display));
  });

  pages.hideAll();
}

function setButtons() {
  let buttonElements = gEBC("bt");

  buttonElements.forEach(buttonElement => {
    let id = buttonElement.id;
    let goto = buttonElement.dataset.goto;
    let isGoto = goto ? true : false;

    buttons.push(new Button(id, isGoto, goto));
  });

  let listButtons = gEBC("listBt");

  listButtons.forEach((listButton, idx) => {
    if(studentGame.completed[idx]) {
      listButton.src = "./img/button/listDone.png";
      removeAllEL(listButton);
    } else {
      let button = new Button("listBt", false, undefined, listButton);
  
      button.addEL("click", _ => {
        pages.show("waitContainer");
        gEBI("teacherName").innerText = `${teacherNames[idx]}님의`;
        setTimeout(_ => studentGame.start(idx), 3000);      
      });
    }
  });
}