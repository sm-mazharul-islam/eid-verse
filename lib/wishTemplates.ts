export interface WishTemplateGroup {
  fitr: string[];
  adha: string[];
}

export const wishTemplates: Record<string, Record<string, string[]>> = {
  friend: {
    moon: [
      "Hey {receiver} 🌙 May Allah accept your Qurbani and shower you with endless barakah. Eid Mubarak from {sender}!",
      "Dear {receiver}, on this blessed night of Eid, may your heart find deep peace and your family find happiness. Eid Mubarak from {sender}."
    ],
    mosque: [
      "To my dear {receiver}, may the beautiful echo of your Eid morning prayers reach the highest heavens. Your friend, {sender}.",
      "Eid Mubarak {receiver}! Praying that our bond grows stronger and our hearts get closer in devotion this Eid. Best, {sender}."
    ],
    lantern: [
      "Hey {receiver}! May your path be illuminated by the glowing lanterns of faith and endless joy. Happy Eid from {sender}! ✨",
      "Dear {receiver}, sending you warm lanterns of blessings, laughter, and delicious Eid biriyani. Sincerely, {sender}."
    ],
    gold: [
      "Taqabbalallahu minna wa minkum, {receiver}! May this Eid be a golden chapter of joy and prosperity in your life. Eid Mubarak from {sender}.",
      "To {receiver} — wishing you an elegant, blessed, and truly golden Eid al-Adha. Warmest greetings from {sender}."
    ]
  },
  parent: {
    moon: [
      "Dearest {receiver}, you taught me the beautiful meaning of sacrifice and love. This Eid, I pray Allah grants you eternal health, peace, and pure joy. Your child, {sender} 🤍",
      "To my beloved {receiver}, as the crescent moon rises, I pray for your long life and endless blessings. You are my greatest guide. Eid Mubarak, with love, {sender}."
    ],
    mosque: [
      "Beloved {receiver}, may every prayer you make in the mosque today bring you peace, mercy, and answers. Eid Mubarak with all my respect, {sender}.",
      "To the most precious {receiver}, praying that Allah accepts every tear of devotion and sacrifice you have made for us. Eid Mubarak, {sender}."
    ],
    lantern: [
      "Dear {receiver}, your love is the guiding lantern of our home. May Allah fill your life with warmth and light this Eid. Respectfully, {sender}.",
      "To {receiver}, sending you beautiful glowing blessings of peace, health, and endless warmth. Eid Mubarak, {sender}."
    ],
    gold: [
      "My dearest {receiver}, wishing you a glorious Eid. May Allah bless you with a golden age of comfort and happiness. With infinite love, {sender}.",
      "To {receiver}, you deserve the absolute best this world and the hereafter have to offer. Eid al-Adha Mubarak! Love, {sender}."
    ]
  },
  sibling: {
    moon: [
      "Hey {receiver}! Glad to share another Eid with you. May Allah accept our family Qurbani and stop you from eating all the beef! Eid Mubarak from {sender}! 🐄",
      "To my amazing sibling {receiver}, may this blessed night bring you closer to all your dreams. Happy Eid! Love, {sender}."
    ],
    mosque: [
      "Eid Mubarak {receiver}! Let's make this Eid a peaceful and spiritually grounding day. Don't forget me in your duas! Your sibling, {sender}."
    ],
    lantern: [
      "Hey {receiver}! May your life glow as bright as these floating lanterns. Have a legendary Eid feast! Eid Mubarak from {sender}."
    ],
    gold: [
      "To {receiver} — wishing you a premium, golden, and deeply satisfying Eid feast. Let's make some amazing memories today! Eid Mubarak, {sender}."
    ]
  },
  spouse: {
    moon: [
      "To my beloved {receiver}, you are the crescent moon of my sky. May Allah accept our shared sacrifices and bless our marriage forever. Eid Mubarak, {sender} 💍",
      "Dearest {receiver}, holding your hand on this Eid morning is my greatest blessing. May Allah fill our lives with peace and endless barakah. Yours, {sender}."
    ]
  },
  child: {
    moon: [
      "My sweet {receiver}, watching you grow with faith and kindness is our greatest joy. May Allah bless you always. Eid Mubarak, with love, {sender} 🌟"
    ]
  },
  teacher: {
    moon: [
      "Respected {receiver}, your wisdom is a light in my life. Wishing you a peaceful, healthy, and highly blessed Eid al-Adha. Respectfully, {sender}."
    ]
  },
  farmer: {
    moon: [
      "To our hardworking brother {receiver}, you raised the animal with love, sweat, and care. May Allah accept this devotion and multiply your blessings. Eid Mubarak from {sender} 🌾"
    ]
  },
  recipient: {
    moon: [
      "To my respected brother/sister {receiver}, we share this Qurbani meat as brothers in faith and humanity. May your home be blessed and your table filled. Eid Mubarak from {sender} 🤝"
    ]
  }
};

// Custom cultural Bangla feel templates
export const banglaWishTemplates = [
  "Eid Mubarak {receiver} bhai/apa! 🐄 Goru kinecho kemon? Haat er obiggota kemon chilo? May Allah qabul koren, ameen! - {sender}",
  "To {receiver} — may your haat trip be blessed, your Qurbani accepted, and your Eid beef biriyani legendary. Eid Mubarak from {sender}! 🍖",
  "Hey {receiver}! Shokol klanti moche giye Eid er subah e jibon e ashuk chayanibir shanti. Taqabbalallahu minna wa minkum! - {sender}",
  "Dear {receiver}, goru kobaad e shobai ekshethe table e boshe gorom gorom ruti aar mangsho khaoar anondo i alada! Eid Mubarak from {sender}! 🐄🔥"
];

// Custom spiritual Sunnah templates
export const spiritualTemplates = [
  "Taqabbalallahu minna wa minkum, {receiver}. May the beautiful spirit of Ibrahim's devotion inspire our hearts to make meaningful sacrifices in this life. - {sender}",
  "On this sacred day of Eid al-Adha, I pray that Allah accepts from you every sacrifice — not just the Qurbani, but every hardship you have endured with patience. Eid Mubarak, {sender}."
];

export function generateCustomWish(
  sender: string,
  receiver: string,
  relationship: string,
  theme: string,
  eidType: 'fitr' | 'adha'
): string {
  const rel = relationship.toLowerCase();
  const th = theme.toLowerCase();

  // Try to find custom relationship + theme template
  let availableTemplates: string[] = [];

  if (rel === 'bangla') {
    availableTemplates = banglaWishTemplates;
  } else if (rel === 'spiritual') {
    availableTemplates = spiritualTemplates;
  } else {
    const relTemplates = wishTemplates[rel] || wishTemplates['friend'];
    availableTemplates = relTemplates[th] || relTemplates['moon'] || wishTemplates['friend']['moon'];
  }

  // Pick a random template
  const randomIndex = Math.floor(Math.random() * availableTemplates.length);
  let selected = availableTemplates[randomIndex];

  // Replace tokens
  selected = selected.replace(/{sender}/g, sender);
  selected = selected.replace(/{receiver}/g, receiver);

  // Quick fitr adjustments if theme matches Fitr
  if (eidType === 'fitr') {
    selected = selected.replace(/Qurbani/g, 'fasting & Sadaqah');
    selected = selected.replace(/Eid al-Adha/g, 'Eid al-Fitr');
    selected = selected.replace(/beef/g, 'sweet');
    selected = selected.replace(/goru/g, 'shemai');
    selected = selected.replace(/biriyani/g, 'sheer khurma');
    selected = selected.replace(/goru kinecho kemon/g, 'sheer khurma kheyecho kemon');
    selected = selected.replace(/haat er obiggota/g, 'Ramadan er obiggota');
  }

  return selected;
}
