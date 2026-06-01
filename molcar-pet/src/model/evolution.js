import { CONFIG } from '../data/config.js';

const { stageAges } = CONFIG.evolution;

export function getStage(ageMinutes) {
  if (ageMinutes >= stageAges.adult) return 'adult';
  if (ageMinutes >= stageAges.teen)  return 'teen';
  return 'baby';
}

export function resolveSpecies(careRating) {
  if (careRating >= 85) return 'teddy';
  if (careRating >= 70) return 'abbie';
  if (careRating >= 50) return 'choco';
  if (careRating >= 30) return 'potato';
  return 'shiromo';
}
