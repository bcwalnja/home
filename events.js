function addEvents() {
  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .9;
    boundaryX = canvas.width;
    boundaryY = canvas.height;
    context.font = font;
    context.fillStyle = 'white';
    context.lineWidth = 2;
    context.strokeStyle = 'white';
  });
  
  canvas.addEventListener('click', function (event) {
    let x = event.clientX;
    let y = event.clientY;
    let objectWasClicked = false;
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
}