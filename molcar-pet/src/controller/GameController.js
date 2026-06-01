import { GameLoop } from './GameLoop.js';
import { save }     from '../model/storage.js';

export class GameController {
  #model;
  #view;
  #loop;

  constructor(model, view) {
    this.#model = model;
    this.#view  = view;
    this.#loop  = new GameLoop(() => this.#model.tick());

    this.#view.on('intent', ({ type }) => this.#model.doAction(type));

    this.#model.on('change', (snapshot) => {
      this.#view.render(snapshot);
      save(snapshot);
    });
  }

  start() {
    this.#model.tick();
    this.#loop.start(1000);
  }

  stop() {
    this.#loop.stop();
  }
}
