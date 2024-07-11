const WIDTH = 600;
const HEIGHT = 600;
const ROWS = 20;
const COLS = 20;
const CELL_SIZE = WIDTH / COLS;

let scene, camera, renderer;
let snake, food;
let direction = { x: 1, y: 0 };
let snakeBody = [{ x: 10, y: 10 }];
let gameInterval;
let score = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 1000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    snake = new THREE.Group();
    scene.add(snake);

    food = new THREE.Mesh(
        new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(food);

    window.addEventListener('keydown', onKeyPress);
    document.getElementById('playButton').addEventListener('click', startGame);

    placeFood();
    animate();
}

function onKeyPress(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 38: // Up arrow
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 39: // Right arrow
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 40: // Down arrow
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
    }
}

function startGame() {
    document.getElementById('playButton').style.display = 'none';
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, 200);
    score = 0;
    snakeBody = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    placeFood();
    renderSnake();
}

function placeFood() {
    const x = Math.floor(Math.random() * COLS) * CELL_SIZE - WIDTH / 2 + CELL_SIZE / 2;
    const y = Math.floor(Math.random() * ROWS) * CELL_SIZE - HEIGHT / 2 + CELL_SIZE / 2;
    food.position.set(x, y, 0);
}

function update() {
    const head = { ...snakeBody[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snakeBody.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snakeBody.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === (food.position.x + WIDTH / 2 - CELL_SIZE / 2) / CELL_SIZE && head.y === (food.position.y + HEIGHT / 2 - CELL_SIZE / 2) / CELL_SIZE) {
        placeFood();
        score++;
    } else {
        snakeBody.pop();
    }

    renderSnake();
}

function renderSnake() {
    snake.children.forEach(child => snake.remove(child));
    snakeBody.forEach(segment => {
        const segmentMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        segmentMesh.position.set(
            segment.x * CELL_SIZE - WIDTH / 2 + CELL_SIZE / 2,
            segment.y * CELL_SIZE - HEIGHT / 2 + CELL_SIZE / 2,
            0
        );
        snake.add(segmentMesh);
    });
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    document.getElementById('playButton').style.display = 'block';
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize the game
init();
