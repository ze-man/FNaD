const STARTUP_SCREEN = document.getElementById('startup-screen');
const MENU_SCREEN = document.getElementById('menu-screen');
const GAME_SCREEN = document.getElementById('game-screen');
const CUSTOM_MENU = document.getElementById('custom-menu');
const TIME_EL = document.getElementById('time');
const POWER_EL = document.getElementById('power');
const NIGHT_EL = document.getElementById('night-info');
const CAM_DISPLAY = document.getElementById('cam-display');
const CAMERA_VIEW = document.getElementById('camera-view');
const JUMPSCARE = document.getElementById('jumpscare');
const LEFT_DOOR_BTN = document.getElementById('left-door');
const RIGHT_DOOR_BTN = document.getElementById('right-door');
const LEFT_LIGHT_BTN = document.getElementById('left-light');
const RIGHT_LIGHT_BTN = document.getElementById('right-light');

let currentNight = 1;
let diddyLevel = 1;
let power = 100;
let time = 0; // 0 = 12AM, 360 = 6AM (simulated minutes)
let diddyPosition = 'stage'; // stage, left-hall, right-hall, left-door, right-door
let leftDoorClosed = false;
let rightDoorClosed = false;
let leftLightOn = false;
let rightLightOn = false;
let camerasOpen = false;
let gameInterval;
let powerInterval;

const roomImages = {
    stage: 'https://thumbs.dreamstime.com/z/abandoned-arcade-depicted-vintage-machines-under-red-neon-lights-scene-shows-disarray-urban-decay-also-357965764.jpg',
    'left-hall': 'https://thumbs.dreamstime.com/b/exploring-ominous-dark-hallway-horror-games-atmosphere-abandoned-asylum-game-shrouded-darkness-flickering-359854368.jpg',
    'right-hall': 'https://thumbs.dreamstime.com/b/exploring-ominous-dark-hallway-horror-games-atmosphere-abandoned-asylum-game-shrouded-darkness-flickering-359854368.jpg'
};

function startMenu() {
    STARTUP_SCREEN.style.display = 'none';
    MENU_SCREEN.style.display = 'block';
}

function showCustom() {
    CUSTOM_MENU.style.display = 'block';
}

function startCustom() {
    diddyLevel = parseInt(document.getElementById('diddy-level').value);
    startGame(diddyLevel, true);
}

function startGame(level, isCustom = false) {
    currentNight = isCustom ? 'Custom' : level;
    diddyLevel = level;
    MENU_SCREEN.style.display = 'none';
    GAME_SCREEN.style.display = 'block';
    NIGHT_EL.textContent = `Night: ${currentNight}`;
    resetGameState();
    gameInterval = setInterval(updateGame, 1000); // Update every second
    powerInterval = setInterval(drainPower, 1000);
}

function resetGameState() {
    power = 100;
    time = 0;
    diddyPosition = 'stage';
    leftDoorClosed = false;
    rightDoorClosed = false;
    leftLightOn = false;
    rightLightOn = false;
    camerasOpen = false;
    updateButtons();
    updateTime();
    updatePower();
}

function updateButtons() {
    LEFT_DOOR_BTN.textContent = leftDoorClosed ? 'Open Left Door' : 'Close Left Door';
    RIGHT_DOOR_BTN.textContent = rightDoorClosed ? 'Open Right Door' : 'Close Right Door';
    LEFT_LIGHT_BTN.textContent = leftLightOn ? 'Left Light Off' : 'Left Light';
    RIGHT_LIGHT_BTN.textContent = rightLightOn ? 'Right Light Off' : 'Right Light';
}

function toggleLeftDoor() {
    leftDoorClosed = !leftDoorClosed;
    updateButtons();
}

function toggleRightDoor() {
    rightDoorClosed = !rightDoorClosed;
    updateButtons();
}

function toggleLeftLight() {
    leftLightOn = !leftLightOn;
    updateButtons();
    if (leftLightOn && diddyPosition === 'left-door') {
        alert('Diddy is at the left door!');
    }
}

function toggleRightLight() {
    rightLightOn = !rightLightOn;
    updateButtons();
    if (rightLightOn && diddyPosition === 'right-door') {
        alert('Diddy is at the right door!');
    }
}

function toggleCameras() {
    camerasOpen = !camerasOpen;
    CAMERA_VIEW.style.display = camerasOpen ? 'block' : 'none';
}

function viewCam(room) {
    CAM_DISPLAY.innerHTML = `<img src="${roomImages[room]}" alt="${room}">`;
    if (diddyPosition === room) {
        CAM_DISPLAY.innerHTML += `<img src="https://nintendosoup.com/wp-content/uploads/2025/05/donkeykong-diddykong-new-art-may212025.webp" class="diddy-in-cam" alt="Diddy">`;
    }
}

function drainPower() {
    let drain = 0;
    if (leftDoorClosed) drain += 2;
    if (rightDoorClosed) drain += 2;
    if (leftLightOn) drain += 1;
    if (rightLightOn) drain += 1;
    if (camerasOpen) drain += 1;
    power -= drain;
    if (power < 0) power = 0;
    updatePower();
    if (power === 0) {
        triggerJumpscare();
    }
}

function updatePower() {
    POWER_EL.textContent = `Power: ${power}%`;
}

function updateTime() {
    const hours = Math.floor(time / 60) + 12;
    TIME_EL.textContent = `${hours % 12 || 12} AM`;
    if (time >= 360) {
        winNight();
    }
}

function updateGame() {
    time += 1; // Simulate time passing
    updateTime();
    moveDiddy();
    checkAttack();
}

function moveDiddy() {
    const moveChance = diddyLevel / 20; // Higher level = higher chance
    if (Math.random() < moveChance) {
        switch (diddyPosition) {
            case 'stage':
                diddyPosition = Math.random() < 0.5 ? 'left-hall' : 'right-hall';
                break;
            case 'left-hall':
                diddyPosition = 'left-door';
                break;
            case 'right-hall':
                diddyPosition = 'right-door';
                break;
            case 'left-door':
            case 'right-door':
                // Stay or reset if blocked
                if (Math.random() < 0.3) diddyPosition = 'stage';
                break;
        }
    }
}

function checkAttack() {
    if ((diddyPosition === 'left-door' && !leftDoorClosed) || (diddyPosition === 'right-door' && !rightDoorClosed)) {
        triggerJumpscare();
    }
}

function triggerJumpscare() {
    clearInterval(gameInterval);
    clearInterval(powerInterval);
    JUMPSCARE.style.display = 'block';
    setTimeout(() => {
        alert('Game Over! Diddy got you.');
        location.reload();
    }, 2000);
}

function winNight() {
    clearInterval(gameInterval);
    clearInterval(powerInterval);
    alert(`You survived Night ${currentNight}!`);
    location.reload();
}
