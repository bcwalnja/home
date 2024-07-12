var logVerbose = false;
var canvas,
  qVelocity,
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
  a,
  q;
var clickableTextObjects = [];
var explosions = [];
// attach a listener to the window resize event
// to keep the canvas sized to the window
window.addEventListener('resize', function () {
  initCanvas();
});

showMainMenu();

function showMainMenu() {
  //clear the canvas
  initCanvas();
  initContext();
  initVariables();
  context.clearRect(0, 0, canvas.width, canvas.height);
  var width = context.measureText("Start").width;
  context.fillText("Start", canvas.width / 2, canvas.height / 2);
  // start button
  var startButton = {
    text: "Start",
    x: canvas.width / 2 - width / 2,
    y: canvas.height / 2 - fontSize / 2,
    onClicked: startGame
  };
  clickableTextObjects.push(startButton);

  // box around start button
  var left = startButton.x + padding / 2;
  var top = startButton.y - fontSize + padding;
  var width = width + padding * 4;
  var height = fontSize + padding;
  context.strokeRect(left, top, width, height);
}

function startGame() {
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
}

function initCanvas() {
  canvas = document.getElementById('container');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  boundaryX = canvas.width;
  boundaryY = canvas.height;
  canvas.addEventListener('click', handleCanvasClick());
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
  //init variables
  explosionDuration = 5000;
  qVelocity = canvas.height / 1000;
  
  padding = canvas.height * .02;
  a = [];
}

function handleCanvasClick() {
  return function (event) {
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
  };
}

function initGame() {
  // TODO: make these configurable
  term1Min = 1;
  term1Max = 12;
  term2Min = 1;
  term2Max = 12;
  
  generateNewQuestion();
  generateNewAnswers();
}

function initTimer() {
  startTime = Date.now();
  timer = {};
  timer.x = 10;
  timer.y = fontSize;
  timer.text = '120';
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);
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
  let mean = (max + min) / 2;
  let range = max - min;
  let seed = Math.random() - 0.5;
  let result = mean + seed * range;
  return Math.round(result);
}

function generateNewQuestion() {
  log('generating a new question');

  // the limit of q is 2 plus the number of missiles
  if (q && q.length > 2 + (missiles?.length || 0)) {
    return;
  }

  q ??= [];
  var q1 = {};
  q1.x = canvas.width / 2 - context.measureText(q1.text).width / 2;
  q1.y = fontSize;
  q1.term1 = rand(term1Min, term1Max);
  q1.term2 = rand(term2Min, term2Max);
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
      // question reached the bottom of the screen
      x.complete = true;
    }

    if (i == (missiles?.length || 0)) {
      //draw a box around the question
      var left = x.x - padding / 2;
      var top = x.y - fontSize - padding / 4;
      var width = context.measureText(x.text).width + padding;
      var height = fontSize + padding;
      context.strokeRect(left, top, width, height);
    }

    context.fillText(x.text, x.x, x.y);
  }
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
    if (areOverlapping(missile, q[0])) {
      q[0].complete = true;
      answer = missile.text;
    }
  });

  if (q[0].complete) {
    log('question was answered');
    // remove the missile from the array
    missiles?.shift();
    var z = context.measureText(q[0].text).width;
    // add a bunch of explosions
    for (let i = 0; i < 20; i++) {
      var x = q[0].x + rand(0, z);
      var y = q[0].y + rand(0 - fontSize, 0);
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
    timer.text = 0;
  } else {
    timer.text = Math.round(timer.timeRemaining);
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

  for (let i = 0; i < 25; i++) {
    var dx = Math.exp(r()) * r() * 2;
    var dy = Math.exp(r()) * r() * 2;
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