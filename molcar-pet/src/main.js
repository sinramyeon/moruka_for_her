import { GameState }      from './model/GameState.js';
import { load }           from './model/storage.js';
import { GameView }       from './view/GameView.js';
import { GameController } from './controller/GameController.js';

const saved = load();
const model = new GameState(saved);
const view  = new GameView('#app');
const ctrl  = new GameController(model, view);

if (!saved) {
  view.showIntro();
  view.on('intro-done', () => ctrl.start());
} else {
  ctrl.start();
}
