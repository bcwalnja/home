
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
  