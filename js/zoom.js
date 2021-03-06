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

function gameInit() {
  for(let i=1 ; i<=3 ; i++) 
    for(let j=1 ; j<=4 ; j++) 
      if(gEBI(studentIds[i][j])) {
        gEBI(studentIds[i][j]).id = `${i}-${j}`;     
      }
  pageNum = 1;
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
        } 

        studentState[studentLoc[id][0]][studentLoc[id][1]] = States.PENDING;
        setTimeout(() => { 
          studentState[studentLoc[id][0]][studentLoc[id][1]] = States.NO;
          showStudent(States.NO, id);
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
          let rn = Math.random() * 100;
          if(rn < 50) studentState[i][j] = States.STUDY;
          else if(rn < 80) studentState[i][j] = States.PLAY;
          else studentState[i][j] = States.NO;
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
        gEBI("teacherName").innerHTML = `${teacherNames[selectedTeacher]}님의`;
        showElement("waitContainer");
        setTimeout(_ => showGame(), 3000);
      });
    }
  });
}

function setButtons() {
  let buttons = [...document.getElementsByClassName("bt")];

  buttons.forEach((button) => {
    button.addEventListener("mouseover", _ => button.src = `./img/button/${button.id}1.png`);
    button.addEventListener("mouseleave", _ => button.src = `./img/button/${button.id}.png`);
  });

  gEBI("WayToMain").addEventListener("click", _ => showElement("mainContainer"));
  gEBI("MeetToMain").addEventListener("click", _ => showElement("mainContainer"));
  gEBI("ListToMeet").addEventListener("click", _ => showElement("meetContainer"));
  gEBI("mainBt1").addEventListener("click", _ => showElement("wayContainer"));
  gEBI("mainBt2").addEventListener("click", _ => showElement("meetContainer"));
  gEBI("meetBt").addEventListener("click",  _ => showElement("listContainer"));

  gEBI("endMeeting").addEventListener("click", showEnding);
  gEBI("redo").addEventListener("click", _ => window.location.reload());
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
  let ids = ["zoomGame", "mainContainer", "wayContainer", "meetContainer", "listContainer", "endingContainer", "waitContainer"];
  ids.forEach((id) => {
    if(gEBI(id).style.display != "none") {
      gEBI(id).classList.remove("disappear", "appear");
      void gEBI(id).offsetWidth;
      gEBI(id).classList.add("disappear");
    } 
    gEBI(id).style.display = "none";
  });
}

function showElement(id, display="flex") {
  hideAll();
  gEBI(id).classList.remove("disappear", "appear");
  void gEBI(id).offsetWidth;
  gEBI(id).classList.add("appear");
  gEBI(id).style.display = display;
}

function showEnding() {
  const goodEndingDur = 5230;
  const badEndingDur = 22250;
  hideAll();
  gEBI("endingContainer").style.display = "flex";

  if(score >= targetScore) {
    gEBI("endingImg").src = "./img/goodEnding.gif";
    setTimeout(_ => {
      gEBI("redo").style.display = "block";
    }, goodEndingDur);
  }
  else {
    gEBI("endingImg").src = "./img/badEnding.gif";
    setTimeout(_ => {
      gEBI("redo").style.display = "block";
    }, badEndingDur);
  } 
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