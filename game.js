const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
let keys = {};
let fireballs = [];
let targets = [];
let score = 0;
let level = 1;
let targetColors = ['green', 'yellow', 'orange', 'purple', 'red'];

window.addEventListener('keydown', function(e) {
    keys[e.code] = true;
    if (e.code === 'Space') {
        fireballs.push(new Fireball(player.x + player.width / 2 - 5, player.y));
    }
});

window.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Fireball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.speed = 7;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Target {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function createTargets() {
    targets = [];
    for (let i = 0; i < 5; i++) {
        targets.push(new Target(i * 100 + 50, 50, targetColors[level - 1]));
    }
}

function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function update(deltaTime) {
    player.update();
    fireballs.forEach((fireball, index) => {
        fireball.update();
        if (fireball.y + fireball.height < 0) {
            fireballs.splice(index, 1);
        }
    });

    fireballs.forEach((fireball, fireballIndex) => {
        targets.forEach((target, targetIndex) => {
            if (isColliding(fireball, target)) {
                fireballs.splice(fireballIndex, 1);
                targets.splice(targetIndex, 1);
                score += 10;
                if (targets.length === 0) {
                    level++;
                    if (level > 5) {
                        level = 1; // Reset to level 1 after level 5
                    }
                    createTargets();
                }
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    fireballs.forEach(fireball => fireball.draw());
    targets.forEach(target => target.draw());

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Level: ' + level, 10, 60);
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

const player = new Player();
createTargets();
requestAnimationFrame(gameLoop);
