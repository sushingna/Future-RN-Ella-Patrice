/* ============================================
   NURSING QUEST — SCRIPT
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'nursingQuestSaveV2';

  const QUEST_XP = {
    study: 100,
    duty: 150,
    exam: 200,
    grass: 100,
    hydration: 50,
    compare: 200
  };
  const TOTAL_QUESTS = Object.keys(QUEST_XP).length;
  const MAX_QUEST_XP = Object.values(QUEST_XP).reduce((a, b) => a + b, 0); // 800
  const MESSAGE_UNLOCK_THRESHOLD = 3;

  const JOKES = [
    "Nursing school: where 'I'll study later' becomes a lifestyle. 😭",
    "You don't need caffeine. You need 14 hours of sleep. ☕💀",
    "Your reviewer has more pages than your future autobiography. 📚😭",
    "Vital signs stable. Mental health... pending. 🩺💀",
    "Nurse.exe has stopped responding. 💻🩺",
    "You studied everything except the thing that appeared on the exam. 😭📝",
    "Instructor: 'This is easy.' The question: 💀",
    "Sleep is important. Unfortunately, so is duty. 😭",
    "Current diagnosis: Academic Pagod Syndrome. 🩺😭",
    "Treatment plan: snack + water + 8 hours of sleep. 🧸",
    "Nursing students don't dream. We just black out for 6 hours. 😴",
    "My love language is someone else making my care plan for me. 📋💕",
    "I don't have a caffeine addiction, I have a survival strategy. ☕",
    "Duty starts at 6am. My will to live starts around 9. 🩺😭",
    "You know you're a nursing student when 'Netflix and chill' becomes 'NCLEX and cry'. 📺💀",
    "The reviewer said 'high priority.' Everything is high priority. Send help. 🚨",
    "I studied the wrong disease for 3 hours and I regret nothing. 😭📚",
    "Nursing school taught me two things: assessment first, and I'm always tired. 🩺",
    "My skincare routine is just crying in the clinical bathroom. ✨😭",
    "Group project meeting: 5 minutes of studying, 55 minutes of shared trauma. 💀"
  ];

  const MOTIVATION_MESSAGES = [
    "You've got this.",
    "One day at a time.",
    "You're doing better than you think.",
    "Take a break, future nurse.",
    "I'm rooting for you. 🧸",
    "You've survived this much already.",
    "Your future patients are lucky to have you.",
    "Don't forget to be proud of yourself.",
    "It's okay to rest. Resting is part of the work too.",
    "Small progress is still progress.",
    "You are allowed to be both tired and proud.",
    "Breathe. You're closer than you think.",
    "Every hard shift is teaching you something.",
    "You didn't come this far to stop now.",
    "Someone out there is grateful you chose this path.",
    "You're not behind. You're exactly on time for your own journey."
  ];

  const MESSAGE_PAGES = [
    [
      "I know nursing can get really stressful, especially when you feel like everyone's journey is moving differently.",
      "But being ahead doesn't mean you're leaving anyone behind."
    ],
    [
      "Everyone has their own timeline.",
      "You don't have to compare your progress with anyone else's. 🧸🩺💕"
    ],
    [
      "You've already made it this far, and that's something you should be proud of.",
      "Every small step still counts as progress."
    ],
    [
      "It's okay to feel tired sometimes.",
      "That doesn't mean you're weak, it means you're human and you're still showing up."
    ],
    [
      "You are exactly where you need to be right now.",
      "Trust the process, even when it feels messy."
    ],
    [
      "Every nurse before you felt exactly like this once.",
      "You are not alone in this journey."
    ],
    [
      "Keep going, future nurse. 🧸🩺💕",
      "— Francisco Dag-uman"
    ]
  ];

  const ACHIEVEMENT_DEFS = [
    { id: 'first_step', icon: '🏆', name: 'First Step', desc: 'Complete your first quest.' },
    { id: 'future_nurse', icon: '🩺', name: 'Future Nurse', desc: 'Complete 3 quests.' },
    { id: 'academic_warrior', icon: '📚', name: 'Academic Warrior', desc: 'Complete all quests.' },
    { id: 'still_standing', icon: '🧸', name: 'Still Standing', desc: 'Reach maximum XP.' },
    { id: 'actually_smiled', icon: '😂', name: 'Actually Smiled', desc: 'Click the joke button 10 times.' },
    { id: 'avocado_survivor', icon: '🥑', name: 'Avocado Survivor', desc: 'Unlock the bonus quest.' }
  ];

  const MEMORY_EMOJIS = ['🧸', '🩺', '🥑', '💕', '🌸', '🥤'];

  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- state ---------- */

  const QUEST_EFFECTS = {
    study:     { motivation: 10, sleep: -5,  stress: -10 },
    duty:      { energy: -10, motivation: 15, stress: -10 },
    exam:      { motivation: 20, sleep: -5,  stress: -20 },
    grass:     { energy: 15, sleep: 10, stress: -15 },
    hydration: { energy: 10, stress: -5 },
    compare:   { motivation: 15, stress: -10 }
  };

  const DEFAULT_STATUS = { energyLevel: 45, stressLevel: 85, sleepLevel: 10, motivationLevel: 75 };

  let state = {
    xp: 0,
    completedQuests: [],
    achievements: {},
    jokeClicks: 0,
    energyLevel: DEFAULT_STATUS.energyLevel,
    stressLevel: DEFAULT_STATUS.stressLevel,
    sleepLevel: DEFAULT_STATUS.sleepLevel,
    motivationLevel: DEFAULT_STATUS.motivationLevel,
    bonusUnlocked: false,
    finalUnlocked: false,
    memoryLevel: 3,
    settings: { sound: true, animations: true, dark: false }
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(state, parsed);
        state.settings = Object.assign({ sound: true, animations: true, dark: false }, parsed.settings || {});
      }
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function getLevel() {
    return 4 + Math.floor(state.xp / 150);
  }

  function applyAnimationSetting() {
    const off = !state.settings.animations || reduceMotion;
    document.body.classList.toggle('anim-off', off);
  }

  function applyDarkMode() {
    document.documentElement.setAttribute('data-theme', state.settings.dark ? 'dark' : 'light');
  }

  /* ---------- background music ---------- */

  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) bgMusic.volume = 0.45;

  function tryPlayMusic() {
    if (!bgMusic) return;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay with sound was blocked by the browser.
        // Start it on the very first click/tap anywhere on the page instead.
        const resumeOnInteract = () => {
          if (state.settings.sound) bgMusic.play().catch(() => {});
          document.removeEventListener('click', resumeOnInteract);
          document.removeEventListener('touchstart', resumeOnInteract);
        };
        document.addEventListener('click', resumeOnInteract, { once: true });
        document.addEventListener('touchstart', resumeOnInteract, { once: true });
      });
    }
  }

  function applySoundSetting() {
    if (!bgMusic) return;
    if (state.settings.sound) {
      tryPlayMusic();
    } else {
      bgMusic.pause();
    }
  }

  /* ---------- welcome gate ---------- */

  const welcomeOverlay = document.getElementById('welcome-overlay');
  const btnWelcomeStart = document.getElementById('btn-welcome-start');

  function dismissWelcome() {
    if (!welcomeOverlay) return;
    welcomeOverlay.classList.add('hidden');
    document.body.classList.remove('welcome-open');
  }

  if (btnWelcomeStart) {
    btnWelcomeStart.addEventListener('click', () => {
      if (state.settings.sound) tryPlayMusic();
      dismissWelcome();
    });
  }

  /* ---------- nursing status bars (home) ---------- */

  const STATUS_ELS = {
    energy:     { fill: document.getElementById('home-energy-fill'),     pct: document.getElementById('home-energy-pct') },
    stress:     { fill: document.getElementById('home-stress-fill'),     pct: document.getElementById('home-stress-pct') },
    sleep:      { fill: document.getElementById('home-sleep-fill'),      pct: document.getElementById('home-sleep-pct') },
    motivation: { fill: document.getElementById('home-motivation-fill'), pct: document.getElementById('home-motivation-pct') }
  };

  function setStatus(key, val) {
    val = Math.max(0, Math.min(100, Math.round(val)));
    state[key + 'Level'] = val;
    const els = STATUS_ELS[key];
    if (els && els.fill) els.fill.style.width = val + '%';
    if (els && els.pct) els.pct.textContent = val + '%';
    return val;
  }

  function adjustStatus(key, delta) {
    return setStatus(key, (state[key + 'Level'] ?? 0) + delta);
  }

  function applyQuestEffects(key) {
    const effects = QUEST_EFFECTS[key];
    if (!effects) return;
    Object.keys(effects).forEach((statKey) => adjustStatus(statKey, effects[statKey]));
  }

  function renderHomeStatus() {
    setStatus('energy', state.energyLevel);
    setStatus('stress', state.stressLevel);
    setStatus('sleep', state.sleepLevel);
    setStatus('motivation', state.motivationLevel);
  }

  /* ---------- toast helper ---------- */

  const toastLayer = document.getElementById('toast-layer');

  function showToast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    toastLayer.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 2200);
  }

  /* ---------- confetti ---------- */

  const confettiLayer = document.getElementById('confetti-layer');
  const CONFETTI_EMOJI = ['🎉', '✨', '💕', '🌸', '🧸', '🥑', '💖'];

  function launchConfetti(count) {
    if (!state.settings.animations || reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.textContent = CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.animationDuration = 2.5 + Math.random() * 2 + 's';
      piece.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  /* ---------- routing ---------- */

  const pages = Array.from(document.querySelectorAll('.page'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const bottomLinks = Array.from(document.querySelectorAll('.bottom-nav-link'));
  const VALID_ROUTES = pages.map((p) => p.dataset.route);

  function renderRoute(route) {
    pages.forEach((p) => p.classList.toggle('active', p.dataset.route === route));
    navLinks.forEach((l) => {
      if (l.dataset.route === route) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });
    bottomLinks.forEach((l) => {
      if (l.dataset.route === route) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    const active = document.getElementById('page-' + route);
    if (active) {
      const heading = active.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  function navigate(route, push) {
    if (!VALID_ROUTES.includes(route)) route = 'home';
    renderRoute(route);
    if (push !== false) {
      history.pushState({ route: route }, '', '#' + route);
    }
  }

  window.addEventListener('popstate', (e) => {
    const route = (e.state && e.state.route) || 'home';
    renderRoute(route);
  });

  document.querySelectorAll('.nav-link[data-route], .bottom-nav-link[data-route]').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.route));
  });

  document.getElementById('btn-start-quest').addEventListener('click', () => navigate('quests'));
  document.getElementById('btn-explore').addEventListener('click', () => {
    document.getElementById('home-explore-more').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  /* ---------- quest system ---------- */

  const elXp = document.getElementById('stat-xp');
  const elLevel = document.getElementById('stat-level');
  const elQuests = document.getElementById('stat-quests');
  const progressFill = document.getElementById('progress-fill');
  const progressWrap = document.getElementById('progress-bar-wrap');

  function animateNumber(el, from, to, duration) {
    if (!state.settings.animations || reduceMotion || from === to) {
      el.textContent = to;
      return;
    }
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderQuestStats() {
    elLevel.textContent = getLevel();
    elQuests.textContent = state.completedQuests.length;
    const pct = (state.completedQuests.length / TOTAL_QUESTS) * 100;
    progressFill.style.width = pct + '%';
    progressWrap.setAttribute('aria-valuenow', state.completedQuests.length);
  }

  function renderQuestCards() {
    document.querySelectorAll('.quest-card').forEach((card) => {
      const key = card.dataset.quest;
      const btn = card.querySelector('.btn-quest');
      if (state.completedQuests.includes(key)) {
        card.classList.add('completed');
        btn.classList.add('completed');
        btn.textContent = 'Completed ✔';
        btn.disabled = true;
      }
    });
  }

  function questToast(button, text) {
    const toast = document.createElement('div');
    toast.className = 'game-toast show';
    toast.style.position = 'absolute';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.top = '-8px';
    toast.textContent = text;
    const card = button.closest('.quest-card');
    card.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 1000);
  }

  function completeQuest(key, xp, button) {
    if (state.completedQuests.includes(key)) return;
    state.completedQuests.push(key);
    const fromXp = state.xp;
    state.xp += xp;
    animateNumber(elXp, fromXp, state.xp, 600);
    renderQuestStats();
    applyQuestEffects(key);

    const card = button.closest('.quest-card');
    card.classList.add('completed');
    button.classList.add('completed');
    button.textContent = 'Completed ✔';
    button.disabled = true;
    questToast(button, `+${xp} XP 🥹✨`);

    checkAchievements();
    checkMessageUnlock();
    checkBonusUnlock();
    saveState();
  }

  document.getElementById('quest-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-quest');
    if (!btn || btn.disabled) return;
    const card = btn.closest('.quest-card');
    completeQuest(card.dataset.quest, Number(card.dataset.xp), btn);
  });

  /* ---------- stress slider ---------- */

  const stressSlider = document.getElementById('stress-slider');
  const stressReadout = document.getElementById('stress-readout');
  const homeStressFill = document.getElementById('home-stress-fill');
  const homeStressPct = document.getElementById('home-stress-pct');

  function stressMessage(val) {
    if (val <= 20) return "Look at you functioning! I'm proud. 🧸";
    if (val <= 40) return "Okay, you're surviving. That's something. 😭";
    if (val <= 60) return "Bestie... breathe. 🥹";
    if (val <= 80) return "CODE BLUE 🚨 PUT THE REVIEWER DOWN.";
    return "🚨 EMERGENCY PROTOCOL 🚨\nStep 1: Stop studying.\nStep 2: Drink water.\nStep 3: Eat something.\nStep 4: Sleep.\nStep 5: Stop pretending you're a robot.";
  }

  function updateStress(val) {
    stressReadout.textContent = stressMessage(val);
    setStatus('stress', val);
    saveState();
  }

  stressSlider.addEventListener('input', () => updateStress(Number(stressSlider.value)));

  /* ---------- prescription ---------- */

  document.getElementById('btn-accept-treatment').addEventListener('click', () => {
    document.getElementById('rx-response').classList.remove('hidden');
    adjustStatus('energy', 10);
    adjustStatus('sleep', 10);
    adjustStatus('stress', -15);
    saveState();
    showToast('Treatment accepted. Now go drink water. 😭');
  });

  /* ---------- mini games hub / sub-screens ---------- */

  function showSubScreen(id) {
    document.getElementById('minigames-hub').classList.add('hidden');
    document.querySelectorAll('.sub-screen').forEach((s) => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
  }

  function backToHub() {
    document.querySelectorAll('.sub-screen').forEach((s) => s.classList.add('hidden'));
    document.getElementById('minigames-hub').classList.remove('hidden');
  }

  document.getElementById('open-hearts-game').addEventListener('click', () => showSubScreen('hearts-game-view'));
  document.getElementById('open-memory-game').addEventListener('click', () => showSubScreen('memory-game-view'));
  document.querySelectorAll('.btn-back').forEach((btn) => btn.addEventListener('click', backToHub));

  /* ---------- catch the hearts ---------- */

  const gameContainer = document.getElementById('game-container');
  const gameStartBtn = document.getElementById('btn-start-minigame');
  const gameTimerEl = document.getElementById('game-timer');
  const gameScoreEl = document.getElementById('game-score');
  const gameToast = document.getElementById('game-toast');

  let gameScore = 0;
  let gameTimeLeft = 20;
  let gameInterval = null;
  let spawnInterval = null;
  let activeTargets = [];

  function flashGameToast(text) {
    gameToast.textContent = text;
    gameToast.classList.add('show');
    setTimeout(() => gameToast.classList.remove('show'), 900);
  }

  function spawnTarget() {
    const isSkull = Math.random() < 0.22;
    const el = document.createElement('button');
    el.className = 'game-target';
    el.type = 'button';
    el.textContent = isSkull ? '💀' : '💕';
    el.setAttribute('aria-label', isSkull ? 'Stress icon, avoid' : 'Heart, catch it for points');

    const rect = gameContainer.getBoundingClientRect();
    const maxX = Math.max(rect.width - 44, 10);
    const maxY = Math.max(rect.height - 44, 10);
    el.style.left = Math.random() * maxX + 'px';
    el.style.top = Math.random() * maxY + 'px';

    el.addEventListener('click', () => {
      if (isSkull) {
        gameScore = Math.max(0, gameScore - 5);
        flashGameToast('WHY DID YOU CLICK THE STRESS?! 😭');
      } else {
        gameScore += 10;
        flashGameToast('+10 XP 💕');
      }
      gameScoreEl.textContent = gameScore;
      removeTarget(el);
    });

    gameContainer.appendChild(el);
    activeTargets.push(el);
    setTimeout(() => removeTarget(el), 1400 + Math.random() * 700);
  }

  function removeTarget(el) {
    if (el.parentNode) el.parentNode.removeChild(el);
    activeTargets = activeTargets.filter((t) => t !== el);
  }

  function endHeartsGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    activeTargets.forEach(removeTarget);
    gameContainer.innerHTML = '';

    const result = document.createElement('div');
    result.style.textAlign = 'center';
    result.innerHTML = `<p style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;">MINI QUEST COMPLETE! 🏆</p><p>Final score: ${gameScore} 💕</p>`;
    gameContainer.appendChild(result);

    const fromXp = state.xp;
    state.xp += gameScore;
    animateNumber(elXp, fromXp, state.xp, 700);
    renderQuestStats();
    adjustStatus('motivation', Math.min(10, Math.max(2, Math.round(gameScore / 20))));
    checkAchievements();
    checkBonusUnlock();
    saveState();

    const restart = document.createElement('button');
    restart.className = 'btn btn-secondary';
    restart.textContent = 'Play Again';
    restart.style.marginTop = '10px';
    restart.addEventListener('click', startHeartsGame);
    gameContainer.appendChild(restart);
  }

  function startHeartsGame() {
    gameContainer.innerHTML = '';
    gameContainer.appendChild(gameToast);
    gameScore = 0;
    gameTimeLeft = 20;
    gameScoreEl.textContent = '0';
    gameTimerEl.textContent = '20';

    spawnInterval = setInterval(spawnTarget, 700);
    gameInterval = setInterval(() => {
      gameTimeLeft -= 1;
      gameTimerEl.textContent = gameTimeLeft;
      if (gameTimeLeft <= 0) endHeartsGame();
    }, 1000);
  }

  gameStartBtn.addEventListener('click', startHeartsGame);

  /* ---------- nursing memory ---------- */

  const memoryDisplay = document.getElementById('memory-display');
  const memoryInputGrid = document.getElementById('memory-input-grid');
  const memoryResult = document.getElementById('memory-result');
  const memoryLevelText = document.getElementById('memory-level-text');
  const btnStartMemory = document.getElementById('btn-start-memory');

  let memorySequence = [];
  let memoryPlayerInput = [];
  let memoryAccepting = false;

  function memorySequenceLength() {
    return state.memoryLevel;
  }

  function buildMemoryInputGrid() {
    memoryInputGrid.innerHTML = '';
    MEMORY_EMOJIS.forEach((emoji) => {
      const btn = document.createElement('button');
      btn.className = 'memory-btn';
      btn.type = 'button';
      btn.textContent = emoji;
      btn.disabled = true;
      btn.addEventListener('click', () => handleMemoryInput(emoji, btn));
      memoryInputGrid.appendChild(btn);
    });
  }

  function setMemoryButtonsEnabled(enabled) {
    memoryInputGrid.querySelectorAll('.memory-btn').forEach((b) => (b.disabled = !enabled));
  }

  function startMemoryRound() {
    memoryResult.textContent = '';
    memoryPlayerInput = [];
    memoryAccepting = false;
    setMemoryButtonsEnabled(false);
    memoryLevelText.textContent = `Level ${state.memoryLevel - 2} — watch closely.`;

    const len = memorySequenceLength();
    memorySequence = [];
    for (let i = 0; i < len; i++) {
      memorySequence.push(MEMORY_EMOJIS[Math.floor(Math.random() * MEMORY_EMOJIS.length)]);
    }

    memoryDisplay.textContent = memorySequence.join(' ');
    btnStartMemory.disabled = true;

    setTimeout(() => {
      memoryDisplay.textContent = '❓ ❓ ❓';
      memoryAccepting = true;
      setMemoryButtonsEnabled(true);
      btnStartMemory.disabled = false;
    }, 1400 + len * 500);
  }

  function handleMemoryInput(emoji) {
    if (!memoryAccepting) return;
    memoryPlayerInput.push(emoji);

    const idx = memoryPlayerInput.length - 1;
    if (memoryPlayerInput[idx] !== memorySequence[idx]) {
      memoryAccepting = false;
      setMemoryButtonsEnabled(false);
      memoryResult.textContent = "It's okay. We don't talk about that attempt. 😭";
      return;
    }

    if (memoryPlayerInput.length === memorySequence.length) {
      memoryAccepting = false;
      setMemoryButtonsEnabled(false);
      memoryResult.textContent = 'BIG BRAIN NURSE 🧠🩺';
      state.memoryLevel = Math.min(state.memoryLevel + 1, 8);
      const fromXp = state.xp;
      state.xp += 30;
      animateNumber(elXp, fromXp, state.xp, 500);
      renderQuestStats();
      adjustStatus('motivation', 5);
      checkAchievements();
      checkBonusUnlock();
      saveState();
    }
  }

  btnStartMemory.addEventListener('click', startMemoryRound);

  /* ---------- messages ---------- */

  const messageLockedBlock = document.getElementById('message-locked-block');
  const messageUnlockedBlock = document.getElementById('message-unlocked-block');
  const messageLockText = document.getElementById('message-lock-text');
  const messageCarouselEl = document.getElementById('message-carousel');
  const messageTrackEl = document.getElementById('message-track');
  const messageDotsEl = document.getElementById('message-dots');
  const msgPrevBtn = document.getElementById('msg-prev');
  const msgNextBtn = document.getElementById('msg-next');

  let messagePageIndex = 0;

  function updateMessageCarousel() {
    messageTrackEl.style.transform = `translateX(-${messagePageIndex * 100}%)`;
    Array.from(messageDotsEl.children).forEach((d, i) => d.classList.toggle('active', i === messagePageIndex));
    msgPrevBtn.disabled = messagePageIndex === 0;
    msgNextBtn.disabled = messagePageIndex === MESSAGE_PAGES.length - 1;
  }

  function goToMessagePage(idx) {
    messagePageIndex = Math.max(0, Math.min(MESSAGE_PAGES.length - 1, idx));
    updateMessageCarousel();
  }

  function buildMessageCarousel() {
    if (messageTrackEl.childElementCount) return;
    MESSAGE_PAGES.forEach((lines, pageIdx) => {
      const slide = document.createElement('div');
      slide.className = 'message-slide';
      lines.forEach((line, i) => {
        const p = document.createElement('p');
        p.textContent = line;
        if (pageIdx === MESSAGE_PAGES.length - 1) {
          p.classList.add(i === 0 ? 'emphasis' : 'signature');
        }
        slide.appendChild(p);
      });
      messageTrackEl.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'message-dot';
      dot.setAttribute('aria-label', `Go to message ${pageIdx + 1} of ${MESSAGE_PAGES.length}`);
      dot.addEventListener('click', () => goToMessagePage(pageIdx));
      messageDotsEl.appendChild(dot);
    });
    updateMessageCarousel();
  }

  msgPrevBtn.addEventListener('click', () => goToMessagePage(messagePageIndex - 1));
  msgNextBtn.addEventListener('click', () => goToMessagePage(messagePageIndex + 1));

  let msgDragStartX = null;
  let msgDragging = false;

  messageCarouselEl.addEventListener('pointerdown', (e) => {
    msgDragStartX = e.clientX;
    msgDragging = true;
  });
  messageCarouselEl.addEventListener('pointerup', (e) => {
    if (!msgDragging || msgDragStartX === null) return;
    const dx = e.clientX - msgDragStartX;
    if (Math.abs(dx) > 40) {
      goToMessagePage(messagePageIndex + (dx < 0 ? 1 : -1));
    }
    msgDragging = false;
    msgDragStartX = null;
  });
  messageCarouselEl.addEventListener('pointercancel', () => {
    msgDragging = false;
    msgDragStartX = null;
  });

  function checkMessageUnlock() {
    if (state.completedQuests.length >= MESSAGE_UNLOCK_THRESHOLD) {
      messageLockedBlock.classList.add('hidden');
      messageUnlockedBlock.classList.remove('hidden');
      buildMessageCarousel();
    } else {
      const remaining = MESSAGE_UNLOCK_THRESHOLD - state.completedQuests.length;
      messageLockText.textContent = `Complete ${remaining} more quest${remaining === 1 ? '' : 's'} to unlock this.`;
    }
  }

  /* ---------- random motivation ---------- */

  const motivationBox = document.getElementById('motivation-box');
  let lastMotivationIndex = -1;

  document.getElementById('btn-motivation').addEventListener('click', () => {
    let idx;
    do {
      idx = Math.floor(Math.random() * MOTIVATION_MESSAGES.length);
    } while (idx === lastMotivationIndex && MOTIVATION_MESSAGES.length > 1);
    lastMotivationIndex = idx;
    motivationBox.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = MOTIVATION_MESSAGES[idx];
    motivationBox.appendChild(p);
  });

  /* ---------- jokes ---------- */

  let lastJokeIndex = -1;

  function randomJoke() {
    let idx;
    do {
      idx = Math.floor(Math.random() * JOKES.length);
    } while (idx === lastJokeIndex && JOKES.length > 1);
    lastJokeIndex = idx;
    return JOKES[idx];
  }

  function triggerJoke(targetEl) {
    targetEl.textContent = randomJoke();
    state.jokeClicks += 1;
    checkAchievements();
    saveState();
  }

  document.getElementById('btn-need-joke').addEventListener('click', () => {
    triggerJoke(document.getElementById('home-joke-output'));
  });
  document.getElementById('btn-joke-messages').addEventListener('click', () => {
    triggerJoke(document.getElementById('messages-joke-output'));
  });
  document.getElementById('btn-joke-fab').addEventListener('click', () => {
    state.jokeClicks += 1;
    checkAchievements();
    saveState();
    showToast(randomJoke());
  });

  /* ---------- achievements ---------- */

  const achievementsGrid = document.getElementById('achievements-grid');

  function isAchievementEarned(id) {
    switch (id) {
      case 'first_step': return state.completedQuests.length >= 1;
      case 'future_nurse': return state.completedQuests.length >= 3;
      case 'academic_warrior': return state.completedQuests.length >= TOTAL_QUESTS;
      case 'still_standing': return state.xp >= MAX_QUEST_XP;
      case 'actually_smiled': return state.jokeClicks >= 10;
      case 'avocado_survivor': return !!state.bonusUnlocked;
      default: return false;
    }
  }

  function renderAchievements() {
    achievementsGrid.innerHTML = '';
    ACHIEVEMENT_DEFS.forEach((def) => {
      const earned = !!state.achievements[def.id];
      const card = document.createElement('div');
      card.className = 'achievement-card ' + (earned ? 'unlocked' : 'locked');
      card.innerHTML = `
        <div class="a-icon">${earned ? def.icon : '🔒'}</div>
        <h4>${def.name}</h4>
        <p>${def.desc}</p>
      `;
      achievementsGrid.appendChild(card);
    });
  }

  function checkAchievements() {
    let newlyUnlocked = [];
    ACHIEVEMENT_DEFS.forEach((def) => {
      if (!state.achievements[def.id] && isAchievementEarned(def.id)) {
        state.achievements[def.id] = true;
        newlyUnlocked.push(def);
      }
    });
    if (newlyUnlocked.length) {
      renderAchievements();
      newlyUnlocked.forEach((def, i) => {
        setTimeout(() => {
          showToast(`🏆 Achievement unlocked: ${def.name}!`);
          launchConfetti(14);
        }, i * 700);
      });
      saveState();
    } else {
      renderAchievements();
    }
  }

  /* ---------- bonus quest / final screen ---------- */

  const bonusLockedBlock = document.getElementById('bonus-locked-block');
  const bonusQuestBlock = document.getElementById('bonus-quest-block');
  const finalScreenBlock = document.getElementById('final-screen-block');

  function checkBonusUnlock() {
    if (state.completedQuests.length >= TOTAL_QUESTS) {
      bonusLockedBlock.classList.add('hidden');
      bonusQuestBlock.classList.remove('hidden');
    }
    if (state.finalUnlocked) {
      finalScreenBlock.classList.remove('hidden');
    }
  }

  document.getElementById('btn-claim-bonus').addEventListener('click', () => {
    state.bonusUnlocked = true;
    state.finalUnlocked = true;
    adjustStatus('energy', 20);
    adjustStatus('motivation', 20);
    adjustStatus('sleep', 10);
    adjustStatus('stress', -30);
    saveState();
    checkAchievements();
    finalScreenBlock.classList.remove('hidden');
    launchConfetti(40);
    showToast('YAYYY! 🥹💕 Avocado shake quest unlocked.');
    finalScreenBlock.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- settings modal ---------- */

  const settingsModal = document.getElementById('settings-modal');
  const toggleSound = document.getElementById('toggle-sound');
  const toggleAnimations = document.getElementById('toggle-animations');
  const toggleDark = document.getElementById('toggle-dark');

  function renderSettingsUI() {
    toggleSound.dataset.on = String(state.settings.sound);
    toggleSound.textContent = state.settings.sound ? 'ON' : 'OFF';
    toggleAnimations.dataset.on = String(state.settings.animations);
    toggleAnimations.textContent = state.settings.animations ? 'ON' : 'OFF';
    toggleDark.dataset.on = String(state.settings.dark);
    toggleDark.textContent = state.settings.dark ? 'ON' : 'OFF';
  }

  document.getElementById('btn-settings').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
      settingsModal.classList.add('hidden');
    }
  });

  toggleSound.addEventListener('click', () => {
    state.settings.sound = !state.settings.sound;
    renderSettingsUI();
    applySoundSetting();
    saveState();
  });
  toggleAnimations.addEventListener('click', () => {
    state.settings.animations = !state.settings.animations;
    renderSettingsUI();
    applyAnimationSetting();
    saveState();
  });
  toggleDark.addEventListener('click', () => {
    state.settings.dark = !state.settings.dark;
    renderSettingsUI();
    applyDarkMode();
    saveState();
  });

  document.getElementById('btn-reset-progress').addEventListener('click', () => {
    resetGame();
    settingsModal.classList.add('hidden');
  });

  /* ---------- reset ---------- */

  function resetGame() {
    const keepSettings = state.settings;
    state = {
      xp: 0,
      completedQuests: [],
      achievements: {},
      jokeClicks: 0,
      energyLevel: DEFAULT_STATUS.energyLevel,
      stressLevel: DEFAULT_STATUS.stressLevel,
      sleepLevel: DEFAULT_STATUS.sleepLevel,
      motivationLevel: DEFAULT_STATUS.motivationLevel,
      bonusUnlocked: false,
      finalUnlocked: false,
      memoryLevel: 3,
      settings: keepSettings
    };
    saveState();
    renderHomeStatus();

    document.querySelectorAll('.quest-card').forEach((card) => {
      card.classList.remove('completed');
      const btn = card.querySelector('.btn-quest');
      btn.classList.remove('completed');
      btn.textContent = 'Complete Quest';
      btn.disabled = false;
    });

    elXp.textContent = '0';
    stressSlider.value = 85;
    updateStress(85);

    messageLockedBlock.classList.remove('hidden');
    messageUnlockedBlock.classList.add('hidden');
    messagePageIndex = 0;
    if (messageTrackEl.childElementCount) updateMessageCarousel();
    checkMessageUnlock();

    bonusLockedBlock.classList.remove('hidden');
    bonusQuestBlock.classList.add('hidden');
    finalScreenBlock.classList.add('hidden');

    gameContainer.innerHTML = '';
    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-primary';
    startBtn.id = 'btn-start-minigame';
    startBtn.textContent = 'Start Mini Game';
    startBtn.addEventListener('click', startHeartsGame);
    gameContainer.appendChild(startBtn);
    gameContainer.appendChild(gameToast);
    gameTimerEl.textContent = '20';
    gameScoreEl.textContent = '0';

    memoryDisplay.textContent = '';
    memoryResult.textContent = '';
    memoryLevelText.textContent = 'Level 1 — watch closely.';
    setMemoryButtonsEnabled(false);

    renderQuestStats();
    renderAchievements();
    showToast('Progress reset. Fresh start, future nurse! 🧸');
    navigate('home');
  }

  /* ---------- init ---------- */

  function init() {
    loadState();
    if (welcomeOverlay) document.body.classList.add('welcome-open');
    buildMemoryInputGrid();
    applyAnimationSetting();
    applyDarkMode();
    applySoundSetting();
    renderSettingsUI();

    renderQuestStats();
    renderQuestCards();
    renderAchievements();
    checkMessageUnlock();
    checkBonusUnlock();

    renderHomeStatus();
    stressSlider.value = state.stressLevel;
    stressReadout.textContent = stressMessage(state.stressLevel);

    animateNumber(elXp, 0, state.xp, 500);

    const initialRoute = (location.hash || '#home').replace('#', '');
    const route = VALID_ROUTES.includes(initialRoute) ? initialRoute : 'home';
    history.replaceState({ route: route }, '', '#' + route);
    renderRoute(route);
  }

  init();
})();