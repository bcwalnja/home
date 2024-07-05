let canvas = document.getElementById('container');
canvas.width = window.innerWidth;
// make the height be the inner window height minus the top of the canvas
canvas.height = window.innerHeight * .8;
canvas.style.backgroundColor = 'black';
let qVelocity,
  context,
  font,
  fontSize,
  startTime,
  wasClicked,
  score,
  timer,
  missiles,
  padding,
  explosionDuration,
  a;
let clickableTextObjects;
let explosions;
let gameRunning = false;
// attach a listener to the window resize event
// to keep the canvas sized to the window

init();
animate();

function startGame() {
  if (!gameRunning) {
    init();
    animate();
    gameRunning = !gameRunning;
  }
}

//document.getElementById('startButton').addEventListener('click', startGame);

function init() {
  //TODO: make this configurable as easy, medium, hard
  qVelocity = canvas.height / 1000;

  addEvents();

  canvas = document.getElementById('container');

  clickableTextObjects = []
  explosions = []
  context = canvas.getContext('2d');
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  explosionDuration = 5000;

  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  //something's wrong with `areOverlappting` function
  padding = canvas.height * .03;
  a = [];

  startTime = Date.now();
  timer = {};
  timer.x = 10;
  timer.y = fontSize;
  timer.text = '120';
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);

  generateNewQuestion(missiles?.length);
  generateNewAnswers();
}

function draw() {
  verbose('draw');
  if (!q || !q.length) {
    generateNewQuestion(missiles?.length);
  }
  checkIfQuestionIsAnswered();

  renderQuestion();
  renderAnswers();
  renderMissiles();

  renderScore();
  renderTimer();
  renderExplosions();
}

function animate() {
  verbose('animate');
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  requestAnimationFrame(animate);
}

function timerOnClicked(obj) {
  log('timer was clicked');
  startTime += 1000;
}