import { EventEmitter } from '../core/EventEmitter.js';
import { CONFIG }       from '../data/config.js';
import { Molcar }       from './Molcar.js';
import { shouldSpawnWant, createWant, isWantExpired } from './wants.js';

export class GameState extends EventEmitter {
  constructor(saved) {
    super();

    if (saved) {
      this.molcar      = new Molcar(saved.molcar);
      this.coins       = saved.coins       ?? 0;
      this.lastTick    = saved.lastTick    ?? Date.now();
      this.activeWant  = saved.activeWant  ?? null;
      this.lastWantTime = saved.lastWantTime ?? this.lastTick;
    } else {
      this.molcar       = new Molcar();
      this.coins        = 0;
      this.lastTick     = Date.now();
      this.activeWant   = null;
      this.lastWantTime = Date.now();
    }
  }

  tick(now = Date.now()) {
    const elapsed = (now - this.lastTick) / 60_000;
    if (elapsed <= 0) return;

    this.molcar.stats.decay(CONFIG.decayPerMinute, elapsed);
    this.molcar.ageMinutes += elapsed;
    this.molcar.evolve();

    this.#processWants(now, elapsed);

    this.lastTick = now;
    this.emit('change', this.snapshot());
  }

  #processWants(now, elapsedMin) {
    if (this.activeWant) {
      if (isWantExpired(this.activeWant, now)) {
        this.molcar.careRating = Math.max(0, this.molcar.careRating - CONFIG.wants.reward.care);
        this.activeWant = null;
      }
    }

    if (!this.activeWant && shouldSpawnWant(this.lastWantTime, now)) {
      this.activeWant  = createWant(now);
      this.lastWantTime = now;
    }
  }

  doAction(action) {
    const { restore, driving } = CONFIG;
    const s = this.molcar.stats;

    switch (action) {
      case 'feed':
        s.apply('hunger', restore.feed);
        break;
      case 'play':
        s.apply('happiness', restore.play);
        break;
      case 'bath':
        s.apply('cleanliness', restore.bath);
        break;
      case 'sleep':
        s.apply('energy', restore.sleep);
        break;
      case 'drive':
        s.apply('happiness',   driving.happinessGain);
        s.apply('cleanliness', -driving.cleanlinessCost);
        break;
      default:
        return;
    }

    if (this.activeWant && this.activeWant.type === action) {
      this.coins += CONFIG.wants.reward.coins;
      this.molcar.careRating = Math.min(100, this.molcar.careRating + CONFIG.wants.reward.care);
      this.activeWant = null;
    }

    this.emit('change', this.snapshot());
  }

  reset() {
    this.molcar       = new Molcar();
    this.coins        = 0;
    this.lastTick     = Date.now();
    this.activeWant   = null;
    this.lastWantTime = Date.now();
    this.emit('change', this.snapshot());
  }

  snapshot() {
    return {
      molcar:       this.molcar.toJSON(),
      coins:        this.coins,
      lastTick:     this.lastTick,
      activeWant:   this.activeWant,
      lastWantTime: this.lastWantTime,
    };
  }
}
