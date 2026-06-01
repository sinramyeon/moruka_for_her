const SPRITESHEET = 'assets/sprites/molcar_spritesheet.png';
const SHEET_SIZE  = 500;

const FRAMES = [
  { x: 88,  y: 76,  w: 145, h: 86 },
  { x: 267, y: 71,  w: 125, h: 94 },
  { x: 25,  y: 196, w: 126, h: 97 },
  { x: 184, y: 196, w: 126, h: 94 },
  { x: 335, y: 201, w: 145, h: 83 },
  { x: 108, y: 326, w: 128, h: 95 },
  { x: 264, y: 326, w: 134, h: 92 },
];

const FRAME_MS = 220;

let sheetImg = null;
let sheetReady = false;

function loadSheet() {
  if (sheetImg) return sheetImg;
  sheetImg = new Image();
  sheetImg.src = SPRITESHEET;
  sheetImg.onload = () => { sheetReady = true; };
  return sheetImg;
}

loadSheet();

const DRAW_W = 145;
const DRAW_H = 97;

export function createMolcarImage() {
  const canvas = document.createElement('canvas');
  canvas.className = 'molcar-sprite';
  canvas.width  = DRAW_W;
  canvas.height = DRAW_H;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let frameIdx = 0;
  let lastTime = 0;

  function draw(timestamp) {
    if (!sheetReady) {
      requestAnimationFrame(draw);
      return;
    }

    if (!lastTime) lastTime = timestamp;
    if (timestamp - lastTime >= FRAME_MS) {
      frameIdx = (frameIdx + 1) % FRAMES.length;
      lastTime = timestamp;
    }

    const f = FRAMES[frameIdx];
    ctx.clearRect(0, 0, DRAW_W, DRAW_H);
    const scale = Math.min(DRAW_W / f.w, DRAW_H / f.h);
    const dw = f.w * scale;
    const dh = f.h * scale;
    const dx = (DRAW_W - dw) / 2;
    const dy = (DRAW_H - dh) / 2;
    ctx.drawImage(sheetImg, f.x, f.y, f.w, f.h, dx, dy, dw, dh);

    canvas._raf = requestAnimationFrame(draw);
  }

  canvas._raf = requestAnimationFrame(draw);

  const observer = new MutationObserver(() => {
    if (!document.contains(canvas)) {
      cancelAnimationFrame(canvas._raf);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return canvas;
}
