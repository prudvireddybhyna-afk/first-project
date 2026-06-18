const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
const button = document.getElementById('partyButton');
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createPiece() {
  return {
    x: randomRange(0, canvas.width),
    y: randomRange(-20, canvas.height / 2),
    size: randomRange(8, 16),
    rotation: randomRange(0, Math.PI * 2),
    speedY: randomRange(2, 5),
    speedX: randomRange(-1.5, 1.5),
    rotationSpeed: randomRange(-0.08, 0.08),
    color: `hsl(${randomRange(330, 50)}, 90%, 70%)`,
  };
}

function initConfetti() {
  confetti = Array.from({ length: 120 }, createPiece);
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    if (piece.y > canvas.height + piece.size) {
      Object.assign(piece, createPiece(), { y: -piece.size });
    }

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
    ctx.restore();
  });

  requestAnimationFrame(updateConfetti);
}

const burstOverlay = document.getElementById('celebrationBurst');
const successScreen = document.getElementById('successScreen');
const partyTimeButton = document.getElementById('partyTimeButton');
const backToStartButton = document.getElementById('backToStartButton');
const backToSuccessButton = document.getElementById('backToSuccessButton');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmYesButton = document.getElementById('confirmYesButton');
const confirmNoButton = document.getElementById('confirmNoButton');
const treasureOverlay = document.getElementById('treasureOverlay');
const treasureYesButton = document.getElementById('treasureYesButton');
const treasureNoButton = document.getElementById('treasureNoButton');
const punchOverlay = document.getElementById('punchOverlay');
const thankYouOverlay = document.getElementById('thankYouOverlay');
const finalCakeMessageOverlay = document.getElementById('finalCakeMessageOverlay');
const cakeOverlay = document.getElementById('cakeOverlay');
const cakeMessage = document.querySelector('.cake-message');
const cakeCongratsMessage = document.getElementById('cakeCongratsMessage');
const birthdayFinalMessage = document.getElementById('birthdayFinalMessage');
const pageShell = document.querySelector('.page-shell');

function triggerConfettiBurst() {
  const burst = Array.from({ length: 80 }, () => ({
    x: randomRange(0, canvas.width),
    y: canvas.height + 10,
    size: randomRange(10, 20),
    rotation: randomRange(0, Math.PI * 2),
    speedY: randomRange(-9, -5),
    speedX: randomRange(-3, 3),
    rotationSpeed: randomRange(0.08, 0.18),
    color: `hsl(${randomRange(0, 360)}, 95%, 65%)`,
  }));
  confetti.push(...burst);
}

function hideAllScreens() {
  pageShell.classList.add('hidden');
  successScreen.classList.add('hidden');
  cakeOverlay.classList.add('hidden');
  confirmOverlay.classList.add('hidden');
  treasureOverlay.classList.add('hidden');
  punchOverlay.classList.add('hidden');
  thankYouOverlay.classList.add('hidden');
  finalCakeMessageOverlay.classList.add('hidden');
}

function showConfirmOverlay() {
  confirmOverlay.classList.remove('hidden');
}

function hideConfirmOverlay() {
  confirmOverlay.classList.add('hidden');
}

function showTreasureOverlay() {
  treasureOverlay.classList.remove('hidden');
}

function hideTreasureOverlay() {
  treasureOverlay.classList.add('hidden');
}

function showPunchOverlay() {
  punchOverlay.classList.remove('hidden');
}

function hidePunchOverlay() {
  punchOverlay.classList.add('hidden');
}

function showThankYouOverlay() {
  thankYouOverlay.classList.remove('hidden');
}

function hideThankYouOverlay() {
  thankYouOverlay.classList.add('hidden');
}

function showFinalCakeMessageOverlay() {
  finalCakeMessageOverlay.classList.remove('hidden');
}

function hideFinalCakeMessageOverlay() {
  finalCakeMessageOverlay.classList.add('hidden');
}

function renderScreen(screen) {
  hideAllScreens();
  if (screen === 'start') {
    pageShell.classList.remove('hidden');
  } else if (screen === 'success') {
    successScreen.classList.remove('hidden');
    burstOverlay.classList.add('active');
    triggerConfettiBurst();
    setTimeout(() => burstOverlay.classList.remove('active'), 1400);
  } else if (screen === 'cake') {
    cakeMessage.textContent = 'Cutting into your next celebration!';
    cakeCongratsMessage.classList.add('hidden');
    cakeCongratsMessage.classList.remove('show');
    birthdayFinalMessage.classList.add('hidden');
    birthdayFinalMessage.classList.remove('show');
    hideFinalCakeMessageOverlay();
    cakeOverlay.classList.remove('hidden');
    cakeOverlay.classList.add('active');
  }
}

function showScreen(screen) {
  if (screen === 'start') {
    window.location.hash = '';
  } else if (screen === 'success') {
    window.location.hash = '#success';
  } else if (screen === 'cake') {
    window.location.hash = '#cake';
  }
  renderScreen(screen);
}

function animateCakeCut() {
  cakeOverlay.classList.add('active');
  setTimeout(() => {
    cakeOverlay.classList.remove('active');
    cakeOverlay.classList.add('hidden');
    showFinalCakeMessageOverlay();
    setTimeout(() => {
      hideFinalCakeMessageOverlay();
      cakeOverlay.classList.remove('hidden');
    }, 2800);
  }, 2400);
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash === '#success') {
    renderScreen('success');
  } else if (hash === '#cake') {
    renderScreen('cake');
  } else {
    renderScreen('start');
  }
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('resize', resizeCanvas);
button.addEventListener('click', () => {
  button.classList.add('active');
  setTimeout(() => button.classList.remove('active'), 800);
  showScreen('success');
});

partyTimeButton.addEventListener('click', () => {
  showConfirmOverlay();
});

confirmYesButton.addEventListener('click', () => {
  hideConfirmOverlay();
  showTreasureOverlay();
});

confirmNoButton.addEventListener('click', () => {
  hideConfirmOverlay();
});

treasureYesButton.addEventListener('click', () => {
  hideTreasureOverlay();
  showThankYouOverlay();
  setTimeout(() => {
    hideThankYouOverlay();
    showScreen('cake');
    animateCakeCut();
  }, 1800);
});

treasureNoButton.addEventListener('click', () => {
  hideTreasureOverlay();
  showPunchOverlay();
  setTimeout(() => {
    hidePunchOverlay();
    showScreen('success');
  }, 1600);
});

backToStartButton.addEventListener('click', () => {
  showScreen('start');
});

backToSuccessButton.addEventListener('click', () => {
  showScreen('success');
});

window.addEventListener('hashchange', handleHashChange);
showScreen('start');
resizeCanvas();
initConfetti();
updateConfetti();
