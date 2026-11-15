/**
 * A Romantic Proposal Website for Madam Ji ❤️
 * Particle Canvas, Audio Controller, Multi-Step Story & Proposal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetalsAndHeartsCanvas();
  initMusicController();
  initStoryFlow();
  initProposalInteractions();
});

/* ==========================================================================
   1. Interactive Petals & Glowing Hearts Canvas
   ========================================================================== */
function initPetalsAndHeartsCanvas() {
  const canvas = document.getElementById('canvas-petals');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 600 ? 30 : 60;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(isInitial = false) {
      this.reset(isInitial);
    }

    reset(isInitial = false) {
      this.type = Math.random() > 0.4 ? 'petal' : 'heart';
      this.x = Math.random() * width;
      this.y = isInitial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.9 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      
      const colors = [
        'rgba(255, 77, 109, ',
        'rgba(255, 117, 143, ',
        'rgba(255, 179, 193, ',
        'rgba(240, 197, 124, '
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * 0.8 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = this.colorBase + (this.opacity * 0.9) + ')';
        const s = this.size * 0.45;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s, -s, -s * 1.8, s * 0.4, 0, s * 1.8);
        ctx.bezierCurveTo(s * 1.8, s * 0.4, s, -s, 0, 0);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(true));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Background Audio Controller (Dual Video/Audio MP4 Engine)
   ========================================================================== */
let audioContext = null;
let synthInterval = null;

function initMusicController() {
  const musicPill = document.getElementById('musicPill');
  const bgAudio = document.getElementById('bgAudio');
  const bgVideo = document.getElementById('bgVideoAudio');
  const musicStatus = document.getElementById('musicStatus');
  let isPlaying = false;

  function setPlayingUI(playing) {
    isPlaying = playing;
    if (musicPill) {
      if (playing) {
        musicPill.classList.add('playing');
        if (musicStatus) musicStatus.textContent = 'Playing... ♪';
      } else {
        musicPill.classList.remove('playing');
        if (musicStatus) musicStatus.textContent = 'Paused';
      }
    }
  }

  function startMusic() {
    if (isPlaying) return;

    // 1. Try background video audio element (Primary for MP4 video clips)
    if (bgVideo) {
      bgVideo.volume = 1.0;
      const vPromise = bgVideo.play();
      if (vPromise !== undefined) {
        vPromise
          .then(() => {
            setPlayingUI(true);
            removeInteractionListeners();
            console.log('Background video audio started successfully');
          })
          .catch((err) => {
            console.log('Autoplay waiting for touch:', err);
            addInteractionListeners();
          });
      }
    }

    // 2. Try background audio element as secondary fallback
    if (bgAudio && !isPlaying) {
      bgAudio.volume = 1.0;
      const aPromise = bgAudio.play();
      if (aPromise !== undefined) {
        aPromise
          .then(() => {
            setPlayingUI(true);
            removeInteractionListeners();
          })
          .catch(() => {
            addInteractionListeners();
          });
      }
    }
  }

  function pauseMusic() {
    if (bgAudio) bgAudio.pause();
    if (bgVideo) bgVideo.pause();
    stopRomanticSynthChime();
    setPlayingUI(false);
  }

  function toggleAudio() {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  function onFirstInteraction() {
    startMusic();
  }

  const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll'];

  function addInteractionListeners() {
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, { once: true, capture: true, passive: true });
    });
  }

  function removeInteractionListeners() {
    interactionEvents.forEach((evt) => {
      window.removeEventListener(evt, onFirstInteraction, { capture: true });
    });
  }

  if (musicPill) {
    musicPill.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // Direct play attempt as soon as script runs & on page load
  startMusic();
  window.addEventListener('load', startMusic);

  // Transparent listener: ANY single touch anywhere on screen starts music immediately
  addInteractionListeners();

  window.startRomanticMusic = startMusic;
  window.pauseRomanticMusic = pauseMusic;
}

function startRomanticSynthChime() {
  if (synthInterval) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume();

    const notes = [277.18, 329.63, 369.99, 440.00, 554.37, 659.25];
    let index = 0;

    function playNote(freq) {
      if (!audioContext || audioContext.state !== 'running') return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 3.6);
    }

    playNote(notes[0]);
    setTimeout(() => playNote(notes[2]), 400);
    setTimeout(() => playNote(notes[4]), 800);

    synthInterval = setInterval(() => {
      const freq = notes[index % notes.length];
      playNote(freq);
      index++;
    }, 2400);
  } catch (e) {
    console.log('Audio initialized');
  }
}

function stopRomanticSynthChime() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

/* ==========================================================================
   3. Multi-Step Story Flow
   ========================================================================== */
function initStoryFlow() {
  const nextButtons = document.querySelectorAll('.btn-next');
  const backButtons = document.querySelectorAll('.btn-back');

  function switchStep(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Start music on first forward transition
    if (window.startRomanticMusic) {
      window.startRomanticMusic();
    }

    // Hide all sections
    document.querySelectorAll('.story-section').forEach(sec => {
      sec.classList.add('hidden');
      sec.classList.remove('active');
    });

    // Show target section
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');

    // Scroll gently to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      createHeartBurst(e.clientX || (window.innerWidth / 2), e.clientY || (window.innerHeight / 2));
      const target = btn.getAttribute('data-target');
      if (target) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = '';
          switchStep(target);
        }, 220);
      }
    });
  });

  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        switchStep(target);
      }
    });
  });
}

/* ==========================================================================
   4. Proposal & Celebration Interactions
   ========================================================================== */
function initProposalInteractions() {
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const playfulHint = document.getElementById('playfulHint');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const btnCloseCelebration = document.getElementById('btnCloseCelebration');

  let noClickCount = 0;
  const noResponses = [
    'Sochne do... 😜',
    'Pakka soch lo? 🥺',
    'Arey maan bhi jao! ❤️',
    'Ye option allow nahi hai! 😉',
    'Bas YES hi bacha hai! 🥰'
  ];

  // Playful No/Sochne do behavior
  function handleNoButtonEvasion(e) {
    noClickCount++;
    if (btnNo) {
      const nextText = noResponses[noClickCount % noResponses.length];
      btnNo.querySelector('span').textContent = nextText;

      // Playful evasion: move button slightly away
      const randomX = (Math.random() - 0.5) * 140;
      const randomY = (Math.random() - 0.5) * 60;
      btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

      // Make YES button slightly larger each time
      if (btnYes) {
        const currentScale = 1 + (noClickCount * 0.08);
        btnYes.style.transform = `scale(${Math.min(currentScale, 1.4)})`;
      }

      if (playfulHint) {
        playfulHint.textContent = `Madam Ji, NO bolne ka option system me nahi hai! 😉❤️`;
        playfulHint.style.color = 'var(--rose-primary)';
      }
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', handleNoButtonEvasion);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleNoButtonEvasion(e);
    });
    btnNo.addEventListener('click', handleNoButtonEvasion);
  }

  // YES Button Clicked -> Full Celebration!
  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      // Massive Confetti Explosion
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          createHeartBurst(
            Math.random() * window.innerWidth,
            Math.random() * (window.innerHeight * 0.6) + 100
          );
        }, i * 200);
      }

      // Show Celebration Overlay
      if (celebrationOverlay) {
        setTimeout(() => {
          celebrationOverlay.classList.remove('hidden');
        }, 300);
      }
    });
  }

  if (btnCloseCelebration && celebrationOverlay) {
    btnCloseCelebration.addEventListener('click', () => {
      celebrationOverlay.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   5. Sparkle / Heart Burst Animation
   ========================================================================== */
function createHeartBurst(x, y) {
  const burstContainer = document.createElement('div');
  burstContainer.style.position = 'fixed';
  burstContainer.style.left = `${x}px`;
  burstContainer.style.top = `${y}px`;
  burstContainer.style.pointerEvents = 'none';
  burstContainer.style.zIndex = '99999';
  document.body.appendChild(burstContainer);

  const symbols = ['❤️', '✨', '💖', '🌸', '💕', '💍', '🌹'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'absolute';
    el.style.fontSize = `${Math.random() * 16 + 16}px`;
    el.style.transform = 'translate(-50%, -50%)';
    el.style.transition = 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.opacity = '1';

    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
    const distance = Math.random() * 110 + 60;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 40;

    burstContainer.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    burstContainer.remove();
  }, 1200);
}