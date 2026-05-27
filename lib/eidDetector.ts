export type EidType = 'eid-al-fitr' | 'eid-al-adha' | 'approaching-adha' | 'approaching-fitr' | 'off-season';

export interface EidConfig {
  type: EidType;
  name: string;
  arabicName: string;
  year: number;
  tagline: string;
  themeKey: 'fitr' | 'adha';
  countdownDays: number;
}

const EID_DATES: Record<number, { fitr: Date; adha: Date }> = {
  2025: {
    fitr: new Date('2025-03-30T00:00:00'),
    adha: new Date('2025-06-06T00:00:00'),
  },
  2026: {
    fitr: new Date('2026-03-20T00:00:00'),
    adha: new Date('2026-05-27T00:00:00'), // Today is May 27th, 2026!
  },
  2027: {
    fitr: new Date('2027-03-09T00:00:00'),
    adha: new Date('2027-05-17T00:00:00'),
  }
};

function diffInDays(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
}

export function detectCurrentEid(forcedTheme?: string | null): EidConfig {
  const today = new Date();
  const year = today.getFullYear();
  
  // Custom query override mechanism (?theme=adha or ?theme=fitr)
  if (forcedTheme === 'adha') {
    return {
      type: 'eid-al-adha',
      name: 'Eid al-Adha',
      arabicName: 'عيد الأضحى',
      year,
      tagline: 'The Festival of Sacrifice & Spiritual Devotion',
      themeKey: 'adha',
      countdownDays: 0
    };
  }
  if (forcedTheme === 'fitr') {
    return {
      type: 'eid-al-fitr',
      name: 'Eid al-Fitr',
      arabicName: 'عيد الفطر',
      year,
      tagline: 'The Sweet Feast of Patience & Celebration',
      themeKey: 'fitr',
      countdownDays: 0
    };
  }

  const dates = EID_DATES[year] || EID_DATES[2026]; // Fallback to 2026 if out of range

  const daysDiffAdha = diffInDays(today, dates.adha);
  const daysDiffFitr = diffInDays(today, dates.fitr);

  // Active Eid al-Adha (within 3 days of Eid day)
  if (Math.abs(daysDiffAdha) <= 3) {
    return {
      type: 'eid-al-adha',
      name: 'Eid al-Adha',
      arabicName: 'عيد الأضحى',
      year,
      tagline: 'The Festival of Sacrifice & Spiritual Devotion',
      themeKey: 'adha',
      countdownDays: 0
    };
  }

  // Active Eid al-Fitr (within 3 days of Eid day)
  if (Math.abs(daysDiffFitr) <= 3) {
    return {
      type: 'eid-al-fitr',
      name: 'Eid al-Fitr',
      arabicName: 'عيد الفطر',
      year,
      tagline: 'The Sweet Feast of Patience & Celebration',
      themeKey: 'fitr',
      countdownDays: 0
    };
  }

  // Approaching Eid al-Adha (within 7 days leading up to it)
  if (daysDiffAdha < 0 && daysDiffAdha >= -7) {
    return {
      type: 'approaching-adha',
      name: 'Eid al-Adha',
      arabicName: 'عيد الأضحى',
      year,
      tagline: 'Preparing for the Sacrifice of Devotion',
      themeKey: 'adha',
      countdownDays: Math.abs(daysDiffAdha)
    };
  }

  // Approaching Eid al-Fitr (within 7 days leading up to it)
  if (daysDiffFitr < 0 && daysDiffFitr >= -7) {
    return {
      type: 'approaching-fitr',
      name: 'Eid al-Fitr',
      arabicName: 'عيد الفطر',
      year,
      tagline: 'Preparing for the Sweet Festival of Blessings',
      themeKey: 'fitr',
      countdownDays: Math.abs(daysDiffFitr)
    };
  }

  // If outside active cycles, default based on which one is closer,
  // or fall back to Adha if it is currently Eid al-Adha season (which today is!)
  if (Math.abs(daysDiffAdha) < Math.abs(daysDiffFitr)) {
    return {
      type: 'off-season',
      name: 'Eid al-Adha',
      arabicName: 'عيد الأضحى',
      year,
      tagline: 'The Festival of Sacrifice & Spiritual Devotion',
      themeKey: 'adha',
      countdownDays: daysDiffAdha > 0 ? daysDiffAdha : 365 + daysDiffAdha
    };
  } else {
    return {
      type: 'off-season',
      name: 'Eid al-Fitr',
      arabicName: 'عيد الفطر',
      year,
      tagline: 'The Sweet Feast of Patience & Celebration',
      themeKey: 'fitr',
      countdownDays: daysDiffFitr > 0 ? daysDiffFitr : 365 + daysDiffFitr
    };
  }
}
