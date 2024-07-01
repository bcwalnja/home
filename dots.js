var canvas = document.getElementById('container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var points = [],
  velocity2 = 15, // velocity squared
  context = canvas.getContext('2d'),
  radius = 2,
  boundaryX = canvas.width,
  boundaryY = canvas.height,
  numberOfPoints = 3000;

// attach a listener to the window resize event
// to keep the canvas sized to the window
window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  boundaryX = canvas.width;
  boundaryY = canvas.height;
});


init();


function init() {
  // create points
  for (var i = 0; i < numberOfPoints; i++) {
    createPoint();
  }
  // create connections
  for (var i = 0, l = points.length; i < l; i++) {
    var point = points[i];
    if (i == 0) {
      points[i].buddy = points[points.length - 1];
    } else {
      points[i].buddy = points[i - 1];
    }
  }

  // animate
  animate();
}

function createPoint() {
  var point = {}, vx2, vy2;
  point.x = Math.random() * boundaryX;
  point.y = Math.random() * boundaryY;
  // random vx 
  point.vx = (Math.floor(Math.random()) * 2 - 1) * Math.random();
  vx2 = Math.pow(point.vx, 2);
  // vy^2 = velocity^2 - vx^2
  vy2 = velocity2 - vx2;
  point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
  points.push(point);
}

function resetVelocity(point, axis, dir) {
  var vx, vy;
  if (axis == 'x') {
    point.vx = dir * Math.random();
    vx2 = Math.pow(point.vx, 2);
    // vy^2 = velocity^2 - vx^2
    vy2 = velocity2 - vx2;
    point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
  } else {
    point.vy = dir * Math.random();
    vy2 = Math.pow(point.vy, 2);
    // vy^2 = velocity^2 - vx^2
    vx2 = velocity2 - vy2;
    point.vx = Math.sqrt(vx2) * (Math.random() * 2 - 1);
  }
}

function drawCircle(x, y) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#97badc';
  context.fill();
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = '#8ab2d8'
  context.stroke();
}

function draw() {
  context.font = "48px serif";
  context.fillText('HTML5 Canvas', 100, 100);

  for (var i = 0, l = points.length; i < l; i++) {
    // circles
    var point = points[i];
    point.x += point.vx;
    point.y += point.vy;
    drawCircle(point.x, point.y);
    
    // check for edge
    if (point.x < 0 + radius) {
      resetVelocity(point, 'x', 1);
    } else if (point.x > boundaryX - radius) {
      resetVelocity(point, 'x', -1);
    } else if (point.y < 0 + radius) {
      resetVelocity(point, 'y', 1);
    } else if (point.y > boundaryY - radius) {
      resetVelocity(point, 'y', -1);
    }
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  requestAnimationFrame(animate);
}
