export class RaceModel {
  constructor() {
    this.reset();
  }

  reset() {
    this.playerY   = 1;
    this.speed      = 2;
    this.score      = 0;
    this.distance   = 0;
    this.obstacles  = [];
    this.running    = false;
    this.gameOver   = false;
    this.tickCount  = 0;
  }

  start() {
    this.reset();
    this.running = true;
  }

  moveUp()   { if (this.playerY > 0) this.playerY--; }
  moveDown() { if (this.playerY < 2) this.playerY++; }

  tick() {
    if (!this.running) return null;

    this.tickCount++;
    this.distance += this.speed;
    this.score = Math.floor(this.distance / 10);

    if (this.tickCount % 8 === 0) {
      this.speed = Math.min(6, 2 + Math.floor(this.distance / 200));
    }

    if (this.tickCount % Math.max(6, 15 - Math.floor(this.distance / 100)) === 0) {
      this.obstacles.push({ lane: Math.floor(Math.random() * 3), x: 6 });
    }

    for (const ob of this.obstacles) {
      ob.x -= 1;
    }

    const hit = this.obstacles.some(ob => ob.x === 0 && ob.lane === this.playerY);
    if (hit) {
      this.running  = false;
      this.gameOver = true;
    }

    this.obstacles = this.obstacles.filter(ob => ob.x >= -1);

    return { playerY: this.playerY, obstacles: [...this.obstacles], score: this.score, gameOver: this.gameOver };
  }
}
