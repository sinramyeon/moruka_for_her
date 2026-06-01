export const SPECIES = {
  potato: {
    id: 'potato', name: '포테토', color: '#F2C14E', rarity: 'common', emoji: '🥔',
    trait: '먹보 — 양상추 회복량 +20%',
    modifier: { restoreBonus: { hunger: 1.2 } },
  },
  shiromo: {
    id: 'shiromo', name: '시로모', color: '#F5F0E6', rarity: 'common', emoji: '🤍',
    trait: '신중 — 청결 감소 속도 -20%',
    modifier: { decayReduction: { cleanliness: 0.8 } },
  },
  choco: {
    id: 'choco', name: '민트초코', color: '#7FB7A3', rarity: 'uncommon', emoji: '🍫',
    trait: '라이벌 — 미니게임 코인 +15%',
    modifier: { minigameCoinBonus: 1.15 },
  },
  abbie: {
    id: 'abbie', name: '아비', color: '#D64545', rarity: 'rare', emoji: '🌹',
    trait: '멋쟁이 — 행복 감소 속도 -20%',
    modifier: { decayReduction: { happiness: 0.8 } },
  },
  teddy: {
    id: 'teddy', name: '테디', color: '#7A4A2B', rarity: 'rare', emoji: '🧸',
    trait: '스피드 — 드라이브 행복 +50%',
    modifier: { restoreBonus: { drive_happiness: 1.5 } },
  },
};

export const SPECIES_LIST = Object.values(SPECIES);

const WEIGHTS = { common: 40, uncommon: 30, rare: 15 };

export function rollSpecies() {
  const pool = SPECIES_LIST.flatMap(s => Array(WEIGHTS[s.rarity]).fill(s.id));
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getModifier(speciesId) {
  return SPECIES[speciesId]?.modifier ?? {};
}
