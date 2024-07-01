var canvas = document.getElementById('container');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// attach a listener to the window resize event
// to keep the canvas sized to the window
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    boundaryX = canvas.width;
    boundaryY = canvas.height;
    setFontStyle();
});

// define variables
var context = canvas.getContext('2d');
var font,
    fontSize,
    question, 
    answers, 
    correctAnswer, 
    totalRight, 
    totalQuestions, 
    score, 
    timeGameWasStarted, 
    timer, 
    isGameOver,
    cellWidth,
    cellHeight;

init();
animate();

function init() {
    timeGameWasStarted = new Date();

    setFontStyle();
    

    cellWidth = canvas.width / 4;
    cellHeight = canvas.height / 4;
    score = 0;
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    requestAnimationFrame(animate);
}

function draw() {
    // draw score at the top left
    drawScore();

    // draw time remaining at the top right
    drawTimeRemaining();

    // draw math question at the top
    drawMathQuestion();

    // draw four answers at the bottom

}

function drawMathQuestion() {
    function rand() {
        return Math.floor(Math.random() * 10) + 1;
    }
    
    if (!question) {
        question = {};
        question.num1 = rand();
        question.num2 = rand();
        question.answer = question.num1 * question.num2;
        question.wrongAnswer1 = rand() * rand();
        question.wrongAnswer2 = rand() * rand();
        question.wrongAnswer3 = rand() * rand();
        question.text = num1 + ' x ' + num2 + ' = ??';
    }
    
    var x = canvas.width / 2;
    var y = fontSize;
    context.fillText(question.text, x, y);

    //give question a downward velocity that it will take 10 seconds to reach the bottom
    question.vy = canvas.height / 10;
    question.y = 0;
    question.x = canvas.width / 2;
}

function drawScore() {
    x = 0;
    y = fontSize;
    context.fillText('Score: ' + score, x, y);
}

function drawTimeRemaining() {
    //time remaining is the number of seconds remaining in 2 minutes since game start
    var timeRemaining = 120 - (new Date() - timeGameWasStarted) / 1000;
    timeRemaining = timeRemaining.toFixed(0);
    
    var text = 'Time: ' + timeRemaining;
    var textPixels = context.measureText(text, font);
    var x = canvas.width - textPixels.width;
    var y = fontSize;
    context.fillText(text, x, y);
}

function setFontStyle() {
    fontSize = canvas.width / 40;
    font = fontSize + 'px Arial';
    context.font = font;
    context.fillStyle = 'white';
}
