var canvas = document.getElementById('container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class glyph {
    x = 0;
    y = 0;
    velocity = 0;
}

class NumberShooter {
    h = 0;
    w = 0;
    velocity = 10;
    numbers = [];
    context;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.h = canvas.height;
        this.w = canvas.width;

        window.addEventListener('resize', function () {
            this.w = canvas.width = window.innerWidth;
            this.h = canvas.height = window.innerHeight;
        });

        this.canvas.addEventListener('click', this.onMouseClick(canvas));
    }

    onMouseClick(canvas) {
        const self = this;

        return function (event) {
            self.getTarget(canvas, event, self);

            const dot = new glyph();
            dot.x = self.targetX;
            dot.y = self.targetY;

            const dx = dot.x;
            const dy = dot.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            const velocityX = (dx / distance) * self.velocity;
            const velocityY = (dy / distance) * self.velocity;

            function animate() {
                self.context.clearRect(0, 0, self.w, self.h);
                
                dot.x += velocityX;
                dot.y += velocityY;
                
                self.context.beginPath();
                self.context.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
                self.context.fillStyle = 'white';
                self.context.fill();
                
                if (dot.x < 0 || dot.x > self.w || dot.y < 0 || dot.y > self.h) {
                    return;
                }

                requestAnimationFrame(animate);
            }

            animate();
        };
    }

    getTarget(canvas, event, self) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        self.targetX = mouseX;
        self.targetY = mouseY;
    }
}

numberShooter = new NumberShooter(canvas);
