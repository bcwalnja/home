
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
