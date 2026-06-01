import { EventEmitter } from '../core/EventEmitter.js';
import { CONFIG }       from '../data/config.js';
import { Molcar }       from './Molcar.js';
import { Collection }   from './Collection.js';
import { Inventory }    from './Inventory.js';
import { ITEMS }        from '../data/items.js';
import { rollSpecies, getModifier } from '../data/molcars.js';
import { shouldSpawnWant, createWant, isWantExpired } from './wants.js';

export class GameState extends EventEmitter {
  constructor(saved) {
    super();

    if (saved) {
      this.molcar       = new Molcar(saved.molcar);
      this.coins        = saved.coins        ?? 0;
      this.lastTick     = saved.lastTick     ?? Date.now();
      this.activeWant   = saved.activeWant   ?? null;
      this.lastWantTime = saved.lastWantTime ?? this.lastTick;
      this.collection   = new Collection(saved.collection);
      this.inventory    = new Inventory(saved.inventory);
    } else {
      this.molcar       = new Molcar();
      this.coins        = 0;
      this.lastTick     = Date.now();
      this.activeWant   = null;
      this.lastWantTime = Date.now();
      this.collection   = new Collection();
      this.inventory    = new Inventory();
    }
  }

  tick(now = Date.now()) {
    const elapsed = (now - this.lastTick) / 60_000;
    if (elapsed <= 0) return;

    const mod = getModifier(this.molcar.species);
    const rates = { ...CONFIG.decayPerMinute };
    if (mod.decayReduction) {
      for (const [stat, mult] of Object.entries(mod.decayReduction)) {
        if (rates[stat]) rates[stat] *= mult;
      }
    }
    this.molcar.stats.decay(rates, elapsed);
    this.molcar.ageMinutes += elapsed;
    this.molcar.evolve();

    this.#processWants(now);

    this.lastTick = now;
    this.emit('change', this.snapshot());
  }

  #processWants(now) {
    if (this.activeWant) {
      if (isWantExpired(this.activeWant, now)) {
        this.molcar.careRating = Math.max(0, this.molcar.careRating - CONFIG.wants.reward.care);
        this.activeWant = null;
      }
    }

    if (!this.activeWant && shouldSpawnWant(this.lastWantTime, now)) {
      this.activeWant   = createWant(now);
      this.lastWantTime = now;
    }
  }

  doAction(action) {
    const { restore, driving } = CONFIG;
    const s = this.molcar.stats;
    const mod = getModifier(this.molcar.species);
    const rb = mod.restoreBonus ?? {};

    switch (action) {
      case 'feed':
        s.apply('hunger', restore.feed * (rb.hunger ?? 1));
        break;
      case 'play':
        s.apply('happiness', restore.play * (rb.happiness ?? 1));
        break;
      case 'bath':
        s.apply('cleanliness', restore.bath * (rb.cleanliness ?? 1));
        break;
      case 'sleep':
        s.apply('energy', restore.sleep * (rb.energy ?? 1));
        break;
      case 'drive':
        s.apply('happiness',   driving.happinessGain * (rb.drive_happiness ?? 1));
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

  graduate() {
    if (this.molcar.stage !== 'adult') return false;
    const sp = this.molcar.species ?? 'classic';
    this.collection.discover(sp, this.molcar.careRating);
    this.coins += CONFIG.collection.graduateBonus;
    this.molcar       = new Molcar();
    this.activeWant   = null;
    this.lastWantTime = Date.now();
    this.lastTick     = Date.now();
    this.emit('graduate', { species: sp });
    this.emit('change', this.snapshot());
    return true;
  }

  gacha() {
    if (this.coins < CONFIG.gacha.cost) return { ok: false };
    this.coins -= CONFIG.gacha.cost;
    const species = rollSpecies();
    this.collection.discover(species, 0);
    this.emit('gacha', { species });
    this.emit('change', this.snapshot());
    return { ok: true, species };
  }

  reward(coins = 0, happiness = 0) {
    const mod = getModifier(this.molcar.species);
    this.coins += Math.round(coins * (mod.minigameCoinBonus ?? 1));
    if (happiness) this.molcar.stats.apply('happiness', happiness);
    this.emit('change', this.snapshot());
  }

  buyItem(itemId) {
    const item = ITEMS[itemId];
    if (!item || this.coins < item.price) return false;
    this.coins -= item.price;
    this.inventory.add(itemId);
    this.emit('change', this.snapshot());
    return true;
  }

  useItem(itemId) {
    const item = ITEMS[itemId];
    if (!item || !this.inventory.has(itemId)) return false;

    if (item.type === 'food' && item.effect) {
      this.molcar.stats.apply(item.effect.stat, item.effect.amount);
      this.inventory.remove(itemId);
    } else if (item.type === 'accessory') {
      this.inventory.equip(itemId);
    } else if (item.type === 'ticket') {
      this.inventory.remove(itemId);
      return this.gacha();
    }

    this.emit('change', this.snapshot());
    return true;
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
      collection:   this.collection.toJSON(),
      inventory:    this.inventory.toJSON(),
    };
  }
}
