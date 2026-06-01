import { EventEmitter } from '../core/EventEmitter.js';

const COLS  = 7;
const ROWS  = 3;
const CELL  = 28;
const PAD   = 4;
const W     = COLS * CELL + PAD * 2;
const H     = ROWS * CELL + PAD * 2 + 30;

export class RaceView extends EventEmitter {
  #canvas;
  #ctx;

  constructor(container) {
    super();
    this.#canvas = document.createElement('canvas');
    this.#canvas.className = 'race-canvas';
    this.#canvas.width  = W;
    this.#canvas.height = H;
    container.appendChild(this.#canvas);

    this.#ctx = this.#canvas.getContext('2d');
    this.#ctx.imageSmoothingEnabled = false;

    this.#canvas.addEventListener('click', (e) => {
      const rect = this.#canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const mid = rect.height / 2;
      this.emit('input', y < mid ? 'up' : 'down');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w')   this.emit('input', 'up');
      if (e.key === 'ArrowDown' || e.key === 's') this.emit('input', 'down');
    });
  }

  render(state) {
    const ctx = this.#ctx;
    ctx.fillStyle = '#fff4e8';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ff8000';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`SCORE: ${state.score}`, W / 2, 16);

    const ox = PAD;
    const oy = 24;

    for (let r = 0; r < ROWS; r++) {
      ctx.fillStyle = r % 2 === 0 ? '#ffe5ca' : '#ffddb8';
      ctx.fillRect(ox, oy + r * CELL, COLS * CELL, CELL);
    }

    ctx.fillStyle = '#ff8000';
    ctx.font = '18px monospace';
    ctx.fillText('🚗', ox + CELL / 2, oy + state.playerY * CELL + CELL / 2 + 6);

    ctx.fillStyle = '#666';
    for (const ob of state.obstacles) {
      if (ob.x >= 0 && ob.x < COLS) {
        ctx.fillText('🪨', ox + ob.x * CELL + CELL / 2, oy + ob.lane * CELL + CELL / 2 + 6);
      }
    }

    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 8);
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(`${state.score} PTS`, W / 2, H / 2 + 12);
    }
  }

  renderStart() {
    const ctx = this.#ctx;
    ctx.fillStyle = '#fff4e8';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ff8000';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RACE!', W / 2, H / 2 - 10);
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('TAP OR ↑↓', W / 2, H / 2 + 10);
  }

  destroy() {
    this.#canvas.remove();
  }
}
