
/** min and max are both inclusive */
function rand(min = 1, max = 10) {
  verbose('rand');
  let mean = (max + min) / 2;         // 10 + 1 = 11 / 2 = 5.5
  let range = max - min;              // 10 - 1 = 9
  let seed = Math.random() - 0.5;     // 0.7 - 0.5 = 0.2
  let result = mean + seed * range;   // 5.5 + 0.2 * 9 = 5.5 + 1.8 = 7.3
  return Math.round(result);
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
