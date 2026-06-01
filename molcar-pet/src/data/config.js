export const CONFIG = {
  decayPerMinute: {
    hunger:      4,
    happiness:   3,
    cleanliness: 2,
    energy:      2.5,
  },

  restore: {
    feed:  30,
    play:  25,
    bath:  100,
    sleep: 100,
  },

  driving: {
    cleanlinessCost: 20,
    happinessGain:   15,
  },

  wants: {
    intervalMin: 3,
    timeoutMin:  5,
    reward: { coins: 10, care: 5 },
  },

  evolution: {
    stageAges:         { baby: 0, teen: 30, adult: 120 },
    goodCareThreshold: 60,
  },

  collection: {
    graduateBonus: 50,
  },

  gacha: {
    cost: 100,
  },

  minigame: {
    coinPerPoint:     1,
    happinessOnFinish: 15,
  },
};
