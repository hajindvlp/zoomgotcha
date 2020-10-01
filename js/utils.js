function gEBI(id) {
  return document.getElementById(id);
}

function gEBC(className) {
  return [...document.getElementsByClassName(className)];
}

function hide(element) {
  element.style.display = "none";
}

function show(element, display="block") {
  element.style.display = display;
}

function Array2d(n, m, val=0) {
  return new Array(n).fill(val).map(() => new Array(m).fill(val));
}

function removeAllEL(element) {
  let oldElement = element;
  let newElement = oldListBt.cloneNode(true);
  oldElement.parentElement.replaceChild(newElement, oldElement);
}

function random(start, end) {
  return Math.round(Math.random() * Math.pow(10, Math.ceil(Math.log10(end - start + 1)))) % (end - start + 1) + start;
}