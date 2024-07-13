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

function startGame(obj) {
  // hide gameSetUpControls
  // (add class hidden)
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
  animate();
  clickableTextObjects = clickableTextObjects.filter(x => x.text != obj.text);
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
  context = canvas.getContext('2d');
  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  context.lineWidth = 2;
  context.strokeStyle = 'white';
}

function initVariables() {
  log()
  gameLength = 120;
  explosionDuration = 5000;
  qVelocity = canvas.height / 1000;

  padding = canvas.height * .02;
  a = [];
}

function initGame() {
  // TODO: make these configurable
  term1Min = 1;
  term1Max = 10;
  term2Min = 1;
  term2Max = 10;

  generateNewQuestion();
  generateNewAnswers();
}

function initTimer() {
  startTime = Date.now();
  timer = {};
  timer.x = 10;
  timer.y = fontSize;
  timer.text = gameLength;
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);
}
