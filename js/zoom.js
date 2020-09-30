window.onload = () => {
  initialize();
  setButtons();
}

function initialize() {
  showElement("mainContainer");
  completed.fill(false);
  selectedTeacher = 0;
  score = 0;
}

let completed = new Array(4).fill(false);
let selectedTeacher;
let score = 0;
let scores = new Array(4).fill(0);
let gameLoopId;

const gameDur = 100; // sec
const targetScore = 2000;
const studentNum = 22;
const States = {
  STUDY: 1,
  PLAY: 2,
  NO: 3,
  PENDING: 0,
  NONE: -1
};
const studentNames = [ "",
"2518양혜민", "2515박예찬", "2520여준호", "2533정정훈", "2535허가은", "2502김경범", 
"2526위승빈", "2531전다예", "2501권경훈", "2506김서은", "2512노의찬", "2527유승환",
"2532정원영", "2530임성주", "2529이태규", "2534하욱진", "2528이재석", "2517안나영",
"2524오준서", "2522오승주", "2523오영준", "2507김은석",
];

let studentState = array2d(4, 5, States.NONE);
let studentIds = array2d(4, 5, 0); // seat number to random number
let studentLoc = new Array(studentNum+1).fill([0, 0]); // random number to seat number

function gameInit() {
  for(let i=1 ; i<=3 ; i++) 
    for(let j=1 ; j<=4 ; j++) 
      if(gEBI(studentIds[i][j]))
        gEBI(studentIds[i][j]).id = `${i}-${j}`;
  
  studentState = array2d(4, 5, States.NONE);
  studentIds = array2d(4, 5, 0); 
  studentLoc = new Array(studentNum+1).fill([0, 0]);
  if(gameLoopId) clearInterval(gameLoopId);

  hideAlert();
  setNames();
  setPages();
  setTimer();

  completed[selectedTeacher] = true;
  gEBI("teacherImg").src = `./img/t${selectedTeacher+1}.png`;
}

function showGameOver() {
  clearInterval(gameLoopId);
  showAlert();

  let flag = true;
  for(let i=0 ; i<4 ; i++) if(!completed[i]) flag = false;
  if(flag) showEndMeeting();

  gEBI("seconds").innerHTML = "5";
  let leftTime = 4;
  let alertInterval = setInterval(() => {
    gEBI("seconds").innerHTML = leftTime;
    if(leftTime == 0) {
      gEBI("zoomStart").style.display = "block";
      updateList();
      showElement("listContainer");
      hideAlert();
      clearInterval(alertInterval);
    }
    leftTime--;
  }, 1000);
}

function setTimer() {
  let time = 0;
  let sec, msec;
  let timerId = setInterval(() => {
    time += 1;
    let vTime = gameDur * 100 - time;
    sec = Math.floor(vTime/100);
    msec = vTime%100;
    gEBI("timer").innerHTML = `${sec}.${msec}`;
    if(time >= gameDur * 100) {
      clearInterval(timerId);
      showGameOver();
    }
  }, 10);
}

var pageNum;
var deltaScore = 0;
function updateScore(orgScore, dScore) {
  score = orgScore + dScore;
  if(dScore != 0) deltaScore = (dScore > 0) ? `+${dScore}` : `${dScore}`;
  gEBI("scoreNum").innerHTML = score;
  gEBI("scoreDelta").innerHTML = deltaScore;
  scores[selectedTeacher] = score;
  setTimeout(() => { gEBI("scoreDelta").innerHTML = ""; }, 500);
}

function setPages() {
  pageNum = 1;
  showPage1();
  gEBI("leftCaret").addEventListener("click", (evt) => {
    if(pageNum == 2) {
      pageNum = 1;
      gEBI("pageNum").innerHTML = pageNum;
      showPage1();
    }
  });
  
  gEBI("rightCaret").addEventListener("click", (evt) => {
    if(pageNum == 1) {
      pageNum = 2;
      gEBI("pageNum").innerHTML = pageNum;
      showPage2();
    }
  });
}

function setNames() {
  let i, j;

  let visit = new Array(20).fill(false);
  for(i=1 ; i<=3 ; i++) {
    for(j=1 ; j<=4 ; j++) {

      let rn = Math.round(Math.random()*100)%studentNum + 1;
      while(visit[rn]) rn = Math.round(Math.random()*100)%studentNum + 1;
      visit[rn] = true;

      studentIds[i][j] = rn; 
      studentLoc[rn] = [i, j];
      gEBI(`${i}-${j}`).id = rn;

      let block = gEBI(rn);
      block.children[0].innerHTML = studentNames[rn];

      block.addEventListener('click', (evt) => {
        let target = (evt.target.tagName == "DIV") ? evt.target : evt.target.parentElement;
        let id = target.id;
        
        if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.STUDY) {
          updateScore(score, -50);
          target.classList.add("wrong");
        } else if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.PLAY) {
          updateScore(score, 100);
          target.classList.add("correct");
        } else if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.NO) {
          let randNum = Math.random() * 100;
          if(randNum <= 45) {
            updateScore(score, -50);
            showStudent(States.STUDY, id);
            target.classList.add("wrong");
          } else {
            updateScore(score, 100);
            showStudent(States.PLAY, id);
            target.classList.add("correct");
          }
        }

        studentState[studentLoc[id][0]][studentLoc[id][1]] = States.PENDING;
        setTimeout(() => { 
          studentState[studentLoc[id][0]][studentLoc[id][1]] = States.NONE;
          target.classList.remove("wrong");
          target.classList.remove("correct");
        }, 5000);
      });
    }
  }
  
  gameLoopId = setInterval(() => {
    for(let i=1 ; i<=3 ; i++) {
      for(let j=1 ; j<=4 ; j++) {
        if(studentState[i][j] != States.PENDING) {
          let id = studentIds[i][j];
          random(_ => studentState[i][j] = States.STUDY, 50);
          random(_ => studentState[i][j] = States.PLAY, 30);
          random(_ => studentState[i][j] = States.NO, 20);
          showStudent(studentState[i][j], id);
        }
      }
    }
  }, 2000);
}

function showStudent(sState, id) {
  if(gEBI("zoomGame").style.display == "block") {
    let block = gEBI(id);
    if(sState == States.STUDY) block.innerHTML = `<img src="./img/students/${id}-1.png" class="blockImg"/>`;
    else if(sState == States.PLAY) block.innerHTML = `<img src="./img/students/${id}-2.png" class="blockImg"/>`;
    else if(sState == States.NO) block.innerHTML = `<p class="name">${studentNames[id]}</p>`;     
  }
}

function updateList() {
  let listBts = [...document.getElementsByClassName("listBt")];
  listBts.forEach((listBt, idx) => {
    if(completed[idx]) {
      listBt.src = "./img/button/listDone.png";
      let oldListBt = listBt;
      let newListBt = oldListBt.cloneNode(true);
      oldListBt.parentElement.replaceChild(newListBt, oldListBt);
    } else {
      listBt.addEventListener("mouseover", _ => listBt.src = "./img/button/listBt1.png");
      listBt.addEventListener("mouseleave", _ => listBt.src = "./img/button/listBt.png");    
      listBt.addEventListener("click", _ => {
        selectedTeacher = idx;
        showGame();
      });
    }
  });
}

function setButtons() {
  let buttons = [...document.getElementsByClassName("bt")];

  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.src = `./img/button/${button.id}1.png`;
    });
    button.addEventListener("mouseleave", () => {
      button.src = `./img/button/${button.id}.png`;
    });
  });

  gEBI("WayToMain").addEventListener("click", _ => showElement("mainContainer"));
  gEBI("MeetToMain").addEventListener("click", _ => showElement("mainContainer"));
  gEBI("ListToMeet").addEventListener("click", _ => showElement("meetContainer"));
  gEBI("mainBt1").addEventListener("click", _ => showElement("wayContainer"));
  gEBI("mainBt2").addEventListener("click", _ => showElement("meetContainer"));
  gEBI("meetBt").addEventListener("click",  _ => showElement("listContainer"));

  gEBI("endMeeting").addEventListener("click", showEnding);
  gEBI("redo").addEventListener("click", initialize);
  updateList();
}

function showPage1() {
  gEBI("page1").style.display = "block";
  gEBI("page2").style.display = "none";  
}

function showPage2() {
  gEBI("page2").style.display = "grid";
  gEBI("page1").style.display = "none";  
}

function hideAll() {
  gEBI("zoomGame").style.display = "none";
  gEBI("mainContainer").style.display = "none";
  gEBI("wayContainer").style.display = "none";
  gEBI("meetContainer").style.display = "none";
  gEBI("listContainer").style.display = "none";
  gEBI("endingContainer").style.display = "none";
}

function showElement(id, display="flex") {
  hideAll();
  gEBI(id).style.display = display;
}

function showList() {
  hideAll();
  gEBI("listContainer").style.display = "flex";
}

function showEnding() {
  hideAll();
  gEBI("endingContainer").style.display = "flex";

  if(score >= targetScore) gEBI("endingImg").src = "./img/goodEnding.png";
  else gEBI("endingImg").src = "./img/badEnding.png";
}

function showGame() {
  gameInit();
  gEBI("zoomStart").style.display = "none";
  gEBI("zoomGame").style.display = "block";
}

function hideAlert() {
  gEBI("alert").style.backdropFilter = "none";
  gEBI("alert").style.display = "none";
}

function showAlert() {
  gEBI("alert").style.backdropFilter = "blur(5px)";
  gEBI("alert").style.display = "block";
}

function showEndMeeting() {
  gEBI("endMeeting").style.display = "block";
}

function random(callback, prob) {
  let rn = Math.random() * 100;
  if(rn < prob) callback();
}

function array2d(n, m, val=0) {
  return new Array(n).fill(val).map(() => new Array(m).fill(val));
}

function shortCut() {
  completed.fill(true);
  score = 2000;
  updateList();
  showGameOver();
}

function gEBI(id) {
  return document.getElementById(id);
}