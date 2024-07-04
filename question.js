let q;

/** Add another question to the question array, if
 * the array is not full. Limit is 2 plus the number
 * of missiles.
 */
function generateNewQuestion(missileCount) {
  log('generating a new question');
  q ??= [];
  var limit = missileCount || 0;
  limit += 2;
  if (q && q.length > limit) {
    return;
  }

  q ??= [];
  var q1 = {};
  q1.x = canvas.width / 2 - context.measureText(q1.text).width / 2;
  q1.y = fontSize;
  q1.term1 = rand(terms.term1.min, terms.term1.max);
  q1.term2 = rand(terms.term2.min, terms.term2.max);
  q1.answer = q1.term1 * q1.term2;
  q1.text = q1.term1 + ' * ' + q1.term2 + ' = ?';
  q1.complete = false;
  q.push(q1);
}

function removeQuestion() {
  log('removeQuestion');
  q.shift();
}