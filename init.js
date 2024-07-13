let logVerbose = false;
let operation = 'multiplication';
let highScore = localStorage.getItem('highScore') || 0;
let canvas,
  qVelocity,
  context,
  font,
  fontSize,
  startTime,
  gameLength,
  lastClick,
  score,
  timer,
  missiles,
  padding,
  explosionDuration,
  term1Min,
  term1Max,
  term2Min,
  term2Max,
  startButton,
  a,
  q;
const clickableTextObjects = [];
const explosions = [];
// attach a listener to the window resize event
// to keep the canvas sized to the window
gameSetUpControls = document.getElementById('game-set-up-controls');
gameModeControls = document.getElementById('game-mode-controls');

showMainMenu();
clickableTextObjects.push(startButton);
//on click operation = event?.target?.innerText
gameModeControls.addEventListener('click', (e) => { operation = e.target.innerText; });
canvas.addEventListener('click', handleCanvasClick);
window.addEventListener('resize', initCanvas);