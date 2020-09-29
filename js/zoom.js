window.onload = () => {
  initialize();
  setButtons();
}

function initialize() {
  showStart();
}

let completed = [false, false, false, false];
let selectedTeacher;
var score = 0;
var scores = [0, 0, 0, 0];
const gameDur = 30; // sec

function gameInit() {
  hideAlert();
  setNames();
  setPages();

  completed[selectedTeacher] = true;
  document.getElementById("teacherImg").src = `./img/t${selectedTeacher+1}.png`;
  let time = 0;
  let sec, msec;
  let timerId = setInterval(() => {
    time += 1;
    let vTime = gameDur * 100 - time;
    sec = Math.floor(vTime/100);
    msec = vTime%100;
    document.getElementById("timer").innerHTML = `${sec}.${msec}`;
    if(time >= gameDur * 100) {
      clearInterval(timerId);
      showGameOver();
    }
  }, 10);
}

function showGameOver() {
  for(let i=1 ; i<=3 ; i++) {
    for(let j=1 ; j<=4 ; j++) {
      document.getElementById(studentIds[i][j]).id = `${i}-${j}`;
    }
  }

  showAlert();
  document.getElementById("seconds").innerHTML = "5";
  let leftTime = 4;
  let alertInterval = setInterval(() => {
    document.getElementById("seconds").innerHTML = leftTime;
    if(leftTime == 0) {
      document.getElementById("zoomStart").style.display = "block";
      updateList();
      showList();
      hideAlert();
      clearInterval(alertInterval);
    }
    leftTime--;
  }, 1000);
}

var pageNum;
var deltaScore = 0;
function updateScore(orgScore, dScore) {
  score = orgScore + dScore;
  if(dScore != 0) deltaScore = (dScore > 0) ? `+${dScore}` : `${dScore}`;
  document.getElementById("scoreNum").innerHTML = score;
  document.getElementById("scoreDelta").innerHTML = deltaScore;
  scores[selectedTeacher] = score;
  setTimeout(() => { document.getElementById("scoreDelta").innerHTML = ""; }, 500);
}

function setPages() {
  pageNum = 1;
  showPage1();
  document.getElementById("leftCaret").addEventListener("click", (evt) => {
    if(pageNum == 2) {
      pageNum = 1;
      document.getElementById("pageNum").innerHTML = pageNum;
      showPage1();
    }
  });
  
  document.getElementById("rightCaret").addEventListener("click", (evt) => {
    if(pageNum == 1) {
      pageNum = 2;
      document.getElementById("pageNum").innerHTML = pageNum;
      showPage2();
    }
  });
}
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
const studentNum = 22;
var studentState = array2d(4, 5, States.NONE);
let studentIds = array2d(4, 5, 0); // seat number to random number
let studentLoc = new Array(studentNum+1).fill([0, 0]); // random number to seat number

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
      document.getElementById(`${i}-${j}`).id = rn;

      let block = document.getElementById(rn);
      block.children[0].innerHTML = studentNames[rn];

      block.addEventListener('click', (evt) => {
        let target = (evt.target.tagName == "DIV") ? evt.target : evt.target.parentElement;
        let id = target.id;
        
        if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.STUDY) updateScore(score, -50);
        else if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.PLAY) updateScore(score, 100);
        else if(studentState[studentLoc[id][0]][studentLoc[id][1]] == States.NO) {
          let randNum = Math.random() * 100;
          if(randNum <= 45) updateScore(score, -50), showStudent(States.STUDY, id);
          else updateScore(score, 100), showStudent(States.PLAY, id);
        }

        studentState[studentLoc[id][0]][studentLoc[id][1]] = States.PENDING;
        setTimeout(() => { studentState[studentLoc[id][0]][studentLoc[id][1]] = States.NONE }, 5000);
      });
    }
  }
  
  setInterval(() => {
    for(let i=1 ; i<=3 ; i++) {
      for(let j=1 ; j<=4 ; j++) {
        if(studentState[i][j] != States.PENDING) {
          let id = studentIds[i][j];
          let block = document.getElementById(id);
          random(_ => studentState[i][j] = States.STUDY, 50);
          random(_ => studentState[i][j] = States.PLAY, 30);
          random(_ => studentState[i][j] = States.NO, 20);
          showStudent(studentState[i][j], id);
        }
      }
    }
  }, 1000);
}

function showStudent(sState, id) {
  let block = document.getElementById(id);
  if(sState == States.STUDY) block.innerHTML = `<img src="./img/students/${id}-1.png" class="blockImg"/>`;
  else if(sState == States.PLAY) block.innerHTML = `<img src="./img/students/${id}-2.png" class="blockImg"/>`;
  else if(sState == States.NO) block.innerHTML = `<p class="name">${studentNames[id]}</p>`;
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
      listBt.addEventListener("mouseover", (evt) => {
        listBt.src = "./img/button/listBt1.png";
      });
      listBt.addEventListener("mouseleave", (evt) => {
        listBt.src = "./img/button/listBt.png";
      });    
      listBt.addEventListener("click", (evt) => {
        selectedTeacher = idx;
        showGame();
      });
    }
  });
}

function setButtons() {
  let buttons = [...document.getElementsByClassName("bt")];
  let mainBt1 = document.getElementById("mainBt1");
  let mainBt2 = document.getElementById("mainBt2");
  let WayToMainBt = document.getElementById("WayToMain");
  let MeetToMainBt = document.getElementById("MeetToMain");
  let ListToMeet = document.getElementById("ListToMeet");
  let meetBt = document.getElementById("meetBt");

  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.src = `./img/button/${button.id}1.png`;
    });
    button.addEventListener("mouseleave", () => {
      button.src = `./img/button/${button.id}.png`;
    });
  });

  WayToMainBt.addEventListener("click", showStart);
  MeetToMainBt.addEventListener("click", showStart);
  ListToMeet.addEventListener("click", showMeet);

  mainBt1.addEventListener("click", showGameWay);
  mainBt2.addEventListener("click", showMeet);
  meetBt.addEventListener("click",  showList);
  updateList();
}

function showPage1() {
  document.getElementById("page1").style.display = "block";
  document.getElementById("page2").style.display = "none";  
}

function showPage2() {
  document.getElementById("page2").style.display = "grid";
  document.getElementById("page1").style.display = "none";  
}

function hideAll() {
  document.getElementById("zoomGame").style.display = "none";
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("wayContainer").style.display = "none";
  document.getElementById("meetContainer").style.display = "none";
  document.getElementById("listContainer").style.display = "none";
}

function showStart() {
  hideAll();
  document.getElementById("mainContainer").style.display = "flex";
}

function showMeet() {  
  hideAll();
  document.getElementById("meetContainer").style.display = "flex";
}

function showGameWay() {
  hideAll();
  document.getElementById("wayContainer").style.display = "flex";
}

function showList() {
  hideAll();
  document.getElementById("listContainer").style.display = "flex";
}

function showGame() {
  gameInit();
  document.getElementById("zoomStart").style.display = "none";
  document.getElementById("zoomGame").style.display = "block";
}

function hideAlert() {
  document.getElementById("alert").style.backdropFilter = "none";
  document.getElementById("alert").style.display = "none";
}

function showAlert() {
  document.getElementById("alert").style.backdropFilter = "blur(5px)";
  document.getElementById("alert").style.display = "block";
}

function random(callback, prob) {
  let rn = Math.random() * 100;
  if(rn < prob) callback();
}

function array2d(n, m, val=0) {
  return new Array(n).fill(val).map(() => new Array(m).fill(val));
}