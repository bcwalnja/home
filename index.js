var canvas = document.getElementById('container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var velocity,
  context,
  font,
  fontSize,
  startTime,
  wasClicked,
  timer,
  a,
  q;
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
});

canvas.addEventListener('click', function (event) {
  var x = event.clientX;
  var y = event.clientY;
  var objectWasClicked = false;
  clickableTextObjects.forEach(function (obj) {
    if (x >= obj.x - 10 && x <= obj.x + context.measureText(obj.text).width + 10 &&
      y >= obj.y - fontSize - 10 && y <= obj.y + 10) {
      objectWasClicked = true;
      if (obj.onClicked) {
        obj.onClicked();
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
  velocity = canvas.height / 1000;
  context = canvas.getContext('2d');
  
  fontSize = Math.floor(canvas.height / 40);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';

  startTime = Date.now();
  timer = {};
  timer.x = 0;
  timer.y = fontSize;
  timer.text = '120 seconds remaining';
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);
}
function draw() {
  verbose('draw');
  if (!q || q.complete) {
    generateNewQuestion();
    generateNewAnswers();
  }

  renderQuestion();
  renderAnswers();
  renderTimer();
  renderExplosions();
}

function animate() {
  verbose('animate');
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  requestAnimationFrame(animate);
}

function rand(min = 1, max = 10) {
  verbose('rand');
  return Math.floor(Math.random() * max) + min;
}

function generateNewQuestion() {
  log('generating a new question');
  q = {};
  q.x = canvas.width / 2 - context.measureText(q.text).width / 2;
  q.y = fontSize;
  q.term1 = rand(1, 12);
  q.term2 = rand(1, 12);
  q.answer = q.term1 * q.term2;
  q.text = q.term1 + ' * ' + q.term2 + ' = ?';
  q.complete = false;
  q.onClicked = qOnClicked;
  clickableTextObjects.push(q);
}

function generateNewAnswers() {
  log('generating new answers');
  a = {};
  a.a1 = {};
  a.a2 = {};
  a.a3 = {};
  a.a4 = {};
  var rightAnswer = rand(1, 4);
  a.a1.text = rightAnswer == 1 ? q.answer : rand(1, 12) * rand(1, 12);
  a.a2.text = rightAnswer == 2 ? q.answer : rand(1, 12) * rand(1, 12);
  a.a3.text = rightAnswer == 3 ? q.answer : rand(1, 12) * rand(1, 12);
  a.a4.text = rightAnswer == 4 ? q.answer : rand(1, 12) * rand(1, 12);

  // make sure none of the answers are duplicates
  while (a.a2 === a.a1 || a.a2 === a.a3 || a.a2 === a.a4) {
    a.a2 = rand(1, 12) * rand(1, 12);
  }
  while (a.a3 === a.a1 || a.a3 === a.a2 || a.a3 === a.a4) {
    a.a3 = rand(1, 12) * rand(1, 12);
  }
  while (a.a4 === a.a1 || a.a4 === a.a2 || a.a4 === a.a3) {
    a.a4 = rand(1, 12) * rand(1, 12);
  }

  a.a1.y = a.a2.y = a.a3.y = a.a4.y = canvas.height - fontSize - 10;
  a.a1.x = canvas.width * 0.1;
  a.a2.x = canvas.width * 0.3;
  a.a3.x = canvas.width * 0.5;
  a.a4.x = canvas.width * 0.7;
}

function renderQuestion() {
  verbose('renderQuestion');
  if (!q.wasClicked && q.y < canvas.height - fontSize) {
    q.y += velocity;
  }
  context.fillText(q.text, q.x, q.y);
}

function renderAnswers() {
  verbose('renderAnswers');
  // I want to research what other parameters I can pass to fillText, particularly color
  context.fillText(a.a1.text, a.a1.x, a.a1.y);
  context.fillText(a.a2.text, a.a2.x, a.a2.y);
  context.fillText(a.a3.text, a.a3.x, a.a3.y);
  context.fillText(a.a4.text, a.a4.x, a.a4.y);
}

function renderTimer() {
  verbose('renderTimer');
  timer.timeRemaining = 120 - (Date.now() - startTime) / 1000;
  if (timer.timeRemaining < 1) {
    timer.text = 'Time is up!';
  } else {
    timer.text = Math.round(timer.timeRemaining) + ' seconds remaining';
  }
  context.fillText(timer.text, timer.x, timer.y);
}

function renderExplosions() {
  verbose('renderExplosions');
  if (!explosions) {
    return;
  }
  var now = Date.now();
  explosions.forEach(explosion => {
    if (!explosion.points) {
      return;
    } else if (now - explosion.startTime > 3000) {
      removeExplosion();
      return;
    } else {
      explosion.points.forEach(point => {
        point.x += point.dx;
        point.y += point.dy;
        context.fillRect(point.x, point.y, 2, 2);
      });
    }
  });
}

function addExplosion(x, y) {
  log('addExplosion');
  var explosion = { x: x, y: y };
  explosion.startTime = Date.now();
  explosion.points = [];
  var rand = Math.floor(Math.random() * 100);
  for (let i = 0; i < rand; i++) {
    var dx = (Math.random() - 0.5) * 20;
    var dy = (Math.random() - 0.5) * 20;
    explosion.points.push({ x: x, y: y, dx: dx, dy: dy })
  }
  explosions.push(explosion);
}

function removeExplosion() {
  log('removeExplosion');
  explosions.shift();
}

function qOnClicked() {
  log('question was clicked');
  q.wasClicked = !q.wasClicked;
};

function aOnClicked() {
  log('answer was clicked');
}

function timerOnClicked() {
  log('timer was clicked');
  startTime += 1000;
}

function log(msg) {
  console.log(msg);
}

function verbose(msg) {
  if (this.logVerbose) {
    console.log(msg);
  }
}