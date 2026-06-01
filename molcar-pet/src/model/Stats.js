const clamp = (v) => Math.max(0, Math.min(100, v));

export class Stats {
  constructor({ hunger = 100, happiness = 100, cleanliness = 100, energy = 100 } = {}) {
    this.hunger      = clamp(hunger);
    this.happiness   = clamp(happiness);
    this.cleanliness = clamp(cleanliness);
    this.energy      = clamp(energy);
  }

  decay(decayRates, minutes) {
    this.hunger      = clamp(this.hunger      - decayRates.hunger      * minutes);
    this.happiness   = clamp(this.happiness   - decayRates.happiness   * minutes);
    this.cleanliness = clamp(this.cleanliness - decayRates.cleanliness * minutes);
    this.energy      = clamp(this.energy      - decayRates.energy      * minutes);
  }

  apply(stat, amount) {
    this[stat] = clamp(this[stat] + amount);
  }

  toJSON() {
    return {
      hunger:      this.hunger,
      happiness:   this.happiness,
      cleanliness: this.cleanliness,
      energy:      this.energy,
    };
  }
}
