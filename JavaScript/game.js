// Object to store registered users from local storage
let registeredUsers = {};

// Retrieve registered users from local storage if available
if (localStorage.getItem('registeredUsers')) {
    registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
}

// Object to store user scores from local storage or initialize an empty object
let userScores = JSON.parse(localStorage.getItem('userScores')) || {};

// HTML canvas and rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initial game settings
let difficulty = "";
let obstacleSpeed = 3;

// Background image for the game
const backgroundImage = new Image();
backgroundImage.src = 'https://img.itch.zone/aW1nLzEzMTI4NDYuZ2lm/original/figmQY.gif';

// Player cube object
const cube = {
    x: canvas.width / 2,
    y: canvas.height - 59,
    width: 45,
    height: 45,
    speed: 5,
    hasShield: false,
};

// Audio objects for game sounds
const heartBuffSound = new Audio('../Project Web/sounds/heart.mp3');
const awardSound = new Audio('../Project Web/sounds/shield.mp3');

// Images for player cube, buffs, and obstacles
const cubeImage = new Image();
cubeImage.src = '../Project Web/images/player.png';

const shieldBuffImage = new Image();
shieldBuffImage.src = '../Project Web/images/award.png';

const heartEmptyImage = new Image();
heartEmptyImage.src = '../Project Web/images/Life_Empty.png';

const heartFilledImage = new Image();
heartFilledImage.src = '../Project Web/images/life.png';

const heartBuffImage = new Image();
heartBuffImage.src = '../Project Web/images/Health_Buff.png';

// Dimensions for health buff
const heartBuffWidth = 40;
const heartBuffHeight = 40;

// Animation variables
let frameIndex = 0;
const framesCount = 1;

// Array to store obstacles
const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;

// Image for obstacles
const obstacleImage = new Image();
obstacleImage.src = 'https://art.pixilart.com/ef16558ea222605.png';

// Game state variables
let gameOver = false;
let score = 0;
let scoreInterval;

let immuneToCollisions = false;
let immuneEndTime;

// Player hearts and life variables
const hearts = [];
const heartWidth = 30;
const heartHeight = 30;
const maxHearts = 3;
let lives = 3; // Number of lives

function initializeHearts() {
    for (let i = 0; i < maxHearts; i++) {
        hearts.push({ x: canvas.width - (i + 1) * (heartWidth + 5), y: 10, filled: i < lives });
    }
}

document.addEventListener("keydown", moveCube);

function moveCube(event) {//controls of the player 
    if (gameOver) return;

    if (event.key === "A" || event.key === "a") {
        cube.speed = -5;
    } else if (event.key === "D" || event.key === "d") {
        cube.speed = 5;
    }
}

function updateCubePosition() {//adjust the position based on the speed given
    const newCubeX = cube.x + cube.speed;

    if (newCubeX >= 0 && newCubeX + cube.width <= canvas.width) {
        cube.x = newCubeX;
    }
}

function drawCube() { //Function to draw the player cube 
    if (cube.hasShield) {
        ctx.fillStyle = "gray";
        ctx.fillRect(cube.x, cube.y, cube.width, cube.height);
    } else {
        ctx.drawImage(
            cubeImage,
            frameIndex * (cubeImage.width / framesCount),
            0,
            cubeImage.width / framesCount,
            cubeImage.height,
            cube.x,
            cube.y,
            cube.width,
            cube.height
        );
    }

    frameIndex = (frameIndex + 1) % framesCount;
//draws a gray overlay on the box to show that the user has immunity
    if (immuneToCollisions && Date.now() < immuneEndTime) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(cube.x, cube.y, cube.width, cube.height);
    }
}

function drawHearts() {//draws the heats of the player 
    for (let i = 0; i < maxHearts; i++) {
        const heart = hearts[i];
        const heartImage = heart.filled ? heartFilledImage : heartEmptyImage;
        ctx.drawImage(heartImage, heart.x, heart.y, heartWidth, heartHeight);
    }
}

function drawObstacles() { //spawns and draws obstacles wherever it is shieldbuff, heartbuff or just a normal projectile 
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
//draws the recognised image for the specific object
        if (obstacle.type === "shieldBuff") {
            ctx.drawImage(shieldBuffImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
        } else if (obstacle.type === "heartBuff") {
            ctx.drawImage(heartBuffImage, obstacle.x, obstacle.y, heartBuffWidth, heartBuffHeight);
        } else {
            ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
        }
//move object down the canvas 
        obstacle.y += obstacleSpeed;

        if (collision(cube, obstacle)) {
            if (obstacle.type === "shieldBuff") {
                obstacles.splice(i, 1);
                activateImmunity();
                // Play the award sound
                awardSound.play();
            } else if (obstacle.type === "heartBuff") {
                obstacles.splice(i, 1);
                fillHeart();
                // Play the heart buff sound
                heartBuffSound.play();
            } else {
                respawnCube();
                removeLife();
            }
        }
    }
}
// Function to check for collisions between two objects
function collision(object1, object2) {
    if (immuneToCollisions) {
        return false;
    }
 // If the player has a shield, activate immunity and remove the shield
    if (cube.hasShield) {
        activateImmunity();
        cube.hasShield = false;
        return false;
    }
   // Check for collision using bounding boxes
    return (
        object1.x < object2.x + obstacleWidth &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + obstacleHeight &&
        object1.y + object1.height > object2.y
    );
}
// Function to activate immunity to collisions
function activateImmunity() {
    immuneToCollisions = true;
    immuneEndTime = Date.now() + 2000;
}
// Function to fill a heart in the player's lives
function fillHeart() {
    if (lives < maxHearts) {
        lives++;
        hearts[lives - 1].filled = true;
    }
}
// Function to respawn the player cube
function respawnCube() {
    cube.x = canvas.width / 2;
    cube.y = canvas.height - 59;
    activateImmunity();
}
// Function to remove a life from the player
function removeLife() {
    lives--;

    // Update heart images
    for (let i = 0; i < maxHearts; i++) {
        hearts[i].filled = i < lives;
    }

    if (lives === 0) {
        gameOver = true;
        const backgroundMusic = document.getElementById("backgroundMusic");
        backgroundMusic.pause();
        openGameOverModal();
    }
}    // End the game if there are no more lives
// Function to update the state of immunity to collisions
function updateImmunityState() {
    if (immuneToCollisions && Date.now() > immuneEndTime) {
        immuneToCollisions = false;
    }
}
// Function to draw the game on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updateCubePosition();
        updateImmunityState();
        drawCube();
        drawHearts();
        drawObstacles();

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);

        requestAnimationFrame(draw);
    } else {
        // Save the final score in local storage and update the user's score if higher
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser && registeredUsers[loggedInUser]) {
            const currentScore = score;
            const previousScore = userScores[loggedInUser] || 0;

            // Update the user's score only if the new score is higher
            if (currentScore > previousScore) {
                userScores[loggedInUser] = currentScore;
                localStorage.setItem('userScores', JSON.stringify(userScores));
                sessionStorage.setItem('finalScore', currentScore);
            }
        }
// Open the game over modal and pause background music
        openGameOverModal();
        const backgroundMusic = document.getElementById("backgroundMusic");
        backgroundMusic.pause();
    }
}
// Function to start the score update interval
function startScoreInterval() {
    scoreInterval = setInterval(() => {
        if (!gameOver) {
            let scoreIncrement = 1;
            switch (difficulty) {
                case "easy":
                    scoreIncrement = 1;
                    break;
                case "medium":
                    scoreIncrement = 2;
                    break;
                case "hard":
                    scoreIncrement = 3;
                    break;
                default:
                    scoreIncrement = 1;
            }

            score += scoreIncrement;
        }
    }, 500);
}
// Function to spawn obstacles periodically
function spawnObstacle() {
    if (!gameOver) {
        const x = Math.random() * (canvas.width - obstacleWidth);
        const randomValue = Math.random();

        if (randomValue < 0.04) { // Adjust the spawn rate of shields (4% chance)
            obstacles.push({ x, y: 0, type: "shieldBuff" });
        } else if (randomValue < 0.02) { // Adjust the spawn rate of hearts (2% chance)
            obstacles.push({ x, y: 0, type: "heartBuff" });
        } else {
            obstacles.push({ x, y: 0 });
        }

        setTimeout(spawnObstacle, 2000 / obstacleSpeed); // Adjust the timeout for the spawn rate
    }
}
// Function to spawn heart buffs periodically
function spawnHeartBuff() {
    if (!gameOver) {
        const x = Math.random() * (canvas.width - heartBuffWidth); // Adjust the width of the health buff
        obstacles.push({ x, y: 0, type: "heartBuff" });
        setTimeout(spawnHeartBuff, 15000); // Adjust the timeout for the spawn rate of health buffs
    }
}
// Function to set the game difficulty based on user selection
function setDifficulty() {
    const select = document.getElementById("difficulty");
    difficulty = select.options[select.selectedIndex].value;

    // Check if a difficulty is selected
    if (!difficulty) {
        // Set a default difficulty if none is selected
        difficulty = "easy";
    }        // Adjust obstacle speed based on difficulty
    if (difficulty) {
        document.getElementById("startButton").removeAttribute("disabled");

        switch (difficulty) {
            case "easy":
                obstacleSpeed = 5;
                break;
            case "medium":
                obstacleSpeed = 7;
                break;
            case "hard":
                obstacleSpeed = 9;
                break;
            default:
                obstacleSpeed = 3;
        }
    }
}

function startGame() {//Function to start game
    if (difficulty) {
        initializeHearts();
        const backgroundMusic = document.getElementById("backgroundMusic");
        backgroundMusic.play();

        spawnObstacle();
        spawnHeartBuff();
        startScoreInterval();
        draw();
        document.getElementById("difficulty").setAttribute("disabled", "true");
        document.getElementById("startButton").setAttribute("disabled", "true");
    }
}
//event listener for difficulty to be selected
document.getElementById("difficulty").addEventListener("change", setDifficulty);
document.getElementById("startButton").addEventListener("click", startGame);

function openGameOverModal() {//opens game over window
    const modal = document.getElementById("gameOverModal");
    const finalScoreSpan = document.getElementById("finalScore");
    finalScoreSpan.textContent = score;
    modal.style.display = "block";

    const gameOverSound = document.getElementById("gameOverSound");
    gameOverSound.play();
}

function closeGameOverModal() {//if the quit is selected the game restarts 
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    document.location.reload();
}

function restartGame() {//restarts the game 
    document.location.reload();
}
