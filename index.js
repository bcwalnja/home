var logVerbose = false;
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
  xOptions,
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

// TODO: why is the answer generation messed up?
// If a second missile is launched before the first one completes, 
// no new question is generated onClick, and the answers that are
// available don't include a correct answer for the question that
// gets generated.

function init() {
  qVelocity = canvas.height / 1000;
  context = canvas.getContext('2d');
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  explosionDuration = 15000;
  xOptions = [
    canvas.width * 0.1, 
    canvas.width * 0.3, 
    canvas.width * 0.5, canvas.width * 0.7
  ];

  fontSize = Math.floor(canvas.height / 20);
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  padding = canvas.height * .03;
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

/** min and max are both inclusive */
function rand(min = 1, max = 10) {
  verbose('rand');
  let mean = (max + min) / 2;         // 10 + 1 = 11 / 2 = 5.5
  let range = max - min;              // 10 - 1 = 9
  let seed = Math.random() - 0.5;     // 0.7 - 0.5 = 0.2
  let result = mean + seed * range;   // 5.5 + 0.2 * 9 = 5.5 + 1.8 = 7.3
  return Math.round(result);
}

function generateNewQuestion() {
  log('generating a new question');

  // the limit of q is 2 plus the number of missiles
  if (q && q.length > 2 + (missiles?.length || 0)) {
    return;
  }


  q ??= [];
  var newQ = {};
  // get the current q[last] x position, and
  // set newQ x position as the next one in the array
  var lastQ = q[q.length - 1]?.x || 0;
  var lastX = xOptions.indexOf(lastQ);
  newQ.x = xOptions[(lastX + 1) % xOptions.length];
  newQ.y = fontSize;
  newQ.term1 = rand(1, 12);
  newQ.term2 = rand(1, 12);
  newQ.answer = newQ.term1 * newQ.term2;
  newQ.text = newQ.term1 + ' * ' + newQ.term2 + ' = ?';
  newQ.complete = false;
  q.push(newQ);
}

function generateNewAnswers() {
  log('generating new answers');
  a ??= [];
  var a1 = {};
  var a2 = {};
  var a3 = {};
  var a4 = {};

  a1.text = rand(1, 12) * rand(1, 12);

  do {
    a2.text = rand(1, 12) * rand(1, 12);
  } while (a1.text == a2.text);
  do {
    a3.text = rand(1, 12) * rand(1, 12);
  } while (a1.text == a3.text || a2.text == a3.text);
  do {
    a4.text = rand(1, 12) * rand(1, 12);
  } while (a1.text == a4.text || a2.text == a4.text || a3.text == a4.text);

  a1.isAnAnswer = a2.isAnAnswer = a3.isAnAnswer = a4.isAnAnswer = true;

  a1.y = a2.y = a3.y = a4.y = canvas.height - fontSize - 10;
  a1.x = canvas.width * 0.1;
  a2.x = canvas.width * 0.3;
  a3.x = canvas.width * 0.5;
  a4.x = canvas.width * 0.7;

  a1.onClicked = a2.onClicked = a3.onClicked = a4.onClicked = aOnClicked;
  //remove the old answers from clickableTextObjects
  clickableTextObjects = clickableTextObjects.filter(x => !x.isAnAnswer);
  clickableTextObjects.push(a1);
  clickableTextObjects.push(a2);
  clickableTextObjects.push(a3);
  clickableTextObjects.push(a4);

  a = [a1, a2, a3, a4];

  // the correct answer is the answer to the last question in the q array
  var correctAnswer = q[q.length - 1].answer;

  if (!a.some(x => x.text == correctAnswer)) {
    a[rand(0, 3)].text = correctAnswer;
  }
}

function renderQuestion() {
  verbose('renderQuestion');
  for (let i = 0; i < q.length; i++) {
    const x = q[i];
    // font size * 2 because the height of the question
    // plus the height of the answers.
    if (x.y < canvas.height - fontSize * 2 - padding) {
      x.y += qVelocity;
    } else {
      // question has reached the bottom of the screen
      x.complete = true;
    }

    if (i == (missiles?.length || 0)) {
      //draw a box around the focused question (the one the answers are for)
      var left = x.x - padding / 2;
      var top = x.y - fontSize - padding / 4;
      var width = context.measureText(x.text).width + padding;
      var height = fontSize + padding;
      context.save();
      context.strokeRect(left, top, width, height);
      context.restore();
    }

    context.fillText(x.text, x.x, x.y);
  }
}

function renderAnswers() {
  verbose('renderAnswers');
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

function areOverlapping(a, b) {
  verbose('areOverlapping');
  var topA = a.y - padding;
  var bottomA = a.y + fontSize + padding;
  var leftA = a.x - padding;
  var widthA = a.text ? context.measureText(a.text).width : 0;
  var rightA = a.x + widthA + padding;

  var topB = b.y - padding;
  var bottomB = b.y + fontSize + padding;
  var leftB = b.x - padding;
  var widthB = b.text ? context.measureText(b.text).width : 0;
  var rightB = b.x + widthB + padding;

  return !(bottomA < topB || topA > bottomB || rightA < leftB || leftA > rightB);

}

function checkIfQuestionIsAnswered() {
  verbose('checkIfQuestionIsAnswered');
  // if any answer has entered the question hit box, q is complete
  var answer;
  missiles?.forEach(missile => {
    q.forEach(x => {
      if (areOverlapping(missile, x)) {
        x.complete = true;
        answer = missile.text;
      }
    });
  });

  if (q[0].complete) {
    log('question was answered');
    // remove the missile from the array
    missiles.shift();
    // add a bunch of explosions
    for (let i = 0; i < 10; i++) {
      var x = q[0].x + rand(-20, 20);
      var y = q[0].y + rand(-20, 20);
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
    } else if (now - explosion.startTime > explosionDuration) {
      removeExplosion();
      return;
    } else {
      //pick the color to be the shade of red that is 
      // the percentage of the way through the explosion
      if (!explosion.ratio) {
        explosion.ratio = rand(0, 100) / 100;
      }
      
      var percent = 1 - (now - explosion.startTime) / explosionDuration;
      var r = Math.ceil(255 * percent).toString(16).padStart(2, '0');
      var g = Math.ceil(255 * percent * explosion.ratio).toString(16).padStart(2, '0');
      var color = '#' + r + g + '00';

      explosion.points.forEach(point => {
        context.save();
        point.x += point.dx;
        point.y += point.dy;
        context.fillStyle = color;
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

  for (let i = 0; i < rand(15, 30); i++) {
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
  missile.dy = (q[0].y - obj.y + padding) / 100;

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