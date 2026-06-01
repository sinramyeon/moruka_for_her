import { EventEmitter } from '../core/EventEmitter.js';
import { SPECIES_LIST } from '../data/molcars.js';

export class Collection extends EventEmitter {
  constructor(saved = {}) {
    super();
    this.entries = saved.entries ?? {};
  }

  discover(species, careRating = 0, now = Date.now()) {
    const e = this.entries[species] ?? { count: 0, bestCare: 0, firstAt: now };
    e.count   += 1;
    e.bestCare = Math.max(e.bestCare, careRating);
    this.entries[species] = e;
    this.emit('discover', { species, entry: e });
  }

  has(species) {
    return !!this.entries[species];
  }

  progress() {
    return { owned: Object.keys(this.entries).length, total: SPECIES_LIST.length };
  }

  toJSON() {
    return { entries: this.entries };
  }
}
