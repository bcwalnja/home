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
  fontSize = 20;
  font = fontSize + 'px Arial';
  context.font = font;
  context.fillStyle = 'white';
  
  q = {};
  q.x = canvas.width / 2 - context.measureText(q.text).width / 2;
  q.y = fontSize;
  q.text = 'math question will go here';
  q.wasClicked = false;
  q.onClicked = qOnClicked;
  clickableTextObjects.push(q);

  startTime = Date.now();
  timer = {};
  timer.x = 0;
  timer.y = fontSize;
  timer.text = '120 seconds remaining';
  timer.onClicked = timerOnClicked;
  clickableTextObjects.push(timer);
}

function draw() {
  renderQuestion();
  renderTimer();
  renderExplosions();
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  requestAnimationFrame(animate);
}

function renderQuestion() {
  if (!q.wasClicked && q.y < canvas.height - fontSize) {
    q.y += velocity;
  }
  context.fillText(q.text, q.x, q.y);
}

function renderTimer() {
  timer.timeRemaining = 120 - (Date.now() - startTime) / 1000;
  if (timer.timeRemaining < 1) {
    timer.text = 'Time is up!';
  } else {
    timer.text = Math.round(timer.timeRemaining) + ' seconds remaining';
  }
  context.fillText(timer.text, timer.x, timer.y);
}

function renderExplosions() {
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
  var explosion = {x: x, y: y};
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
  explosions.shift();
}

function qOnClicked() {
  q.wasClicked = !q.wasClicked;
};

function timerOnClicked() {
  startTime += 1000;
}