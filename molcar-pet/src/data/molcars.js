export const SPECIES = {
  potato:  { id: 'potato',  name: '포테토',   color: '#F2C14E', rarity: 'common',    trait: '먹보 — 양상추 회복량 +20%',   emoji: '🥔' },
  shiromo: { id: 'shiromo', name: '시로모',   color: '#F5F0E6', rarity: 'common',    trait: '신중 — 청결 감소 속도 -20%',  emoji: '🤍' },
  choco:   { id: 'choco',   name: '민트초코', color: '#7FB7A3', rarity: 'uncommon',  trait: '라이벌 — 미니게임 코인 +15%', emoji: '🍫' },
  abbie:   { id: 'abbie',   name: '아비',     color: '#D64545', rarity: 'rare',      trait: '멋쟁이 — 행복 감소 속도 -20%', emoji: '🌹' },
  teddy:   { id: 'teddy',   name: '테디',     color: '#7A4A2B', rarity: 'rare',      trait: '스피드 — 드라이브 행복 +50%', emoji: '🧸' },
};

export const SPECIES_LIST = Object.values(SPECIES);

const WEIGHTS = { common: 40, uncommon: 30, rare: 15 };

export function rollSpecies() {
  const pool = SPECIES_LIST.flatMap(s => Array(WEIGHTS[s.rarity]).fill(s.id));
  return pool[Math.floor(Math.random() * pool.length)];
}
