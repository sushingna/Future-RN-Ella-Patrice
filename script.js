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
    "Group project meeting: 5 minutes of studying, 55 minutes of shared trauma. 💀",
    "Highlighted the entire page. Learned nothing. Felt productive. 🖍️😭",
    "My care plan has better structure than my sleep schedule. 📋💀",
    "Clinical instructor: 'Any questions?' Me, internally screaming: none that matter now. 🙃",
    "I don't cry during sad movies anymore. I cried it all out during return demo. 😭🩺",
    "Charting at 2am hits different when you can't feel your hand anymore. 🖊️💀",
    "Nursing school gave me trust issues with 'this exam will be easy.' 📝😭",
    "My planner says 'study.' My body says 'nap first, regret later.' 😴",
    "I know the drug classifications better than my own class schedule. 💊📚",
    "Every RLE day starts with hope and ends with existential silence. 🩺💀",
    "Pretty sure my blood type is now 50% coffee. ☕🧸"
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
    "You're not behind. You're exactly on time for your own journey.",
    "You are stronger than the version of you who started this course.",
    "Even your smallest effort today still counts.",
    "The exhaustion is proof of how hard you've been trying.",
    "You don't have to have it all figured out to keep going.",
    "Every skill you're learning now is someone's future comfort.",
    "It's okay if today was just about surviving.",
    "You're allowed to be a beginner and still be doing great.",
    "The version of you a year from now will thank you for not quitting.",
    "You showed up today. That already matters.",
    "Rest now, rise again — you're not out of chances, just out of energy."
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
    { id: 'avocado_survivor', icon: '🥑', name: 'Avocado Survivor', desc: 'Unlock the bonus quest.' },
    { id: 'word_wizard', icon: '🔎', name: 'Word Wizard', desc: 'Complete the Nursing Word Search.' },
    { id: 'shake_secured', icon: '🥤', name: 'Shake Secured', desc: 'Complete the secret Avocado Shake Run.' }
  ];

  const MEMORY_EMOJIS = ['🧸', '🩺', '🥑', '💕', '🌸', '🥤'];

  const WORDSEARCH_LEVELS = [
    ['NURSE', 'PULSE', 'CHART', 'WOUND', 'FEVER', 'MASK', 'DUTY', 'SHIFT', 'VITALS'],
    ['TRIAGE', 'BANDAGE', 'SYRINGE', 'PATIENT', 'ALLERGY', 'CLINIC', 'INFECT', 'VOMIT', 'ORGAN'],
    ['CATHETER', 'DIAGNOSIS', 'HOSPITAL', 'SURGERY', 'RECOVERY', 'INSULIN', 'SEIZURE', 'SANITIZE', 'MEDICINE'],
    ['STETHOSCOPE', 'MEDICATION', 'VENTILATOR', 'ANESTHESIA', 'HEMORRHAGE', 'ANTIBIOTIC', 'EMERGENCY', 'DEHYDRATION', 'RESPIRATORY'],
    ['CARDIOLOGY', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'ENDOCRINE', 'ISOLATION', 'OBSERVATION', 'OUTPATIENT', 'GERIATRICS']
  ];
  const WORDSEARCH_SIZE = 13;

  const AVO_GOOD_ITEMS = [
    { emoji: '🥤', type: 'shake', points: 25 },
    { emoji: '💕', type: 'heart', points: 10 },
    { emoji: '🧸', type: 'teddy', points: 15 },
    { emoji: '💧', type: 'water', points: 5 }
  ];
  const AVO_BAD_ITEMS = [
    { emoji: '📚', type: 'reviewer', points: -10 },
    { emoji: '📝', type: 'requirements', points: -15 },
    { emoji: '⏰', type: 'alarm', points: -10 },
    { emoji: '💀', type: 'stress', points: -20 }
  ];

  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dailyResetHappened = false;

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
    everCompletedQuestKeys: [],
    lastQuestResetDate: null,
    achievements: {},
    jokeClicks: 0,
    energyLevel: DEFAULT_STATUS.energyLevel,
    stressLevel: DEFAULT_STATUS.stressLevel,
    sleepLevel: DEFAULT_STATUS.sleepLevel,
    motivationLevel: DEFAULT_STATUS.motivationLevel,
    bonusUnlocked: false,
    finalUnlocked: false,
    memoryLevel: 3,
    wordSearchCompleted: false,
    avocadoGameCompleted: false,
    settings: { sound: true, animations: true, dark: false }
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(state, parsed);
        state.settings = Object.assign({ sound: true, animations: true, dark: false }, parsed.settings || {});
        // Backfill for saves created before daily-reset & lifetime-tracking were added.
        if (!parsed.everCompletedQuestKeys) {
          state.everCompletedQuestKeys = [...(parsed.completedQuests || [])];
        }
      }
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function todayKey() {
    return new Date().toDateString();
  }

  // Returns true if a reset actually happened (i.e. it wasn't the very first visit).
  function checkDailyQuestReset() {
    const today = todayKey();
    if (state.lastQuestResetDate === today) return false;

    const isFirstVisitEver = !state.lastQuestResetDate;
    state.lastQuestResetDate = today;

    if (isFirstVisitEver) {
      saveState();
      return false;
    }

    state.completedQuests = [];
    saveState();
    return true;
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
      if (dailyResetHappened) {
        setTimeout(() => {
          showToast('🌅 New day! Your quests are refreshed — go earn more XP!');
        }, 400);
      }
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
      const isCompleted = state.completedQuests.includes(key);
      card.classList.toggle('completed', isCompleted);
      btn.classList.toggle('completed', isCompleted);
      btn.textContent = isCompleted ? 'Completed ✔' : 'Complete Quest';
      btn.disabled = isCompleted;
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
    if (!state.everCompletedQuestKeys.includes(key)) {
      state.everCompletedQuestKeys.push(key);
    }
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
  document.getElementById('open-wordsearch-game').addEventListener('click', () => showSubScreen('wordsearch-game-view'));
  document.getElementById('open-avocado-game').addEventListener('click', () => {
    showSubScreen('avocado-game-view');
    resetAvocadoIntro();
  });
  document.querySelectorAll('.btn-back').forEach((btn) => btn.addEventListener('click', backToHub));
  const btnAvoBack = document.getElementById('btn-avo-back');
  if (btnAvoBack) btnAvoBack.addEventListener('click', avoHardStop);

  /* ---------- catch the hearts ---------- */

  const gameContainer = document.getElementById('game-container');
  const gameStartBtn = document.getElementById('btn-start-minigame');
  const gameTimerEl = document.getElementById('game-timer');
  const gameScoreEl = document.getElementById('game-score');
  const gameToast = document.getElementById('game-toast');

  let gameScore = 0;
  let gameTimeLeft = 60;
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
    gameTimeLeft = 60;
    gameScoreEl.textContent = '0';
    gameTimerEl.textContent = '60';

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

  function memoryDisplayedLevel() {
    return state.memoryLevel - 2;
  }

  function memoryPerItemMs() {
    // Starts at 550ms per icon on level 1, drops as levels rise, floors at 220ms on level 10.
    const lvl = memoryDisplayedLevel();
    return Math.max(220, 550 - (lvl - 1) * 35);
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
    memoryLevelText.textContent = `Level ${memoryDisplayedLevel()} — watch closely.`;

    const len = memorySequenceLength();
    const perItemMs = memoryPerItemMs();
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
    }, 1200 + len * perItemMs);
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
      state.memoryLevel = Math.min(state.memoryLevel + 1, 12);
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

  /* ---------- nursing word search ---------- */

  const wsGridEl = document.getElementById('ws-grid');
  const wsWordListEl = document.getElementById('ws-word-list');
  const wsResultEl = document.getElementById('ws-result');
  const wsFoundCountEl = document.getElementById('ws-found-count');
  const wsTotalCountEl = document.getElementById('ws-total-count');
  const wsTimerEl = document.getElementById('ws-timer');
  const wsLevelTextEl = document.getElementById('ws-level-current');
  const btnStartWordsearch = document.getElementById('btn-start-wordsearch');

  const WS_DIRECTIONS = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  let wsLetters = [];
  let wsRemainingWords = [];
  let wsPlaying = false;
  let wsSecondsElapsed = 0;
  let wsTimerInterval = null;
  let wsLevelIndex = 0;
  let wsLevelWords = [];

  let wsSelecting = false;
  let wsSelStart = null;
  let wsCurrentPath = [];

  function wsRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  }

  function wsTryPlaceWord(word) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const dir = WS_DIRECTIONS[Math.floor(Math.random() * WS_DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * WORDSEARCH_SIZE);
      const startCol = Math.floor(Math.random() * WORDSEARCH_SIZE);
      const endRow = startRow + dir[0] * (word.length - 1);
      const endCol = startCol + dir[1] * (word.length - 1);
      if (endRow < 0 || endRow >= WORDSEARCH_SIZE || endCol < 0 || endCol >= WORDSEARCH_SIZE) continue;

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dir[0] * i;
        const c = startCol + dir[1] * i;
        const existing = wsLetters[r][c];
        if (existing !== null && existing !== word[i]) { fits = false; break; }
      }
      if (!fits) continue;

      for (let i = 0; i < word.length; i++) {
        const r = startRow + dir[0] * i;
        const c = startCol + dir[1] * i;
        wsLetters[r][c] = word[i];
      }
      return true;
    }
    return false;
  }

  function wsGenerateGrid(words) {
    wsLetters = Array.from({ length: WORDSEARCH_SIZE }, () => Array(WORDSEARCH_SIZE).fill(null));
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    sortedWords.forEach((word) => wsTryPlaceWord(word));
    for (let r = 0; r < WORDSEARCH_SIZE; r++) {
      for (let c = 0; c < WORDSEARCH_SIZE; c++) {
        if (!wsLetters[r][c]) wsLetters[r][c] = wsRandomLetter();
      }
    }
  }

  function wsRenderGrid() {
    wsGridEl.innerHTML = '';
    wsGridEl.style.setProperty('--ws-size', WORDSEARCH_SIZE);
    for (let r = 0; r < WORDSEARCH_SIZE; r++) {
      for (let c = 0; c < WORDSEARCH_SIZE; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'ws-cell';
        cell.textContent = wsLetters[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, letter ${wsLetters[r][c]}`);
        cell.addEventListener('pointerdown', (e) => wsPointerDown(e, r, c, cell));
        wsGridEl.appendChild(cell);
      }
    }
  }

  function wsRenderWordList() {
    wsWordListEl.innerHTML = '';
    wsLevelWords.forEach((word) => {
      const chip = document.createElement('span');
      chip.className = 'ws-chip';
      chip.id = `ws-chip-${word}`;
      chip.textContent = word;
      if (!wsRemainingWords.includes(word)) chip.classList.add('found');
      wsWordListEl.appendChild(chip);
    });
  }

  function wsCellEl(r, c) {
    return wsGridEl.querySelector(`.ws-cell[data-row="${r}"][data-col="${c}"]`);
  }

  function wsClearSelectingHighlight() {
    wsGridEl.querySelectorAll('.ws-cell.selecting').forEach((el) => el.classList.remove('selecting'));
  }

  function wsGetCellFromPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el || !el.closest) return null;
    const cellEl = el.closest('.ws-cell');
    if (!cellEl || !wsGridEl.contains(cellEl)) return null;
    return { r: Number(cellEl.dataset.row), c: Number(cellEl.dataset.col) };
  }

  function wsComputePath(start, end) {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const isStraightLine = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!isStraightLine) return null;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const sdr = dr === 0 ? 0 : dr / Math.abs(dr);
    const sdc = dc === 0 ? 0 : dc / Math.abs(dc);
    const path = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ r: start.r + sdr * i, c: start.c + sdc * i });
    }
    return path;
  }

  function wsHighlightPath(path) {
    wsClearSelectingHighlight();
    path.forEach(({ r, c }) => {
      const el = wsCellEl(r, c);
      if (el) el.classList.add('selecting');
    });
  }

  function wsFlashFail(cells) {
    cells.forEach(({ r, c }) => {
      const el = wsCellEl(r, c);
      if (el) el.classList.add('fail');
    });
    setTimeout(() => {
      cells.forEach(({ r, c }) => {
        const el = wsCellEl(r, c);
        if (el) el.classList.remove('fail');
      });
    }, 350);
  }

  function wsStartTimer() {
    wsSecondsElapsed = 0;
    wsTimerEl.textContent = '0';
    clearInterval(wsTimerInterval);
    wsTimerInterval = setInterval(() => {
      wsSecondsElapsed += 1;
      wsTimerEl.textContent = wsSecondsElapsed;
    }, 1000);
  }

  function wsFinishGame() {
    wsPlaying = false;
    clearInterval(wsTimerInterval);
    wsResultEl.textContent = `ALL 5 LEVELS COMPLETE! 🎉 Total time: ${wsSecondsElapsed}s`;

    const fromXp = state.xp;
    state.xp += 50;
    animateNumber(elXp, fromXp, state.xp, 700);
    renderQuestStats();
    adjustStatus('motivation', 10);
    state.wordSearchCompleted = true;
    checkAchievements();
    checkBonusUnlock();
    saveState();
    launchConfetti(24);
    showToast('WORD SEARCH COMPLETE! +50 XP bonus 🔎💕');
  }

  function wsLevelComplete() {
    const fromXp = state.xp;
    state.xp += 30;
    animateNumber(elXp, fromXp, state.xp, 500);
    renderQuestStats();
    saveState();

    if (wsLevelIndex < WORDSEARCH_LEVELS.length - 1) {
      showToast(`Level ${wsLevelIndex + 1} complete! +30 XP 🎉`);
      wsResultEl.textContent = `Level ${wsLevelIndex + 1} complete! Loading level ${wsLevelIndex + 2}...`;
      wsPlaying = false;
      setTimeout(() => wsStartLevel(wsLevelIndex + 1), 1400);
    } else {
      wsFinishGame();
    }
  }

  function wsFinishSelection(path) {
    if (!path || path.length < 2) return;

    const forward = path.map((p) => wsLetters[p.r][p.c]).join('');
    const backward = forward.split('').reverse().join('');
    const matchedWord = wsRemainingWords.find((w) => w === forward || w === backward);

    if (matchedWord) {
      path.forEach(({ r: pr, c: pc }) => {
        const el = wsCellEl(pr, pc);
        if (el) el.classList.add('found');
      });
      wsRemainingWords = wsRemainingWords.filter((w) => w !== matchedWord);
      const chip = document.getElementById(`ws-chip-${matchedWord}`);
      if (chip) chip.classList.add('found');
      wsFoundCountEl.textContent = String(wsLevelWords.length - wsRemainingWords.length);
      showToast(`Found ${matchedWord}! 🔎`);

      if (wsRemainingWords.length === 0) {
        wsLevelComplete();
      }
    } else {
      wsFlashFail(path);
    }
  }

  function wsPointerDown(e, r, c, cellEl) {
    if (!wsPlaying) return;
    e.preventDefault();
    wsSelecting = true;
    wsSelStart = { r, c };
    wsCurrentPath = [{ r, c }];
    if (cellEl.setPointerCapture) {
      try { cellEl.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    }
    wsHighlightPath(wsCurrentPath);
  }

  function wsPointerMove(e) {
    if (!wsSelecting || !wsSelStart) return;
    const pt = wsGetCellFromPoint(e.clientX, e.clientY);
    if (!pt) return;
    const path = wsComputePath(wsSelStart, pt);
    if (path) {
      wsCurrentPath = path;
      wsHighlightPath(path);
    }
  }

  function wsPointerUp() {
    if (!wsSelecting) return;
    wsSelecting = false;
    wsFinishSelection(wsCurrentPath);
    wsClearSelectingHighlight();
    wsSelStart = null;
    wsCurrentPath = [];
  }

  wsGridEl.addEventListener('pointermove', wsPointerMove);
  wsGridEl.addEventListener('pointerup', wsPointerUp);
  wsGridEl.addEventListener('pointercancel', wsPointerUp);
  wsGridEl.addEventListener('pointerleave', (e) => {
    // Only cancel if the pointer actually left the browser viewport area tracking,
    // not just moved between cells (pointer capture keeps events flowing to us).
    if (e.buttons === 0) wsPointerUp();
  });

  function wsStartLevel(levelIdx) {
    wsLevelIndex = levelIdx;
    wsLevelWords = WORDSEARCH_LEVELS[levelIdx];
    wsGenerateGrid(wsLevelWords);
    wsRemainingWords = [...wsLevelWords];
    wsSelecting = false;
    wsSelStart = null;
    wsCurrentPath = [];
    wsPlaying = true;
    wsResultEl.textContent = '';
    wsFoundCountEl.textContent = '0';
    wsTotalCountEl.textContent = String(wsLevelWords.length);
    if (wsLevelTextEl) wsLevelTextEl.textContent = `${levelIdx + 1}`;
    wsRenderGrid();
    wsRenderWordList();
  }

  function startWordSearchGame() {
    wsStartTimer();
    wsStartLevel(0);
  }

  btnStartWordsearch.addEventListener('click', startWordSearchGame);

  /* ---------- avocado shake run (secret mini-game) ---------- */

  const AVO_INTRO_LINES = [
    'Nurse Ella, we have an emergency. 🚨',
    'The avocado shake is waiting. 🥑🥤',
    "Unfortunately... you'll have to survive nursing school first. 💀",
    '5 levels. Catch 5 avocados each level to clear it. 🥑',
    "You have 5 lives. Missing an avocado or catching something bad costs 1 life — but you can keep going! 💪"
  ];

  const avoIntroBox = document.getElementById('avo-intro-box');
  const avoIntroLine = document.getElementById('avo-intro-line');
  const btnAvoNext = document.getElementById('btn-avo-next');
  const avoHud = document.getElementById('avo-hud');
  const avoCollectionEl = document.getElementById('avo-collection');
  const avoContainer = document.getElementById('avo-container');
  const avoPlayer = document.getElementById('avo-player');
  const avoScoreEl = document.getElementById('avo-score');
  const avoLivesEl = document.getElementById('avo-lives');
  const avoMessageEl = document.getElementById('avo-message');
  const avoEventBanner = document.getElementById('avo-event-banner');
  const avoComboPopup = document.getElementById('avo-combo-popup');
  const avoToast = document.getElementById('avo-toast');
  const avoResults = document.getElementById('avo-results');
  const avoLevelEl = document.getElementById('avo-level');

  const AVO_PLAYER_SIZE = 44;
  const AVO_MAX_LEVEL = 5;
  const AVO_START_LIVES = 5;
  const AVO_AVOCADOS_PER_LEVEL = 5;
  // If this many ms pass without an avocado spawning, force one — so a level
  // never goes cold and can never become impossible to finish.
  const AVO_MAX_GAP_WITHOUT_AVOCADO = 3200;

  let avoIntroIndex = 0;
  let avoScore = 0;
  let avoLives = AVO_START_LIVES;
  let avoCurrentLevel = 1;
  let avoLevelAvocadoCount = 0;
  let avoCombo = 0;
  let avoAvocadoCount = 0;
  let avoShakeCount = 0;
  let avoStressCount = 0;
  let avoPlayerX = 0;
  let avoKeys = { left: false, right: false };
  let avoItems = [];
  let avoRafId = null;
  let avoSpawnTimeoutId = null;
  let avoEventTimeoutIds = [];
  let avoSpeedBoost = 1;
  let avoLastFrameTime = 0;
  let avoLevelStartTime = 0;
  let avoLastAvocadoSpawnTime = 0;
  let avoPlaying = false;

  function avoShowIntroLine() {
    avoIntroLine.textContent = AVO_INTRO_LINES[avoIntroIndex];
    btnAvoNext.textContent = avoIntroIndex === AVO_INTRO_LINES.length - 1 ? 'START MISSION 🥑' : 'Next →';
  }

  btnAvoNext.addEventListener('click', () => {
    if (avoIntroIndex < AVO_INTRO_LINES.length - 1) {
      avoIntroIndex += 1;
      avoShowIntroLine();
    } else {
      startAvocadoGame();
    }
  });

  function resetAvocadoIntro() {
    avoIntroIndex = 0;
    avoShowIntroLine();
    avoIntroBox.classList.remove('hidden');
    avoHud.classList.add('hidden');
    avoCollectionEl.classList.add('hidden');
    avoContainer.classList.add('hidden');
    avoMessageEl.classList.add('hidden');
    avoResults.classList.add('hidden');
    avoResults.innerHTML = '';
    avoMessageEl.textContent = '';
  }

  function avoContainerWidth() {
    return avoContainer.clientWidth || 300;
  }

  function clampAvoPlayerX() {
    const w = avoContainerWidth();
    avoPlayerX = Math.max(0, Math.min(avoPlayerX, w - AVO_PLAYER_SIZE));
  }

  function setAvoPlayerPosition() {
    avoPlayer.style.left = avoPlayerX + 'px';
  }

  function renderAvoLives() {
    avoLivesEl.textContent = avoLives > 0 ? '❤️'.repeat(avoLives) : '💔';
  }

  function flashAvoToast(text) {
    avoToast.textContent = text;
    avoToast.classList.add('show');
    clearTimeout(avoToast._t);
    avoToast._t = setTimeout(() => avoToast.classList.remove('show'), 1300);
  }

  function flashAvoEventBanner(text, duration) {
    avoEventBanner.textContent = text;
    avoEventBanner.classList.add('show');
    clearTimeout(avoEventBanner._t);
    avoEventBanner._t = setTimeout(() => avoEventBanner.classList.remove('show'), duration || 1800);
  }

  function avoShowCombo() {
    avoComboPopup.textContent = `COMBO x${avoCombo} 🔥`;
    avoComboPopup.classList.add('show');
    clearTimeout(avoComboPopup._t);
    avoComboPopup._t = setTimeout(() => avoComboPopup.classList.remove('show'), 900);
    flashAvoToast('OKAYYY NURSE ELLA 🔥🩺');
    avoScore += Math.min(avoCombo, 10) * 2;
  }

  function avoCreateItem(cfg) {
    const el = document.createElement('div');
    el.className = 'avo-falling' + (cfg.extraClass ? ' ' + cfg.extraClass : '');
    el.textContent = cfg.emoji;
    const size = cfg.size || 34;
    el.style.fontSize = size + 'px';
    const w = avoContainerWidth();
    const x = Math.random() * Math.max(w - size, 10);
    el.style.left = x + 'px';
    el.style.top = '-50px';
    avoContainer.insertBefore(el, avoToast);
    // Fall speed ramps up noticeably with each level, on top of a per-item
    // random base speed and any temporary event boost.
    const levelSpeedMultiplier = 1 + (avoCurrentLevel - 1) * 0.35;
    const baseSpeed = cfg.speed || 85 + Math.random() * 50;
    const speed = baseSpeed * levelSpeedMultiplier * avoSpeedBoost;
    avoItems.push({
      el, x, y: -50, size, speed,
      isBad: !!cfg.isBad, points: cfg.points, type: cfg.type,
      catchMessage: cfg.catchMessage, badMessage: cfg.badMessage, isAvocado: !!cfg.isAvocado
    });
    if (cfg.isAvocado) avoLastAvocadoSpawnTime = performance.now();
  }

  function avoRemoveItem(item) {
    if (item.el.parentNode) item.el.parentNode.removeChild(item.el);
    avoItems = avoItems.filter((i) => i !== item);
  }

  function avoSpawnAvocado() {
    flashAvoEventBanner('🥑 Avocado spotted!', 1100);
    avoCreateItem({
      emoji: '🥑', type: 'avocado', isBad: false, isAvocado: true, points: 10, size: 38,
      catchMessage: 'Avocado secured! 🥑✅'
    });
  }

  function avoSpawnItem() {
    const now = performance.now();
    const sinceLastAvocado = now - avoLastAvocadoSpawnTime;
    // Force an avocado if too much time has passed without one, so the level
    // is always winnable and never goes dry.
    const mustSpawnAvocado = sinceLastAvocado >= AVO_MAX_GAP_WITHOUT_AVOCADO;
    // Otherwise, avocados still make up the bulk of spawns.
    const avocadoChance = 0.5;
    if (mustSpawnAvocado || Math.random() < avocadoChance) {
      avoSpawnAvocado();
      return;
    }
    const badChance = Math.min(0.35, 0.2 + (avoCurrentLevel - 1) * 0.03);
    const isBad = Math.random() < badChance;
    const pool = isBad ? AVO_BAD_ITEMS : AVO_GOOD_ITEMS;
    const def = pool[Math.floor(Math.random() * pool.length)];
    avoCreateItem({ emoji: def.emoji, type: def.type, isBad, points: def.points, size: 34 });
  }

  function avoScheduleSpawn() {
    if (!avoPlaying) return;
    avoSpawnItem();
    const levelSpeedup = (avoCurrentLevel - 1) * 25;
    const interval = Math.max(420, 900 - levelSpeedup);
    avoSpawnTimeoutId = setTimeout(avoScheduleSpawn, interval);
  }

  function avoBadMessageFor(type) {
    if (type === 'reviewer_event') return 'WHY WOULD YOU DO THAT?! 😭';
    return 'OUCH 😭 Nursing student encountered academic damage. -1 life';
  }

  function avoLoseLife(msg) {
    avoLives = Math.max(0, avoLives - 1);
    renderAvoLives();
    flashAvoToast(msg);
    if (avoLives <= 0) {
      avoMessageEl.textContent = 'CODE BLUE! 🚨 Out of lives!';
      avoMissionFailed('You ran out of hearts before finishing all 5 levels.');
    }
  }

  function avoCatchItem(item) {
    avoRemoveItem(item);
    if (item.isBad) {
      avoScore = Math.max(0, avoScore + item.points);
      avoCombo = 0;
      if (item.type === 'stress') avoStressCount += 1;
      avoLoseLife(item.badMessage || avoBadMessageFor(item.type));
    } else {
      avoScore += item.points;
      avoCombo += 1;
      if (item.type === 'avocado' || item.type === 'legendary') avoAvocadoCount += 1;
      if (item.type === 'shake') avoShakeCount += 1;
      flashAvoToast(item.catchMessage || `+${item.points} 🥑`);
      if (avoCombo >= 3) avoShowCombo();
      if (item.type === 'coffee') {
        setTimeout(() => flashAvoToast('Sleep has left the chat. 💀'), 700);
      }
      if (item.type === 'legendary') {
        launchConfetti(16);
        flashAvoEventBanner('LEGENDARY AVOCADO ACQUIRED! 🥑✨', 2000);
      }
      if ((item.type === 'avocado' || item.type === 'legendary') && avoPlaying) {
        avoLevelAvocadoCount += 1;
        avoScoreEl.textContent = avoScore;
        avoCollectionEl.textContent = `🥑 Avocados: ${Math.min(avoLevelAvocadoCount, AVO_AVOCADOS_PER_LEVEL)}/${AVO_AVOCADOS_PER_LEVEL}`;
        if (avoLevelAvocadoCount >= AVO_AVOCADOS_PER_LEVEL) {
          avoLevelComplete();
          return;
        }
      }
    }
    avoScoreEl.textContent = avoScore;
    avoCollectionEl.textContent = `🥑 Avocados: ${Math.min(avoLevelAvocadoCount, AVO_AVOCADOS_PER_LEVEL)}/${AVO_AVOCADOS_PER_LEVEL}`;
  }

  function avoTriggerInstructorEvent() {
    if (!avoPlaying) return;
    flashAvoEventBanner('🚨 INSTRUCTOR DETECTED! ACT NORMAL!! 😭', 2600);
    avoItems.forEach((it) => { it.speed *= 1.5; });
    avoSpeedBoost = 1.5;
    setTimeout(() => { avoSpeedBoost = 1; }, 2800);
  }

  function avoTriggerReviewerEvent() {
    if (!avoPlaying) return;
    flashAvoEventBanner('📚 SURPRISE REVIEWER!', 1600);
    avoCreateItem({ emoji: '📚', type: 'reviewer_event', isBad: true, points: -15, size: 56, extraClass: 'avo-reviewer', badMessage: 'WHY WOULD YOU DO THAT?! 😭 -1 life' });
  }

  function avoTriggerCoffeeEvent() {
    if (!avoPlaying) return;
    flashAvoEventBanner('☕ COFFEE BOOST INCOMING', 1600);
    avoCreateItem({ emoji: '☕', type: 'coffee', isBad: false, points: 20, size: 38, catchMessage: 'Temporary energy acquired. ☕🩺' });
  }

  function avoTriggerLegendaryEvent() {
    if (!avoPlaying) return;
    flashAvoEventBanner('✨ Something legendary is falling...', 1400);
    avoCreateItem({ emoji: '🥑', type: 'legendary', isBad: false, isAvocado: true, points: 50, size: 44, extraClass: 'avo-golden', catchMessage: 'LEGENDARY AVOCADO ACQUIRED! 🥑✨' });
  }

  function avoScheduleLevelEvents() {
    avoEventTimeoutIds.forEach(clearTimeout);
    avoEventTimeoutIds = [
      setTimeout(avoTriggerInstructorEvent, 7000),
      setTimeout(avoTriggerReviewerEvent, 16000),
      setTimeout(avoTriggerCoffeeEvent, 26000),
      setTimeout(avoTriggerLegendaryEvent, 36000)
    ];
  }

  function avoLoop(now) {
    if (!avoPlaying) return;
    const dt = avoLastFrameTime ? Math.min((now - avoLastFrameTime) / 1000, 0.05) : 0.016;
    avoLastFrameTime = now;

    const moveSpeed = 420;
    if (avoKeys.left) avoPlayerX -= moveSpeed * dt;
    if (avoKeys.right) avoPlayerX += moveSpeed * dt;
    clampAvoPlayerX();
    setAvoPlayerPosition();

    const containerHeight = avoContainer.clientHeight || 360;
    const playerLeft = avoPlayerX;
    const playerRight = avoPlayerX + AVO_PLAYER_SIZE;
    const playerTop = containerHeight - AVO_PLAYER_SIZE - 4;

    avoItems.slice().forEach((item) => {
      item.y += item.speed * dt;
      item.el.style.top = item.y + 'px';
      const itemBottom = item.y + item.size;
      if (itemBottom >= playerTop) {
        const overlap = item.x + item.size > playerLeft && item.x < playerRight;
        if (overlap) {
          avoCatchItem(item);
          return;
        }
      }
      if (itemBottom >= containerHeight) {
        // Missing an avocado costs a life so the player always feels the
        // stakes, but missing an obstacle is free — only catching those hurts.
        if (item.isAvocado) {
          avoRemoveItem(item);
          avoLoseLife('Missed the avocado! 😭 -1 life');
        } else {
          avoRemoveItem(item);
        }
      }
    });

    if (avoPlaying) avoRafId = requestAnimationFrame(avoLoop);
  }

  function avoRenderResults() {
    avoResults.classList.remove('hidden');
    avoResults.innerHTML = `
      <p style="font-family:var(--font-display);font-weight:700;font-size:1.15rem;">🥑 ALL 5 LEVELS CLEARED!</p>
      <div class="stats-panel" style="margin-top:10px;">
        <div class="stat"><span class="stat-label">SCORE</span><span class="stat-value">${avoScore}</span></div>
        <div class="stat"><span class="stat-label">AVOCADOS</span><span class="stat-value">${avoAvocadoCount}</span></div>
        <div class="stat"><span class="stat-label">SHAKES</span><span class="stat-value">${avoShakeCount}</span></div>
        <div class="stat"><span class="stat-label">STRESS CAUGHT</span><span class="stat-value">${avoStressCount}</span></div>
      </div>
      <p class="mission-text">LIVES REMAINING: ${avoLives > 0 ? '❤️'.repeat(avoLives) : '💔'}</p>
      <p class="mission-text" style="margin-top:6px;">She made it through every level. She deserves that avocado. 🥑🏆</p>
      <button class="btn btn-primary" id="btn-avo-continue" style="margin-top:10px;">Continue 🧸</button>
    `;
    document.getElementById('btn-avo-continue').addEventListener('click', avoRevealSecretEnding);
  }

  function avoRenderLevelComplete() {
    avoResults.classList.remove('hidden');
    const isLast = avoCurrentLevel >= AVO_MAX_LEVEL;
    avoResults.innerHTML = `
      <p style="font-family:var(--font-display);font-weight:700;font-size:1.15rem;color:var(--pink-deep);">✅ LEVEL ${avoCurrentLevel} COMPLETE!</p>
      <p class="mission-text" style="margin-top:6px;">All 5 avocados caught! 🥑🥑🥑🥑🥑</p>
      <div class="stats-panel" style="margin-top:10px;">
        <div class="stat"><span class="stat-label">SCORE</span><span class="stat-value">${avoScore}</span></div>
        <div class="stat"><span class="stat-label">LIVES LEFT</span><span class="stat-value">${avoLives}</span></div>
      </div>
      <button class="btn btn-primary" id="btn-avo-level-continue" style="margin-top:12px;">${isLast ? 'Finish Mission 🎉' : `Continue to Level ${avoCurrentLevel + 1} →`}</button>
    `;
    document.getElementById('btn-avo-level-continue').addEventListener('click', () => {
      if (isLast) {
        finishAvocadoGame();
      } else {
        avoCurrentLevel += 1;
        avoStartLevel();
      }
    });
  }

  function avoRenderFailure(reason) {
    avoResults.classList.remove('hidden');
    avoResults.innerHTML = `
      <p style="font-family:var(--font-display);font-weight:700;font-size:1.15rem;color:var(--pink-deep);">💀 MISSION FAILED</p>
      <p class="mission-text" style="margin-top:6px;">${reason}</p>
      <div class="stats-panel" style="margin-top:10px;">
        <div class="stat"><span class="stat-label">LEVEL REACHED</span><span class="stat-value">${avoCurrentLevel}/${AVO_MAX_LEVEL}</span></div>
        <div class="stat"><span class="stat-label">SCORE</span><span class="stat-value">${avoScore}</span></div>
      </div>
      <p class="mission-text" style="margin-top:8px;">No avocado shake this time. 😭</p>
      <button class="btn btn-primary" id="btn-avo-retry" style="margin-top:10px;">TRY AGAIN 🔁</button>
    `;
    document.getElementById('btn-avo-retry').addEventListener('click', resetAvocadoIntro);
  }

  function avoRevealSecretEnding() {
    avoResults.innerHTML += `
      <div class="avo-dialogue-box" style="margin-top:14px;">
        <div class="teddy-bounce" aria-hidden="true">🧸</div>
        <p class="avo-dialogue-line">Congratulations, Nurse Ella! You've successfully completed the most important clinical requirement. 🩺</p>
        <p class="avo-dialogue-line">🥑 SECURING THE AVOCADO SHAKE 🥤</p>
        <p class="avo-dialogue-line" style="margin-bottom:0;">Reward unlocked. 🎁</p>
      </div>
      <div class="reward-box">
        <p><strong>🎁 BONUS REWARD</strong></p>
        <p>🥑 Avocado Shake</p>
        <p>🧸 One hardworking nurse</p>
        <p>💕 +100 happiness</p>
      </div>
      <div class="avo-dialogue-box">
        <p class="avo-dialogue-line">Clinical evaluation:</p>
        <p class="avo-stars">Avocado handling: ⭐⭐⭐⭐⭐</p>
        <p class="avo-stars">Stress management: ⭐⭐⭐</p>
        <p class="avo-stars">Nursing survival: ⭐⭐⭐⭐⭐</p>
        <p class="avo-stars">Getting the avocado shake: ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐</p>
        <p class="mission-text" style="margin-top:8px;">Result: PASS. 🩺✅</p>
        <p class="mission-text">No further examinations are required. 😭</p>
      </div>
      <p class="mission-text" style="margin-top:10px;">Okay, jokes aside...</p>
      <p class="mission-text">You deserve a little treat after surviving all those quests. 🥹🥑🥤</p>
      <button class="btn btn-primary" id="btn-avo-claim">CLAIM YOUR AVOCADO 🥑🥤</button>
      <p class="tiny-note">(totally optional, no pressure 🫶)</p>
      <button class="btn btn-secondary" id="btn-avo-restart" style="margin-top:10px;">Play Again</button>
    `;
    document.getElementById('btn-avo-claim').addEventListener('click', (e) => {
      launchConfetti(24);
      showToast('Avocado shake secured. Reward claimed. 🥑🥤');
      e.target.disabled = true;
      e.target.textContent = 'Claimed 💕';
    });
    document.getElementById('btn-avo-restart').addEventListener('click', resetAvocadoIntro);
  }

  function avoStopTimers() {
    clearTimeout(avoSpawnTimeoutId);
    avoEventTimeoutIds.forEach(clearTimeout);
    avoEventTimeoutIds = [];
    cancelAnimationFrame(avoRafId);
  }

  function avoHardStop() {
    if (!avoPlaying) return;
    avoPlaying = false;
    avoStopTimers();
    avoItems.slice().forEach(avoRemoveItem);
  }

  function avoLevelComplete() {
    if (!avoPlaying) return;
    avoPlaying = false;
    avoStopTimers();
    avoItems.slice().forEach(avoRemoveItem);
    avoContainer.classList.add('hidden');
    avoHud.classList.add('hidden');
    avoCollectionEl.classList.add('hidden');
    avoMessageEl.classList.add('hidden');

    avoRenderLevelComplete();
  }

  function avoMissionFailed(reason) {
    if (!avoPlaying) return;
    avoPlaying = false;
    avoStopTimers();
    avoItems.slice().forEach(avoRemoveItem);
    avoContainer.classList.add('hidden');
    avoHud.classList.add('hidden');
    avoCollectionEl.classList.add('hidden');
    avoMessageEl.classList.add('hidden');

    avoRenderFailure(reason);

    adjustStatus('stress', 5);
    saveState();
  }

  function finishAvocadoGame() {
    avoContainer.classList.add('hidden');
    avoHud.classList.add('hidden');
    avoCollectionEl.classList.add('hidden');
    avoMessageEl.classList.add('hidden');

    avoRenderResults();

    const fromXp = state.xp;
    state.xp += Math.max(0, avoScore) + 200;
    animateNumber(elXp, fromXp, state.xp, 700);
    renderQuestStats();
    adjustStatus('motivation', Math.min(15, Math.max(2, Math.round(avoScore / 30))));
    adjustStatus('stress', -8);
    state.avocadoGameCompleted = true;
    checkAchievements();
    checkBonusUnlock();
    saveState();
    launchConfetti(24);
  }

  function startAvocadoGame() {
    avoIntroBox.classList.add('hidden');

    avoScore = 0;
    avoLives = AVO_START_LIVES;
    avoCombo = 0;
    avoAvocadoCount = 0;
    avoShakeCount = 0;
    avoStressCount = 0;
    avoCurrentLevel = 1;
    avoScoreEl.textContent = '0';
    renderAvoLives();

    avoStartLevel();
  }

  function avoStartLevel() {
    avoHud.classList.remove('hidden');
    avoCollectionEl.classList.remove('hidden');
    avoContainer.classList.remove('hidden');
    avoMessageEl.classList.remove('hidden');
    avoResults.classList.add('hidden');
    avoResults.innerHTML = '';

    avoLevelAvocadoCount = 0;
    avoSpeedBoost = 1;
    avoLevelEl.textContent = `Level ${avoCurrentLevel}/${AVO_MAX_LEVEL}`;
    avoCollectionEl.textContent = `🥑 Avocados: 0/${AVO_AVOCADOS_PER_LEVEL}`;
    avoMessageEl.textContent = `Level ${avoCurrentLevel}: catch ${AVO_AVOCADOS_PER_LEVEL} avocados! 🥑`;

    avoItems.slice().forEach(avoRemoveItem);

    const w = avoContainerWidth();
    avoPlayerX = Math.max((w - AVO_PLAYER_SIZE) / 2, 0);
    setAvoPlayerPosition();

    avoPlaying = true;
    avoLastFrameTime = 0;
    avoLevelStartTime = performance.now();
    avoLastAvocadoSpawnTime = avoLevelStartTime;
    clearTimeout(avoSpawnTimeoutId);
    avoScheduleSpawn();
    avoScheduleLevelEvents();
    avoRafId = requestAnimationFrame(avoLoop);
  }

  document.addEventListener('keydown', (e) => {
    if (!avoPlaying) return;
    const key = e.key.toLowerCase();
    if (e.key === 'ArrowLeft' || key === 'a') { avoKeys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight' || key === 'd') { avoKeys.right = true; e.preventDefault(); }
  });
  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (e.key === 'ArrowLeft' || key === 'a') avoKeys.left = false;
    if (e.key === 'ArrowRight' || key === 'd') avoKeys.right = false;
  });

  function avoHandleTouch(e) {
    if (!avoPlaying) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const rect = avoContainer.getBoundingClientRect();
    avoPlayerX = touch.clientX - rect.left - AVO_PLAYER_SIZE / 2;
    clampAvoPlayerX();
    setAvoPlayerPosition();
  }
  avoContainer.addEventListener('touchstart', avoHandleTouch, { passive: false });
  avoContainer.addEventListener('touchmove', avoHandleTouch, { passive: false });

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
    if (state.everCompletedQuestKeys.length >= MESSAGE_UNLOCK_THRESHOLD) {
      messageLockedBlock.classList.add('hidden');
      messageUnlockedBlock.classList.remove('hidden');
      buildMessageCarousel();
    } else {
      const remaining = MESSAGE_UNLOCK_THRESHOLD - state.everCompletedQuestKeys.length;
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
      case 'first_step': return state.everCompletedQuestKeys.length >= 1;
      case 'future_nurse': return state.everCompletedQuestKeys.length >= 3;
      case 'academic_warrior': return state.everCompletedQuestKeys.length >= TOTAL_QUESTS;
      case 'still_standing': return state.xp >= MAX_QUEST_XP;
      case 'actually_smiled': return state.jokeClicks >= 10;
      case 'avocado_survivor': return !!state.bonusUnlocked;
      case 'word_wizard': return !!state.wordSearchCompleted;
      case 'shake_secured': return !!state.avocadoGameCompleted;
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
    if (state.everCompletedQuestKeys.length >= TOTAL_QUESTS) {
      bonusLockedBlock.classList.add('hidden');
      bonusQuestBlock.classList.remove('hidden');
    }
    if (state.finalUnlocked) {
      finalScreenBlock.classList.remove('hidden');
    }
    if (state.bonusUnlocked) {
      const claimBtn = document.getElementById('btn-claim-bonus');
      const claimInstruction = document.getElementById('claim-instruction');
      if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.textContent = 'BONUS QUEST CLAIMED ✅';
      }
      if (claimInstruction) claimInstruction.classList.remove('hidden');
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
    showToast('YAYYY! 🥹💕 Now go tell Francisco Dag-uman you completed it!');
    const claimBtn = document.getElementById('btn-claim-bonus');
    claimBtn.disabled = true;
    claimBtn.textContent = 'BONUS QUEST CLAIMED ✅';
    const claimInstruction = document.getElementById('claim-instruction');
    if (claimInstruction) claimInstruction.classList.remove('hidden');
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

  function openSettingsModal() {
    settingsModal.classList.remove('hidden');
  }
  document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
  const btnSettingsMobile = document.getElementById('btn-settings-mobile');
  if (btnSettingsMobile) btnSettingsMobile.addEventListener('click', openSettingsModal);
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
      everCompletedQuestKeys: [],
      lastQuestResetDate: todayKey(),
      achievements: {},
      jokeClicks: 0,
      energyLevel: DEFAULT_STATUS.energyLevel,
      stressLevel: DEFAULT_STATUS.stressLevel,
      sleepLevel: DEFAULT_STATUS.sleepLevel,
      motivationLevel: DEFAULT_STATUS.motivationLevel,
      bonusUnlocked: false,
      finalUnlocked: false,
      memoryLevel: 3,
      wordSearchCompleted: false,
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
    const claimBtnReset = document.getElementById('btn-claim-bonus');
    if (claimBtnReset) {
      claimBtnReset.disabled = false;
      claimBtnReset.textContent = 'CLAIM BONUS QUEST 🥑🥤';
    }
    const claimInstructionReset = document.getElementById('claim-instruction');
    if (claimInstructionReset) claimInstructionReset.classList.add('hidden');

    gameContainer.innerHTML = '';
    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-primary';
    startBtn.id = 'btn-start-minigame';
    startBtn.textContent = 'Start Mini Game';
    startBtn.addEventListener('click', startHeartsGame);
    gameContainer.appendChild(startBtn);
    gameContainer.appendChild(gameToast);
    gameTimerEl.textContent = '60';
    gameScoreEl.textContent = '0';
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
    dailyResetHappened = checkDailyQuestReset();
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

    // Catch the date rolling over while the app stays open (e.g. left open overnight).
    setInterval(() => {
      if (checkDailyQuestReset()) {
        renderQuestCards();
        renderQuestStats();
        showToast('🌅 New day! Your quests are refreshed — go earn more XP!');
      }
    }, 60000);
  }

  init();
})();
