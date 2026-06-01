import { EventEmitter } from '../core/EventEmitter.js';

export class Inventory extends EventEmitter {
  constructor(saved = {}) {
    super();
    this.owned    = saved.owned    ?? {};
    this.equipped = saved.equipped ?? null;
  }

  add(id, n = 1) {
    this.owned[id] = (this.owned[id] ?? 0) + n;
    this.emit('change');
  }

  remove(id, n = 1) {
    this.owned[id] = Math.max(0, (this.owned[id] ?? 0) - n);
    if (this.owned[id] === 0) delete this.owned[id];
    this.emit('change');
  }

  has(id) {
    return (this.owned[id] ?? 0) > 0;
  }

  equip(id) {
    this.equipped = id;
    this.emit('change');
  }

  unequip() {
    this.equipped = null;
    this.emit('change');
  }

  toJSON() {
    return { owned: this.owned, equipped: this.equipped };
  }
}
