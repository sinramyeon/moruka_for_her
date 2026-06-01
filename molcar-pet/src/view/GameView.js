import { EventEmitter }      from '../core/EventEmitter.js';
import { createMolcarImage } from './sprites.js';

const STAT_META = [
  { key: 'hunger',      label: '배고픔', icon: '🥬' },
  { key: 'happiness',   label: '행복',   icon: '😊' },
  { key: 'cleanliness', label: '청결',   icon: '✨' },
  { key: 'energy',      label: '에너지', icon: '⚡' },
];

const ACTIONS = [
  { action: 'feed',  label: '밥주기',     icon: '🥬' },
  { action: 'play',  label: '놀아주기',   icon: '🎮' },
  { action: 'bath',  label: '똥치우기',   icon: '🧹' },
];

const WANT_ICONS = { feed: '🥬', play: '🎮', bath: '🧹' };

const ACTION_TOASTS = { feed: '+밥!', play: '+놀이!', bath: '청소!' };

function barColor(val) {
  if (val < 25) return 'bar--danger';
  if (val < 50) return 'bar--warning';
  return 'bar--good';
}

export class GameView extends EventEmitter {
  #root;
  #els = {};
  #molcarCreated = false;

  constructor(rootSelector) {
    super();
    this.#root = document.querySelector(rootSelector);
    this.#buildDOM();
    this.#bindButtons();
    this.#bindMolcarTap();
  }

  #buildDOM() {
    this.#root.innerHTML = `
      <div class="device">
        <div class="faceplate"></div>
        <span class="device-logo">MOLCAR</span>

        <div class="screen">
          <div class="screen-inner">
            <div class="hud">
              <div class="hud__info">
                <span class="hud__name"></span>
                <span class="hud__stage"></span>
                <span class="hud__coins">🪙 0</span>
              </div>
              <div class="hud__bars"></div>
            </div>

            <div class="stage-area">
              <div class="want-bubble" hidden></div>
              <div class="molcar-container"></div>
            </div>

            <div class="actions"></div>
          </div>
        </div>

        <div class="shell-buttons">
          <button class="shell-btn side" data-shell="left"></button>
          <button class="shell-btn" data-shell="main"></button>
          <button class="shell-btn side" data-shell="right"></button>
        </div>
      </div>
    `;

    this.#els.name       = this.#root.querySelector('.hud__name');
    this.#els.stage      = this.#root.querySelector('.hud__stage');
    this.#els.coins      = this.#root.querySelector('.hud__coins');
    this.#els.bars       = this.#root.querySelector('.hud__bars');
    this.#els.wantBubble = this.#root.querySelector('.want-bubble');
    this.#els.molcar     = this.#root.querySelector('.molcar-container');
    this.#els.stageArea  = this.#root.querySelector('.stage-area');
    this.#els.actions    = this.#root.querySelector('.actions');

    STAT_META.forEach(({ key, label, icon }) => {
      const bar = document.createElement('div');
      bar.className = 'stat-bar';
      bar.dataset.stat = key;
      bar.innerHTML = `
        <span class="stat-bar__label">${icon} ${label}</span>
        <div class="stat-bar__track">
          <div class="stat-bar__fill"></div>
        </div>
        <span class="stat-bar__value">100</span>
      `;
      this.#els.bars.appendChild(bar);
    });

    ACTIONS.forEach(({ action, label, icon }) => {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.dataset.action = action;
      btn.innerHTML = `<span class="action-btn__icon">${icon}</span><span class="action-btn__label">${label}</span>`;
      this.#els.actions.appendChild(btn);
    });
  }

  #bindButtons() {
    this.#els.actions.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;

      btn.classList.remove('pressed');
      void btn.offsetWidth;
      btn.classList.add('pressed');
      btn.addEventListener('animationend', () => btn.classList.remove('pressed'), { once: true });

      this.#showToast(ACTION_TOASTS[action] ?? action);

      this.emit('intent', { type: action });
    });
  }

  #bindMolcarTap() {
    this.#els.molcar.addEventListener('click', () => {
      const sprite = this.#els.molcar.querySelector('.molcar-sprite');
      if (!sprite) return;

      sprite.classList.remove('tapped');
      void sprite.offsetWidth;
      sprite.classList.add('tapped');
      sprite.addEventListener('animationend', () => sprite.classList.remove('tapped'), { once: true });

      this.#spawnHeart();
    });
  }

  #spawnHeart() {
    const hearts = ['❤️', '🧡', '💛', '💚', '💗'];
    const el = document.createElement('span');
    el.className = 'heart-burst';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = `${40 + Math.random() * 40}%`;
    el.style.top  = `${30 + Math.random() * 30}%`;
    this.#els.stageArea.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  #showToast(text) {
    const el = document.createElement('span');
    el.className = 'action-toast';
    el.textContent = text;
    this.#els.stageArea.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  render(state) {
    const { molcar, coins, activeWant } = state;

    this.#els.name.textContent  = molcar.name;
    this.#els.stage.textContent = this.#stageLabel(molcar);
    this.#els.coins.textContent = `🪙 ${coins}`;

    STAT_META.forEach(({ key }) => {
      const val  = Math.round(molcar.stats[key]);
      const bar  = this.#els.bars.querySelector(`[data-stat="${key}"]`);
      const fill = bar.querySelector('.stat-bar__fill');
      const num  = bar.querySelector('.stat-bar__value');
      fill.style.width = `${val}%`;
      fill.className   = `stat-bar__fill ${barColor(val)}`;
      num.textContent  = val;
    });

    this.#renderMolcar(molcar);
    this.#renderWant(activeWant);
  }

  #renderMolcar(molcar) {
    if (this.#molcarCreated) return;
    this.#molcarCreated = true;
    this.#els.molcar.innerHTML = '';
    this.#els.molcar.appendChild(createMolcarImage(molcar));
  }

  #renderWant(want) {
    if (!want) {
      this.#els.wantBubble.hidden = true;
      return;
    }
    this.#els.wantBubble.hidden = false;
    this.#els.wantBubble.textContent = `💭 ${WANT_ICONS[want.type] ?? '?'}`;
  }

  #stageLabel(molcar) {
    const stages = { baby: '아기', teen: '청소년', adult: '성체' };
    const speciesLabel = molcar.species === 'shiny' ? '🌟' : '';
    return `${stages[molcar.stage] ?? molcar.stage} ${speciesLabel}`;
  }
}
