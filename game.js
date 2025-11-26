const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let penguin = {
    x: 50,
    y: canvas.height / 2,
    size: 20,
    velocity: 0,
    gravity: 0.4,
    flap: -7
};

let pipes = [];
let pipeGap = 180;
let pipeWidth = 60;
let frame = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("waddleHighScore")) || 0;

function spawnPipe() {
    let topHeight = Math.random() * (canvas.height - pipeGap - 50);
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap
    });
}

function resetGame() {
    penguin.y = canvas.height / 2;
    penguin.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
}

function update() {
    penguin.velocity += penguin.gravity;
    penguin.y += penguin.velocity;

    // Death if hits ground/sky
    if (penguin.y < 0 || penguin.y > canvas.height) {
        resetGame();
    }

    // Pipes
    if (frame % 90 === 0) spawnPipe();

    pipes.forEach(pipe => {
        pipe.x -= 3;

        // Collision
        if (
            penguin.x + penguin.size > pipe.x &&
            penguin.x - penguin.size < pipe.x + pipeWidth &&
            (penguin.y - penguin.size < pipe.top ||
             penguin.y + penguin.size > pipe.bottom)
        ) {
            resetGame();
        }

        if (pipe.x + pipeWidth < penguin.x - 5 && !pipe.scored) {
            score++;
            pipe.scored = true;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("waddleHighScore", highScore);
            }
        }
    });

    pipes = pipes.filter(p => p.x + pipeWidth > 0);

    frame++;
}

function draw() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Penguin
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(penguin.x, penguin.y, penguin.size, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });

    // Score
    document.getElementById("scorebox").innerText = `Score: ${score} (Best: ${highScore})`;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener("pointerdown", () => {
    penguin.velocity = penguin.flap;
});

loop();
