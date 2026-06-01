import { CONFIG } from '../data/config.js';

const { stageAges, goodCareThreshold } = CONFIG.evolution;

export function getStage(ageMinutes) {
  if (ageMinutes >= stageAges.adult) return 'adult';
  if (ageMinutes >= stageAges.teen)  return 'teen';
  return 'baby';
}

export function resolveSpecies(careRating) {
  return careRating >= goodCareThreshold ? 'shiny' : 'classic';
}
