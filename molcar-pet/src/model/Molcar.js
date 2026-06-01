import { Stats } from './Stats.js';
import { getStage, resolveSpecies } from './evolution.js';

export class Molcar {
  constructor({
    name       = '모루카',
    species    = null,
    stage      = 'baby',
    ageMinutes = 0,
    careRating = 50,
    stats      = {},
  } = {}) {
    this.name       = name;
    this.species    = species;
    this.stage      = stage;
    this.ageMinutes = ageMinutes;
    this.careRating = Math.max(0, Math.min(100, careRating));
    this.stats      = new Stats(stats);
  }

  evolve() {
    const prev = this.stage;
    this.stage = getStage(this.ageMinutes);

    if (prev !== 'adult' && this.stage === 'adult' && !this.species) {
      this.species = resolveSpecies(this.careRating);
    }
  }

  toJSON() {
    return {
      name:       this.name,
      species:    this.species,
      stage:      this.stage,
      ageMinutes: this.ageMinutes,
      careRating: this.careRating,
      stats:      this.stats.toJSON(),
    };
  }
}
