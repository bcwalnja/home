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

  a = {};
  a.a1 = {};
  a.a2 = {};
  a.a3 = {};
  a.a4 = {};

  function getAnswers() {
    var a1, a2, a3, a4;
    while (a1 === a2 || a1 === a3 || a1 === a4 || a2 === a3 || a2 === a4 || a3 === a4) {
      a1 = rand(1, 12) * rand(1, 12);
      a2 = rand(1, 12) * rand(1, 12);
      a3 = rand(1, 12) * rand(1, 12);
      a4 = rand(1, 12) * rand(1, 12);
    }
    return [a1, a2, a3, a4];
  }

  var rightAnswer = rand(1, 4);
  var answers = getAnswers();
  var answer = q[0].answer;
  a.a1.text = rightAnswer == 1 ? answer : answers[0];
  a.a2.text = rightAnswer == 2 ? answer : answers[1];
  a.a3.text = rightAnswer == 3 ? answer : answers[2];
  a.a4.text = rightAnswer == 4 ? answer : answers[3];

  a.a1.y = a.a2.y = a.a3.y = a.a4.y = canvas.height - fontSize - 10;
  a.a1.x = canvas.width * 0.1;
  a.a2.x = canvas.width * 0.3;
  a.a3.x = canvas.width * 0.5;
  a.a4.x = canvas.width * 0.7;

  a.a1.onClicked = a.a2.onClicked = a.a3.onClicked = a.a4.onClicked = aOnClicked;
  clickableTextObjects.push(a.a1);
  clickableTextObjects.push(a.a2);
  clickableTextObjects.push(a.a3);
  clickableTextObjects.push(a.a4);
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
  if (a.a1.dx) {
    a.a1.x += a.a1.dx;
    a.a1.y += a.a1.dy;
  }
  if (a.a2.dx) {
    a.a2.x += a.a2.dx;
    a.a2.y += a.a2.dy;
  }
  if (a.a3.dx) {
    a.a3.x += a.a3.dx;
    a.a3.y += a.a3.dy;
  }
  if (a.a4.dx) {
    a.a4.x += a.a4.dx;
    a.a4.y += a.a4.dy;
  }

  context.fillText(a.a1.text, a.a1.x, a.a1.y);
  context.fillText(a.a2.text, a.a2.x, a.a2.y);
  context.fillText(a.a3.text, a.a3.x, a.a3.y);
  context.fillText(a.a4.text, a.a4.x, a.a4.y);
}

function checkIfQuestionIsAnswered() {
  verbose('checkIfQuestionIsAnswered');
  // if any answer has entered the question hit box, q is complete
  var answer;
  if (q[0].y < a.a1.y + fontSize && q[0].y > a.a1.y - fontSize &&
    a.a1.x > q[0].x - context.measureText(q[0].text).width / 2 &&
    a.a1.x < q[0].x + context.measureText(q[0].text).width / 2) {
    q[0].complete = true;
    answer = a.a1.text;
  } else if (q[0].y < a.a2.y + fontSize && q[0].y > a.a2.y - fontSize &&
    a.a2.x > q[0].x - context.measureText(q[0].text).width / 2 &&
    a.a2.x < q[0].x + context.measureText(q[0].text).width / 2) {
    q[0].complete = true;
    answer = a.a2.text;
  } else if (q[0].y < a.a3.y + fontSize && q[0].y > a.a3.y - fontSize &&
    a.a3.x > q[0].x - context.measureText(q[0].text).width / 2 &&
    a.a3.x < q[0].x + context.measureText(q[0].text).width / 2) {
    q[0].complete = true;
    answer = a.a3.text;
  } else if (q[0].y < a.a4.y + fontSize && q[0].y > a.a4.y - fontSize &&
    a.a4.x > q[0].x - context.measureText(q[0].text).width / 2 &&
    a.a4.x < q[0].x + context.measureText(q[0].text).width / 2) {
    q[0].complete = true;
    answer = a.a4.text;
  }

  if (q[0].complete) {
    log('question was answered');
    // add a bunch of explosions
    for (let i = 0; i < 10; i++) {
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
    generateNewAnswers();
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

function removeQuestion() {
  log('removeQuestion');
  q.shift();
}

function aOnClicked(obj) {
  log('answer ' + obj.text + ' was clicked');
  //figure out where the question is at and move the answer there
  obj.dx = (q[0].x - obj.x) / 100;
  var yBuffer = canvas.height * .1
  obj.dy = (q[0].y - obj.y + yBuffer) / 100;

  generateNewQuestion();
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