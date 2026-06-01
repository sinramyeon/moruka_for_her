import { RaceModel } from './RaceModel.js';
import { RaceView }  from './RaceView.js';
import { CONFIG }    from '../data/config.js';

export class RaceController {
  #model;
  #view;
  #interval = null;
  #onFinish;

  constructor(container, onFinish) {
    this.#model    = new RaceModel();
    this.#view     = new RaceView(container);
    this.#onFinish = onFinish;

    this.#view.on('input', (dir) => {
      if (this.#model.gameOver) {
        this.destroy();
        return;
      }
      if (!this.#model.running) {
        this.#startRace();
        return;
      }
      if (dir === 'up')   this.#model.moveUp();
      if (dir === 'down') this.#model.moveDown();
    });

    this.#view.renderStart();
  }

  #startRace() {
    this.#model.start();
    this.#interval = setInterval(() => this.#tick(), 150);
  }

  #tick() {
    const state = this.#model.tick();
    if (!state) return;
    this.#view.render(state);

    if (state.gameOver) {
      clearInterval(this.#interval);
      this.#interval = null;
      const coins = state.score * CONFIG.minigame.coinPerPoint;
      const happiness = CONFIG.minigame.happinessOnFinish;
      setTimeout(() => this.#onFinish(coins, happiness), 1200);
    }
  }

  destroy() {
    if (this.#interval) clearInterval(this.#interval);
    this.#view.destroy();
  }
}
