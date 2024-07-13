function showMainMenu() {
  //clear the canvas
  // make sure gameSetUpControls is visible (remove class hidden)
  gameSetUpControls.classList.remove('hidden');
  initCanvas();
  initContext();
  initVariables();

  var width = context.measureText("Start").width;
  if (!startButton) {
    startButton = {
      text: "Start",
      width: width,
      x: canvas.width / 2 - width / 2,
      y: canvas.height / 2 - fontSize / 2,
      onClicked: startGame
    };
  }

  // draw start button
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(startButton.text, startButton.x, startButton.y);

  // box around start button
  var left = startButton.x - padding / 2;
  var top = startButton.y - fontSize - padding / 4;
  var boxWidth = width + padding;
  var height = fontSize + padding;
  context.strokeRect(left, top, boxWidth, height);

  // high score
  var highScoreText = "High Score: " + highScore;
  var highScoreWidth = context.measureText(highScoreText).width;
  context.fillText(highScoreText, canvas.width / 2 - highScoreWidth / 2, canvas.height / 2 + fontSize * 2);
}

function startGame(startButton) {
  gameSetUpControls.classList.add('hidden');

  if (!canvas) {
    initCanvas()
  }
  if (!context) {
    initContext();
  }
  initVariables();
  initGame();
  initTimer();
  filter(clickableTextObjects, x => x.text != startButton.text);
 
  animate();
}

function filter(list, lambda) {
  const copyList = [];
  for (let i = 0; i < list.length; i++) {
    if (lambda(list[i])) {
      copyList.push(list[i]);
    }
  }
  list.length = 0;
  Array.prototype.push.apply(list, copyList);
}

function initCanvas() {
  canvas = document.getElementById('container');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  boundaryX = canvas.width;
  boundaryY = canvas.height;
  canvas.style.backgroundColor = 'black';
  //canvas.removeEventListener('click', handleCanvasClick());
}

function initContext() {
  log("initContext");
  context = canvas.getContext('2d');
  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  context.lineWidth = 2;
  context.strokeStyle = 'white';
}

function initVariables() {
  log("initVariables");
  gameLength = 120;
  explosionDuration = 5000;
  qVelocity = canvas.height / 1000;

  padding = canvas.height * .02;
  a = [];
}

function initGame() {
  log("initGame");
  term1Min = 1;
  term1Max = Number(document.getElementById('term-1-max')?.value);
  term2Min = 1;
  term2Max = Number(document.getElementById('term-2-max')?.value);
  log("term values: ", term1Min, term1Max, term2Min, term2Max);
  generateQuestionAndAnswers();
}

function initTimer() {
  log("initTimer");
  startTime = Date.now();
  timer = {};
  timer.x = 10;
  timer.y = fontSize;
  timer.text = gameLength;
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);
}
