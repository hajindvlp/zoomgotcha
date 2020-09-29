window.onload = () => {
  initialize();
  setButtons();
}

function initialize() {
  showStart();
  selectedTeacher = 0;
  showGame();
}

let completed = [false, false, false, false];
let selectedTeacher;
let classes = [
  [
    ["2530 임성주", "2535 허가은", "2526 위승빈", "2520 여준호"],
    ["2508 김준형", "2533 정정훈", "2518 양혜민", "2515 박예찬"],
    ["2509 김찬영", "2506 김서은", "2502 김경범", "2501 권경훈"]
  ],
  [
    ["2530 임성주", "2535 허가은", "2526 위승빈", "2520 여준호"],
    ["2508 김준형", "2533 정정훈", "2518 양혜민", "2515 박예찬"],
    ["2509 김찬영", "2506 김서은", "2502 김경범", "2501 권경훈"]
  ],
  [
    ["2530 임성주", "2535 허가은", "2526 위승빈", "2520 여준호"],
    ["2508 김준형", "2533 정정훈", "2518 양혜민", "2515 박예찬"],
    ["2509 김찬영", "2506 김서은", "2502 김경범", "2501 권경훈"]
  ],
  [
    ["2530 임성주", "2535 허가은", "2526 위승빈", "2520 여준호"],
    ["2508 김준형", "2533 정정훈", "2518 양혜민", "2515 박예찬"],
    ["2509 김찬영", "2506 김서은", "2502 김경범", "2501 권경훈"]
  ]
];
var score;
var scores = [0, 0, 0, 0];
const gameDur = 100; // min

function gameInit() {
  hideAlert();
  setNames();
  setPages();

  completed[selectedTeacher] = true;
  // score = 0;
  document.getElementById("teacherImg").src = `./img/t${selectedTeacher+1}.png`;
  let time = 0;
  let sec, msec;
  let timerId = setInterval(() => {
    time += 1;
    sec = Math.floor(time/100);
    msec = time%100;
    document.getElementById("timer").innerHTML = `${sec}.${msec}`;
    if(time >= gameDur * 100) {
      clearInterval(timerId);
      showGameOver();
    }
  }, 10);
}

function showGameOver() {
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

var pageNum;
var deltaScore;
var studentState = array2d(4, 5).fill(false);
const States = {
  STUDY: 1,
  PLAY: 2,
  NO: 3,
  PENDING: 0
};

let students = array2d(4, 5);

function setNames() {
  let i, j;
  let names = classes[selectedTeacher];
  score = 0;
  updateScore(score, 0);

  let visit = new Array(20);
  for(i=1 ; i<=3 ; i++) {
    for(j=1 ; j<=4 ; j++) {
      let rn;
      while(visit[rn]) rn = Math.round(Math.random()*100)%20 + 1;
      visit[rn] = true;
      students[i][j] = rn; 
      let block = document.getElementById(`${i}-${j}`).id = rn;
    }
  }

  for(i=1 ; i<=3 ; i++) {
    for(j=1 ; j<=4 ; j++) {
      let id = students[i][j];
      let block = document.getElementById(id);
      block.children[0].innerHTML = names[i-1][j-1];

      // setInterval(() => {
      //   if(studentState[i][j] != States.PENDING) {
      //     random(() => { // Study
      //       studentState[i][j] = States.STUDY;
            
      //     }, 50);
      //     random(() => { // Play
      //       studentState[i][j] = States.PLAY;
      //     }, 30);
      //     random(() => { // No cam
      //       studentStates[i][j] = States.NO;
      //     }, 20);
      //   }
      // }, 1000);

      block.addEventListener('click', (evt) => {
        if(evt.target.tagName != "IMG") {
          let target = (evt.target.tagName == "DIV") ? evt.target : evt.target.parentElement;
          let id = `${target.id}`;
          let orgInnerHTML = target.innerHTML;
          let randNum = Math.random() * 100;
          if(randNum <= 45) {
            id = `${id}-1`;
            updateScore(score, -50);
          } else {
            id = `${id}-2`;
            updateScore(score, 100);
          } 
          target.innerHTML = `<img src="./img/students/${id}.png" class="blockImg"/>`;
          setTimeout(() => { target.innerHTML = orgInnerHTML }, 5000);
        }
      });
    }
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

function array2d(n, m) {
  return new Array(n).fill(0).map(() => new Array(m).fill(0));
}