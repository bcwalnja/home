var canvas = document.getElementById('container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var velocity,
  context,
  font,
  fontSize,
  startTime,
  wasClicked,
  score,
  timer,
  missiles,
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
  velocity = canvas.height / 1000;
  context = canvas.getContext('2d');

  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';

  a = [];

  startTime = Date.now();
  timer = {};
  timer.x = 0;
  timer.y = fontSize;
  timer.text = '120 seconds remaining';
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);

  generateNewQuestion();
  generateNewAnswers();
}
function draw() {
  verbose('draw');
  if (!q || !q.length) {
    generateNewQuestion();
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

function rand(min = 1, max = 10) {
  verbose('rand');
  return Math.floor(Math.random() * max) + min;
}

function generateNewQuestion() {
  log('generating a new question');

  // q should never have more than two questions in it
  if (q && q.length > 1) {
    return;
  }

  q ??= [];
  var q1 = {};
  q1.x = canvas.width / 2 - context.measureText(q1.text).width / 2;
  q1.y = fontSize;
  q1.term1 = rand(1, 12);
  q1.term2 = rand(1, 12);
  q1.answer = q1.term1 * q1.term2;
  q1.text = q1.term1 + ' * ' + q1.term2 + ' = ?';
  q1.complete = false;
  q.push(q1);
}

function generateNewAnswers() {
  log('generating new answers');
  a ??= [];
  var a1 = {};
  var a2 = {};
  var a3 = {};
  var a4 = {};

  while (a1.text == a2.text
    || a1.text == a3.text
    || a1.text == a4.text
    || a2.text == a3.text
    || a2.text == a4.text
    || a3.text == a4.text) {
    a1.text = rand(1, 12) * rand(1, 12);
    a2.text = rand(1, 12) * rand(1, 12);
    a3.text = rand(1, 12) * rand(1, 12);
    a4.text = rand(1, 12) * rand(1, 12);
  }

  a1.y = a2.y = a3.y = a4.y = canvas.height - fontSize - 10;
  a1.x = canvas.width * 0.1;
  a2.x = canvas.width * 0.3;
  a3.x = canvas.width * 0.5;
  a4.x = canvas.width * 0.7;

  a1.onClicked = a2.onClicked = a3.onClicked = a4.onClicked = aOnClicked;
  clickableTextObjects.push(a1);
  clickableTextObjects.push(a2);
  clickableTextObjects.push(a3);
  clickableTextObjects.push(a4);

  a = [a1, a2, a3, a4];

  if (!a.some(x => x.text == q[0].answer)) {
    a[rand(0, 4)].text = q[0].answer;
  }
}

function renderQuestion() {
  verbose('renderQuestion');
  q.forEach(x => {
    if (x.y < canvas.height - fontSize) {
      x.y += velocity;
    } else {
      x.complete = true;
    }
    context.fillText(x.text, x.x, x.y);
  });
}

function renderAnswers() {
  verbose('renderAnswers');

  //if any have dx or dy, they were clicked, so increase their x and y
  a.forEach(x => {
    if (x.dx) {
      x.x += x.dx;
      x.y += x.dy;
    }
    context.fillText(x.text, x.x, x.y);
  });
}

function renderMissiles() {
  verbose('renderMissiles');
  if (!missiles || !missiles.length) {
    return;
  }
  missiles.forEach(x => {
    if (x.dx) {
      x.x += x.dx;
      x.y += x.dy;
    }
    context.fillText(x.text, x.x, x.y);
  });
}

function checkIfQuestionIsAnswered() {
  verbose('checkIfQuestionIsAnswered');
  // if any answer has entered the question hit box, q is complete
  var answer;
  missiles?.forEach(missile => {
    var top = missile.y;
    var bottom = missile.y + fontSize;
    var left = missile.x;
    var right = missile.x + context.measureText(missile.text).width;

    if (q[0].y < bottom && q[0].y > top &&
      q[0].x > left && q[0].x < right) {

      q[0].complete = true;
      answer = missile.text;
      // remove the missile from the array
      missiles.shift();
    }
  });

  if (q[0].complete) {
    log('question was answered');
    // add a bunch of explosions
    for (let i = 0; i < 20; i++) {
      var x = q[0].x + rand(-10, 10);
      var y = q[0].y + rand(-10, 10);
      addExplosion(x, y);
    }
    if (answer && answer == q[0].answer) {
      score += 2;
    } else {
      score -= 1;
    }

    removeQuestion();
  }
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

function renderScore() {
  verbose('renderScore');
  score ??= 0;
  var x = canvas.width - context.measureText('Score: ' + score).width;
  var y = fontSize;
  context.fillText('Score: ' + score, x, y);
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
    } else if (now - explosion.startTime > 15000) {
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

  function r() { return (Math.random() - 0.5) * 2 };

  for (let i = 0; i < rand(25, 50); i++) {
    var dx = Math.exp(r()) * r();
    var dy = Math.exp(r()) * r();
    explosion.points.push({ x: x, y: y, dx: dx, dy: dy })
  }
  explosions.push(explosion);
}

function removeExplosion() {
  log('removeExplosion');
  explosions.shift();
}

function removeQuestion() {
  log('removeQuestion');
  q.shift();
}

function aOnClicked(obj) {
  log('answer ' + obj.text + ' was clicked');
  var missile = {};
  missile.text = obj.text;
  missile.x = obj.x;
  missile.y = obj.y;
  missile.dx = (q[0].x - obj.x) / 100;
  var yBuffer = canvas.height * .1
  missile.dy = (q[0].y - obj.y + yBuffer) / 100;

  // remove the answer from answers and add it to missiles
  missiles ??= [];
  missiles.push(missile);

  generateNewQuestion();
  generateNewAnswers();
}

function timerOnClicked(obj) {
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