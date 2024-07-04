var canvas = document.getElementById('container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = 'black';
var qVelocity,
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
  term1Min,
  term1Max,
  term2Min,
  term2Max,
  a;
var clickableTextObjects = [];
var explosions = [];
// attach a listener to the window resize event
// to keep the canvas sized to the window
window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  boundaryX = canvas.width;
  boundaryY = canvas.height;
  context.font = font;
  context.fillStyle = 'white';
  context.lineWidth = 2;
  context.strokeStyle = 'white';
});

canvas.addEventListener('click', function (event) {
  var x = event.clientX;
  var y = event.clientY;
  var objectWasClicked = false;
  clickableTextObjects.forEach(function (obj) {
    if (areOverlapping({ x: x, y: y }, obj)) {
      objectWasClicked = true;
      if (obj.onClicked) {
        obj.onClicked(obj);
      }
    }
  });
  if (!objectWasClicked) {
    addExplosion(x, y);
  }
});

init();
animate();

function init() {
  qVelocity = canvas.height / 1000;
  context = canvas.getContext('2d');
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  explosionDuration = 5000;

  // TODO: make these configurable
  term1Min = 1;
  term1Max = 12;
  term2Min = 1;
  term2Max = 12;

  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  padding = canvas.height * .03;
  a = [];

  startTime = Date.now();
  timer = {};
  timer.x = 10;
  timer.y = fontSize;
  timer.text = '120 seconds remaining';
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