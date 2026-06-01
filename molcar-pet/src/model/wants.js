import { CONFIG } from '../data/config.js';

const WANT_TYPES = ['feed', 'play', 'bath'];

export function shouldSpawnWant(lastWantTime, now) {
  const elapsed = (now - lastWantTime) / 60_000;
  return elapsed >= CONFIG.wants.intervalMin;
}

export function createWant(now) {
  const type = WANT_TYPES[Math.floor(Math.random() * WANT_TYPES.length)];
  return { type, createdAt: now };
}

export function isWantExpired(want, now) {
  return (now - want.createdAt) / 60_000 >= CONFIG.wants.timeoutMin;
}
