const gameDur = 30; // sec
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
const teacherNames = [
  "장재원", "조혜연", "이재민", "김태철"
];

class StudentGame extends Game {
  constructor(id) {
    super(id, "block");

    this.completed = new Array(4).fill(false);
    this.score = 0;
    this.intervalId = 0;
  }

  initialize() {
    this.pageNum = 1;
    this.states = Array2d(4, 5, States.NO);
    this.ids = Array2d(4, 5);
    this.loc = new Array(studentNum+1).fill([0, 0]);
    if(this.intervalId) clearInterval(intervalId);

    gEBI("alert").style.backdropFilter = "none";
    gEBI("alert").style.display = "none";

    let visit = new Array(studentNum+1).fill(false);
    for(let i=1 ; i<=3 ; i++) {
      for(let j=1 ; j<=4 ; j++) {
        let rn = random(1, studentNum);
        while(visit[rn]) rn = random(1, studentNum);
        visit[rn] = true;

        this.ids[i][j] = rn;
        this.loc[rn] = [i, j];
        gEBI(`${i}-${j}`).id = rn;

        let block = gEBI(rn);
        block.children[0].innerText = studentNames[rn];
        block.addEventListener("click", evt => {
          let target = (evt.target.tagName == "DIV") ? evt.target : evt.target.parentElement;
          let id = target.id;
        
          if(this.states[this.loc[id][0]][this.loc[id][1]] == States.STUDY) {
            this.updateScore(this.score, -50);
            target.classList.add("wrong");
          } else if(this.states[this.loc[id][0]][this.loc[id][1]] == States.PLAY) {
            this.updateScore(this.score, 100);
            target.classList.add("correct");
          }
  
          this.states[this.loc[id][0]][this.loc[id][1]] = States.PENDING;
          setTimeout(() => { 
            this.states[this.loc[id][0]][this.loc[id][1]] = States.NO;
            this.showStudent(States.NO, id);
            target.classList.remove("wrong");
            target.classList.remove("correct");
          }, 5000);
        });
      }
    }

    this.intervalId = setInterval(_ => {
      for(let i=1 ; i<=3 ; i++) {
        for(let j=1 ; j<=4 ; j++) {
          if(this.states[i][j] != States.PENDING) {
            let id = this.ids[i][j];
            let rn = Math.random() * 100;
            if(rn < 50) this.states[i][j] = States.STUDY;
            else if(rn < 80) this.states[i][j] = States.PLAY;
            else this.states[i][j] = States.NO;
            this.showStudent(this.states[i][j], id);
          }
        }
      }
    }, 2000);
    
    this.showPage1();
    gEBI("leftCaret").addEventListener("click", _ => {
      if(this.pageNum == 2) {
        this.pageNum = 1;
        gEBI("pageNum").innerHTML = this.pageNum;
        this.showPage1();
      }
    });
    
    gEBI("rightCaret").addEventListener("click", _ => {
      if(this.pageNum == 1) {
        this.pageNum = 2;
        gEBI("pageNum").innerHTML = this.pageNum;
        this.showPage2();
      }
    });

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
        this.end();
      }
    }, 10);
  }

  start(idx) {
    this.initialize();
    this.show();
    this.selectedTeacher = idx;
    this.completed[this.selectedTeacher] = true;
    gEBI("teacherImg").src = `./img/t${this.selectedTeacher+1}.png`;
  }

  end() {
    clearInterval(this.intervalId);
    for(let i=1 ; i<=3 ; i++) 
      for(let j=1 ; j<=4 ; j++) 
        if(gEBI(this.ids[i][j])) {
          gEBI(this.ids[i][j]).id = `${i}-${j}`;     
        }

    gEBI("alert").style.backdropFilter = "blur(5px)";
    gEBI("alert").style.display = "block";
    gEBI("seconds").innerHTML = "5";
    let leftTime = 4;
    let alertInterval = setInterval(() => {
      gEBI("seconds").innerHTML = leftTime;
      if(leftTime == 0) {
        gEBI("zoomStart").style.display = "block";
        gEBI("alert").style.backdropFilter = "none";
        gEBI("alert").style.display = "none";    
        
        clearInterval(alertInterval);
      }
      leftTime--;
    }, 1000);
  }

  showStudent(sState, id) {
    if(gEBI("zoomGame").style.display == "block") {
      let block = gEBI(id);
      if(sState == States.STUDY) block.innerHTML = `<img src="./img/students/${id}-1.png" class="blockImg"/>`;
      else if(sState == States.PLAY) block.innerHTML = `<img src="./img/students/${id}-2.png" class="blockImg"/>`;
      else if(sState == States.NO) block.innerHTML = `<p class="name">${studentNames[id]}</p>`;     
    }
  }
  
  showPage1() {
    gEBI("page1").style.display = "block";
    gEBI("page2").style.display = "none";  
  }
  
  showPage2() {
    gEBI("page2").style.display = "grid";
    gEBI("page1").style.display = "none";  
  }

  updateScore(orgScore, dScore) {
    let deltaScore;
    this.score = orgScore + dScore;
    if(dScore != 0) deltaScore = (dScore > 0) ? `+${dScore}` : `${dScore}`;
    gEBI("scoreNum").innerHTML = this.score;
    gEBI("scoreDelta").innerHTML = deltaScore;
    setTimeout(() => { gEBI("scoreDelta").innerHTML = ""; }, 500);
  }

  showAlert() {
  }
}