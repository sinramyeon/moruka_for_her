import { GameLoop }       from './GameLoop.js';
import { RaceController } from '../minigame/RaceController.js';
import { save }           from '../model/storage.js';
import { SPECIES }        from '../data/molcars.js';

export class GameController {
  #model;
  #view;
  #loop;
  #race = null;

  constructor(model, view) {
    this.#model = model;
    this.#view  = view;
    this.#loop  = new GameLoop(() => this.#model.tick());

    this.#view.on('intent', (intent) => this.#handleIntent(intent));

    this.#model.on('change', (snapshot) => {
      this.#view.render(snapshot);
      save(snapshot);
    });

    this.#model.on('graduate', ({ species }) => {
      const sp = SPECIES[species];
      this.#view.showGlobalToast(`🎓 ${sp?.name ?? species} 졸업!`);
    });

    this.#model.on('gacha', ({ species }) => {
      const sp = SPECIES[species];
      this.#view.showGlobalToast(`🎰 ${sp?.emoji ?? '?'} ${sp?.name ?? species} 획득!`);
    });
  }

  #handleIntent(intent) {
    switch (intent.type) {
      case 'feed':
      case 'play':
      case 'bath':
      case 'sleep':
      case 'drive':
        this.#model.doAction(intent.type);
        break;

      case 'graduate':
        this.#model.graduate();
        break;

      case 'gacha':
        this.#model.gacha();
        break;

      case 'buy':
        if (this.#model.buyItem(intent.itemId)) {
          this.#view.showGlobalToast('구매 완료!');
        } else {
          this.#view.showGlobalToast('코인이 부족해요!');
        }
        break;

      case 'use':
        this.#model.useItem(intent.itemId);
        break;

      case 'navigate':
        if (intent.screen === 'minigame') this.#startMinigame();
        break;
    }
  }

  #startMinigame() {
    if (this.#race) this.#race.destroy();
    const container = this.#view.getMinigameContainer();
    this.#race = new RaceController(container, (coins, happiness) => {
      this.#model.reward(coins, happiness);
      this.#view.showGlobalToast(`+${coins}🪙 +${happiness}😊`);
      this.#race = null;
      this.#view.exitMinigame();
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
