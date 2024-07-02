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
  clickableTextObjects.forEach(function (obj) {
    var buffer = canvas.height / 25;
    var top = obj.y - buffer;
    var bottom = obj.y + fontSize + buffer;
    var left = obj.x - buffer;
    var right = obj.x + context.measureText(obj.text).width + buffer;
    if (event.x >= left && event.x <= right &&
      event.y >= top && event.y <= bottom) {
      if (obj.onClicked) {
        obj.onClicked(obj);
      }
    }
  });
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

  if (a && a.length && !a.some(x => x.text == q[q.length - 1].answer)) {
    var i = rand(1, 4);
    while (true) {
      if (a[i]?.wasClicked === true) {
        continue;
      } else {
        a[i].text = q1.answer;
        break;
      }
    }
  }
}

function generateNewAnswersForNonClicked() {
  log('generating new answers for non-clicked answers');
  var correct = rand(1, 3);
  var nonClicked = a.filter(x => !x.wasClicked);
  var answers = getAnswerValues();
  for (let i = 0; i < nonClicked.length; i++) {
    if (i == correct) {
      nonClicked[i].text = q[q.length - 1].answer;
    } else {
      nonClicked[i].text = answers[i];
    }
  }

}

function generateNewAnswers() {
  log('generating new answers');

  if (!a || !a.length) {
    a = [{}, {}, {}, {}];
  }

  // if all four answers are nonzero and
  // one of the answers already matches q.answer, no need to generate new answers
  if (a.every(x => x.text > 0) && a.some(x => x.text == q[q.length - 1].answer)) {
    return;
  }

  var answers = getAnswerValues();

  for (let i = 0; i < a.length; i++) {
    a[i].text = answers[i];
    a[i].wasClicked = false;
    a[i].x = canvas.width * ((i + 1) / 5 - .1);
    a[i].y = canvas.height - fontSize - 10;
    a[i].dx = 0;
    a[i].dy = 0;
    a[i].onClicked = aOnClicked;

    if (!clickableTextObjects.includes(a[i])) {
      clickableTextObjects.push(a[i]
      );
    }
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

  // TODO: ryan's suggestion is that once an answer is clicked,
  // separate it out from the others and regenerate the other four
  // that way the user can answer questions as fast as they want to

  //if any have dx or dy, they were clicked, so increase their x and y
  for (let i = 0; i < a.length; i++) {
    if (a[i].dx) {
      a[i].x += a[i].dx;
      a[i].y += a[i].dy;
    }

    context.fillText(a[i].text, a[i].x, a[i].y);
  }
}

function checkIfQuestionIsAnswered() {
  verbose('checkIfQuestionIsAnswered');
  // if any answer has entered the question hit box, q is complete
  var answer;

  for (let i = 0; i < a.length; i++) {
    var top = a[i].y - fontSize;
    var bottom = a[i].y + fontSize;
    var left = a[i].x - context.measureText(a[i].text).width / 2;
    var right = a[i].x + context.measureText(a[i].text).width

    if (q[0].y < bottom && q[0].y > top &&
      q[0].x > left && q[0].x < right) {
      q[0].complete = true;
      answer = a[i].text;
      a[i] = {};
      break;
    }
  }

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
    generateNewQuestion();
    generateNewAnswersForNonClicked();
  }
}

function getAnswerValues() {
  var a1, a2, a3, a4;
  while (a1 === a2 || a1 === a3 || a1 === a4 || a2 === a3 || a2 === a4 || a3 === a4) {
    a1 = rand(1, 12) * rand(1, 12);
    a2 = rand(1, 12) * rand(1, 12);
    a3 = rand(1, 12) * rand(1, 12);
    a4 = rand(1, 12) * rand(1, 12);
  }

  var newA = [a1, a2, a3, a4];

  if (a1 != q[0].answer && a2 != q[0].answer && a3 != q[0].answer && a4 != q[0].answer) {
    newA[rand(0, 4)] = q[0].answer;
  }
  return newA;
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
        context.save();
        if (!point.color) {
          var color = 'rgb(' + rand(200, 255) + ', ' + rand(0, 255) + ', 0)';
          point.color = color;
        }
        context.fillStyle = point.color;

        point.x += point.dx;
        point.y += point.dy;
        context.fillRect(point.x, point.y, 2, 2);
        context.restore();
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
  a.forEach(x => {
    if (x.wasClicked) {
      x = {};
    }
  });
}

function aOnClicked(answer) {
  log('answer ' + answer.text + ' was clicked');
  //figure out where the question is at and move the answer there
  answer.dx = (q[0].x - answer.x) / 100;
  var yBuffer = canvas.height * .1
  answer.dy = (q[0].y - answer.y + yBuffer) / 100;
  answer.wasClicked = true;

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