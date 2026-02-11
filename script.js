// Basic game variables
let gameState = {
  night: 1,
  maxNight: 5,
  customNight: false,
  gameOver: false,
  power: 100,
  cameraIndex: 0,
  doors: { left: false, right: false },
  lights: { left: false, right: false },
  dippyTwitch: false,
  saveData: {}
};

// Load save data
if(localStorage.getItem('fnafDiddySave')){
  gameState.saveData = JSON.parse(localStorage.getItem('fnafDiddySave'));
  if(gameState.saveData.night){
    gameState.night = gameState.saveData.night;
  }
}

const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
const gameDiv = document.getElementById('game');
const gameOverDiv = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const camImage = document.getElementById('camImage');
const gameMsg = document.getElementById('gameMsg');

const doorLeftBtn = document.getElementById('doorLeft');
const doorRightBtn = document.getElementById('doorRight');
const lightLeftBtn = document.getElementById('lightLeft');
const lightRightBtn = document.getElementById('lightRight');

const timeDisplay = document.getElementById('time');
const powerDisplay = document.getElementById('power');

const camButtons = document.querySelectorAll('.camBtn');

let gameInterval;
let staticNoise = ['https://i.imgur.com/4AiXzf8.png']; // static overlay

// Start game
startBtn.onclick = () => {
  startMenu.style.display = 'none';
  gameDiv.style.display = 'block';
  initGame();
};

// Restart game
restartBtn.onclick = () => {
  location.reload();
};

function initGame() {
  gameState.gameOver = false;
  gameState.power = 100;
  gameState.night = 1;
  gameState.cameraIndex = 0;
  gameState.doors.left = false;
  gameState.doors.right = false;
  gameState.lights.left = false;
  gameState.lights.right = false;
  gameMsg.innerText = '';
  updateStatus();

  // Animate Diddy twitching on start
  animateDiddy();

  // Start game loop
  gameInterval = setInterval(gameTick, 1000);
}

function animateDiddy() {
  // For simplicity, toggle a class for twitching
  // You can replace with more complex animation if desired
  // Placeholder: just log twitch
  gameState.dippyTwitch = true;
  setTimeout(() => {
    gameState.dippyTwitch = false;
  }, 500);
}

function updateStatus() {
  timeDisplay.innerText = `Night: ${gameState.night}`;
  powerDisplay.innerText = `Power: ${gameState.power}%`;
}

function gameTick() {
  if (gameState.gameOver) {
    clearInterval(gameInterval);
    return;
  }
  // Decrease power
  gameState.power -= Math.random() * 2; // random drain
  if (gameState.power < 0) gameState.power = 0;
  updateStatus();

  // Check for security breach
  if (
    (gameState.doors.left && (Math.random() < 0.05)) || // chance Diddy attacks if door open
    (gameState.doors.right && (Math.random() < 0.05))
  ) {
    triggerGameOver();
  }

  // Check for night end
  if (gameState.power <= 0) {
    triggerGameOver();
  }

  // Randomly spawn Diddy or animatronic
  if (Math.random() < 0.01) {
    // Diddy appears in camera
    displayCamera(Math.floor(Math.random() * 11));
  }
}

// Camera display
function displayCamera(index) {
  gameState.cameraIndex = index;
  // For demo, show a static image or color
  let images = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.1&auto=format&fit=crop&w=640&q=80'
  ];

  camImage.src = staticNoise[Math.floor(Math.random() * staticNoise.length)];
  // Add static noise overlay
  camImage.style.filter = 'brightness(0.7) contrast(1.2)';
}

document.querySelectorAll('.camBtn').forEach(btn => {
  btn.onclick = () => {
    displayCamera(parseInt(btn.dataset.cam));
  };
});

// Door controls
doorLeftBtn.onmousedown = () => {
  gameState.doors.left = true;
};
doorLeftBtn.onmouseup = () => {
  gameState.doors.left = false;
};
doorRightBtn.onmousedown = () => {
  gameState.doors.right = true;
};
doorRightBtn.onmouseup = () => {
  gameState.doors.right = false;
};

// Light controls
lightLeftBtn.onclick = () => {
  gameState.lights.left = !gameState.lights.left;
  // Optional: change button appearance
  lightLeftBtn.style.backgroundColor = gameState.lights.left ? 'yellow' : '';
};
lightRightBtn.onclick = () => {
  gameState.lights.right = !gameState.lights.right;
  lightRightBtn.style.backgroundColor = gameState.lights.right ? 'yellow' : '';
};

// Trigger game over
function triggerGameOver() {
  clearInterval(gameInterval);
  document.getElementById('gameOver').classList.remove('hidden');
  gameState.gameOver = true;
}

// Save game progress
function saveGame() {
  localStorage.setItem('fnafDiddySave', JSON.stringify({ night: gameState.night }));
}

// Night progression (for demo, automatically go to next night after some time)
setTimeout(() => {
  if (!gameState.gameOver && gameState.night < gameState.maxNight) {
    gameState.night++;
    updateStatus();
    saveGame();
  }
}, 60000); // after 1 min, advance to next night (for demo purposes)
