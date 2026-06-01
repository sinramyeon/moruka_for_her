export const ITEMS = {
  lettuce_premium: {
    id: 'lettuce_premium', type: 'food', name: '프리미엄 양상추',
    price: 30, effect: { stat: 'hunger', amount: 60 },
  },
  toy_ball: {
    id: 'toy_ball', type: 'food', name: '장난감 공',
    price: 25, effect: { stat: 'happiness', amount: 50 },
  },
  soap_deluxe: {
    id: 'soap_deluxe', type: 'food', name: '고급 비누',
    price: 35, effect: { stat: 'cleanliness', amount: 80 },
  },
  hat_party: {
    id: 'hat_party', type: 'accessory', name: '파티 모자',
    price: 120, emoji: '🎩',
  },
  ribbon_pink: {
    id: 'ribbon_pink', type: 'accessory', name: '분홍 리본',
    price: 80, emoji: '🎀',
  },
  crown_gold: {
    id: 'crown_gold', type: 'accessory', name: '황금 왕관',
    price: 250, emoji: '👑',
  },
  gacha_ticket: {
    id: 'gacha_ticket', type: 'ticket', name: '가챠 티켓',
    price: 90,
  },
};

export const ITEMS_LIST = Object.values(ITEMS);
