
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
        // score is 10_000 minus the time it took to answer
        var time = Date.now() - q[0].time;
        score += 10_000 - time;
      } else {
        score -= 2_000;
      }
  
      removeQuestion();
    }
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
  