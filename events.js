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
  
  //TODO: figure out why this is causing two answers to be clicked
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