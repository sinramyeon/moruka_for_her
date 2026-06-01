export class GameLoop {
  #id = null;
  #callback;

  constructor(callback) {
    this.#callback = callback;
  }

  start(intervalMs = 1000) {
    this.stop();
    this.#id = setInterval(() => this.#callback(), intervalMs);
  }

  stop() {
    if (this.#id !== null) {
      clearInterval(this.#id);
      this.#id = null;
    }
  }
}
