import { EventEmitter }      from '../core/EventEmitter.js';
import { createMolcarImage } from './sprites.js';
import { createRoomSVG, createPoopElement } from './room.js';
import { SPECIES, SPECIES_LIST } from '../data/molcars.js';
import { ITEMS, ITEMS_LIST }     from '../data/items.js';

const STAT_META = [
  { key: 'hunger',      label: '배고픔', icon: '🥬' },
  { key: 'happiness',   label: '행복',   icon: '😊' },
  { key: 'cleanliness', label: '청결',   icon: '✨' },
  { key: 'energy',      label: '에너지', icon: '⚡' },
];

const ACTIONS = [
  { action: 'feed',  label: '밥주기',     icon: '🥬', stat: '배고픔' },
  { action: 'play',  label: '놀아주기',   icon: '🎮', stat: '행복' },
  { action: 'bath',  label: '씻기기',     icon: '🛁', stat: '청결' },
  { action: 'sleep', label: '재우기',     icon: '😴', stat: '에너지' },
  { action: 'drive', label: '드라이브',   icon: '🚗', stat: '행복↑청결↓' },
];

const WANT_ICONS    = { feed: '🥬', play: '🎮', bath: '🛁' };
const ACTION_TOASTS = {
  feed: '+배고픔!', play: '+행복!', bath: '+청결!',
  sleep: '+에너지!', drive: '+행복 -청결!',
};

function barColor(v) {
  if (v < 25) return 'bar--danger';
  if (v < 50) return 'bar--warning';
  return 'bar--good';
}

function getMood(s) {
  if (s.hunger < 20)      return { emoji: '😫', distress: true };
  if (s.energy < 20)      return { emoji: '😴', distress: true };
  if (s.happiness < 20)   return { emoji: '😢', distress: true };
  if (s.cleanliness < 20) return { emoji: '🤢', distress: true };
  const avg = (s.hunger + s.happiness + s.cleanliness + s.energy) / 4;
  if (avg > 75) return { emoji: '😊', distress: false };
  if (avg > 50) return { emoji: '🙂', distress: false };
  return { emoji: '😐', distress: false };
}

function poopCount(c) {
  if (c >= 70) return 0;
  if (c >= 45) return 1;
  if (c >= 20) return 2;
  return 3;
}

export class GameView extends EventEmitter {
  #root;
  #els = {};
  #molcarCreated = false;
  #screen = 'room';
  #lastState = null;
  #poops = 0;

  constructor(rootSelector) {
    super();
    this.#root = document.querySelector(rootSelector);
    this.#build();
  }

  #build() {
    this.#root.innerHTML = `
      <div class="device">
        <div class="faceplate"></div>
        <span class="device-logo">MOLCAR</span>

        <div class="screen">
          <div class="screen-inner">
            <div class="screen-content"></div>
          </div>
        </div>

        <div class="shell-buttons">
          <button class="shell-btn side" data-shell="actions" title="행동"></button>
          <button class="shell-btn"      data-shell="dex"     title="도감"></button>
          <button class="shell-btn side" data-shell="stats"   title="상태"></button>
        </div>
      </div>
    `;

    this.#els.content = this.#root.querySelector('.screen-content');
    this.#els.shellBtns = this.#root.querySelector('.shell-buttons');

    this.#els.shellBtns.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-shell]');
      if (!btn) return;
      const target = btn.dataset.shell;

      if (this.#screen === target) {
        this.#screen = 'room';
      } else {
        this.#screen = target;
      }

      this.#molcarCreated = false;
      if (this.#lastState) this.render(this.#lastState);
    });

    this.#buildRoom();
  }

  /* ── Intro screen ── */
  showIntro() {
    this.#screen = 'intro';
    const pages = [
      {
        title: '뿌이뿌이 모루카!',
        text: '모루카는 기니피그와\n자동차가 합쳐진\n귀여운 생명체예요.\n양상추를 먹고, 당근의\n유혹에 넘어가며,\n뽈뽈거리며 걸어요!',
      },
      {
        title: '모루카를 키워보세요',
        text: '밥을 주고, 놀아주고,\n씻기고, 재워주세요.\n잘 돌봐주면 멋진\n모루카로 성장해요!\n\n아기 → 청소년 → 성체',
      },
      {
        title: '5인방을 모아보세요',
        text: '🥔 포테토 — 먹보\n🤍 시로모 — 신중파\n🍫 민트초코 — 라이벌\n🌹 아비 — 멋쟁이\n🧸 테디 — 스피드스타\n\n케어에 따라 결정돼요!',
      },
    ];

    let idx = 0;

    const renderPage = () => {
      const p = pages[idx];
      const isLast = idx === pages.length - 1;
      this.#els.content.innerHTML = `
        <div class="intro-dialog">
          <div class="intro-text surface">
            <div class="intro-title">${p.title}</div>
            <div class="intro-body">${p.text}</div>
          </div>
          <button class="intro-btn surface">${isLast ? '시작하기!' : '다음 →'}</button>
        </div>
      `;
      this.#els.content.querySelector('.intro-btn').addEventListener('click', () => {
        idx++;
        if (idx < pages.length) {
          renderPage();
        } else {
          this.#screen = 'room';
          this.#molcarCreated = false;
          this.emit('intro-done');
        }
      });
    };

    renderPage();
  }

  /* ── Room screen (default) ── */
  #buildRoom() {
    this.#els.content.innerHTML = `
      <div class="stage-area">
        <div class="room-bg">${createRoomSVG()}</div>
        <div class="poop-layer"></div>
        <div class="molcar-walker">
          <div class="mood-bubble"></div>
          <div class="accessory-layer"></div>
          <div class="molcar-container"></div>
        </div>
        <div class="want-bubble" hidden></div>
      </div>
    `;
    this.#cacheRoomEls();
  }

  #cacheRoomEls() {
    this.#els.stageArea  = this.#els.content.querySelector('.stage-area');
    this.#els.molcar     = this.#els.content.querySelector('.molcar-container');
    this.#els.moodBubble = this.#els.content.querySelector('.mood-bubble');
    this.#els.poopLayer  = this.#els.content.querySelector('.poop-layer');
    this.#els.wantBubble = this.#els.content.querySelector('.want-bubble');
    this.#els.accessory  = this.#els.content.querySelector('.accessory-layer');

    this.#els.molcar?.addEventListener('click', () => {
      const sp = this.#els.molcar.querySelector('.molcar-sprite');
      if (!sp) return;
      sp.classList.remove('tapped');
      void sp.offsetWidth;
      sp.classList.add('tapped');
      sp.addEventListener('animationend', () => sp.classList.remove('tapped'), { once: true });
      this.#spawnHeart();
    });
  }

  /* ── Actions screen ── */
  #buildActions() {
    this.#els.content.innerHTML = `
      <div class="panel-actions">
        <div class="panel-title surface">🎮 행동</div>
        <div class="actions-grid"></div>
      </div>
    `;
    const grid = this.#els.content.querySelector('.actions-grid');
    ACTIONS.forEach(({ action, label, icon }) => {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.dataset.action = action;
      btn.innerHTML = `<span class="action-btn__icon">${icon}</span><span class="action-btn__label">${label}</span>`;
      grid.appendChild(btn);
    });

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      this.emit('intent', { type: action });
      this.#screen = 'room';
      this.#molcarCreated = false;
      if (this.#lastState) this.render(this.#lastState);
      this.#showToast(ACTION_TOASTS[action] ?? '');
    });
  }

  /* ── Dex screen ── */
  #buildDex(state) {
    const coll = state.collection;
    const owned = Object.keys(coll?.entries ?? {}).length;
    let html = `<div class="panel-dex">
      <div class="panel-title surface">📖 도감 ${owned}/${SPECIES_LIST.length}</div>
      <div class="dex-grid">`;
    SPECIES_LIST.forEach(sp => {
      const entry = coll?.entries?.[sp.id];
      const found = !!entry;
      html += `<div class="dex-card ${found ? 'dex-card--found' : 'dex-card--unknown'}">
        <span class="dex-card__emoji">${found ? sp.emoji : '❓'}</span>
        <span class="dex-card__name">${found ? sp.name : '???'}</span>
        ${found ? `<span class="dex-card__count">x${entry.count}</span>` : ''}
      </div>`;
    });
    html += `</div>
      <button class="gacha-btn surface">🎰 가챠 (${state.coins >= 100 ? '100🪙' : '부족'})</button>
    </div>`;
    this.#els.content.innerHTML = html;
    this.#els.content.querySelector('.gacha-btn')?.addEventListener('click', () => {
      this.emit('intent', { type: 'gacha' });
    });
  }

  /* ── Stats screen ── */
  #buildStats(state) {
    const { molcar, coins } = state;
    let html = `<div class="panel-stats">
      <div class="panel-title surface">
        ${molcar.name} ${this.#stageLabel(molcar)} <span style="margin-left:auto">🪙${coins}</span>
      </div>
      <div class="stats-bars surface">`;
    STAT_META.forEach(({ key, label, icon }) => {
      const v = Math.round(molcar.stats[key]);
      html += `<div class="stat-bar">
        <span class="stat-bar__label">${icon} ${label}</span>
        <div class="stat-bar__track"><div class="stat-bar__fill ${barColor(v)}" style="width:${v}%"></div></div>
        <span class="stat-bar__value">${v}</span>
      </div>`;
    });
    html += `</div>`;
    if (molcar.stage === 'adult') {
      html += `<button class="graduate-btn">🎓 졸업시키기</button>`;
    }
    html += `</div>`;
    this.#els.content.innerHTML = html;
    this.#els.content.querySelector('.graduate-btn')?.addEventListener('click', () => {
      this.emit('intent', { type: 'graduate' });
    });
  }

  /* ── Minigame ── */
  getMinigameContainer() {
    this.#screen = 'minigame';
    this.#els.content.innerHTML = `<div class="screen-minigame"></div>`;
    return this.#els.content.querySelector('.screen-minigame');
  }
  exitMinigame() {
    this.#screen = 'room';
    this.#molcarCreated = false;
    if (this.#lastState) this.render(this.#lastState);
  }

  /* ── Main render dispatch ── */
  render(state) {
    this.#lastState = state;
    switch (this.#screen) {
      case 'room':    this.#renderRoom(state); break;
      case 'actions': this.#buildActions(); break;
      case 'dex':     this.#buildDex(state); break;
      case 'stats':   this.#buildStats(state); break;
    }
  }

  #renderRoom(state) {
    const { molcar, activeWant, inventory } = state;
    if (!this.#els.molcar || !document.contains(this.#els.molcar)) {
      this.#buildRoom();
      this.#molcarCreated = false;
    }

    if (!this.#molcarCreated) {
      this.#molcarCreated = true;
      this.#els.molcar.innerHTML = '';
      this.#els.molcar.appendChild(createMolcarImage());
    }

    const mood = getMood(molcar.stats);
    this.#els.moodBubble.textContent = mood.emoji;
    this.#els.moodBubble.classList.toggle('mood--distress', mood.distress);

    const pc = poopCount(molcar.stats.cleanliness);
    if (pc !== this.#poops) {
      this.#poops = pc;
      this.#els.poopLayer.innerHTML = '';
      const pos = [
        { left: '15%', bottom: '8px' },
        { left: '55%', bottom: '12px' },
        { left: '75%', bottom: '5px' },
      ];
      for (let i = 0; i < pc; i++) {
        const p = createPoopElement();
        p.style.left = pos[i].left;
        p.style.bottom = pos[i].bottom;
        this.#els.poopLayer.appendChild(p);
      }
    }

    if (!activeWant) {
      this.#els.wantBubble.hidden = true;
    } else {
      this.#els.wantBubble.hidden = false;
      this.#els.wantBubble.textContent = `💭 ${WANT_ICONS[activeWant.type] ?? '?'}`;
    }

    const eq = inventory?.equipped;
    this.#els.accessory.textContent = eq ? (ITEMS[eq]?.emoji ?? '') : '';
  }

  #spawnHeart() {
    if (!this.#els.stageArea) return;
    const hearts = ['❤️', '🧡', '💛', '💚', '💗'];
    const el = document.createElement('span');
    el.className = 'heart-burst';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.top  = `${20 + Math.random() * 30}%`;
    this.#els.stageArea.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  #showToast(text) {
    if (!this.#els.stageArea) return;
    const el = document.createElement('span');
    el.className = 'action-toast';
    el.textContent = text;
    this.#els.stageArea.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  showGlobalToast(text) {
    const inner = this.#root.querySelector('.screen-inner');
    if (!inner) return;
    const el = document.createElement('div');
    el.className = 'global-toast';
    el.textContent = text;
    inner.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  #stageLabel(molcar) {
    const stages = { baby: '아기', teen: '청소년', adult: '성체' };
    const sp = SPECIES[molcar.species];
    return `${stages[molcar.stage] ?? molcar.stage}${sp ? ` ${sp.emoji}` : ''}`;
  }
}
