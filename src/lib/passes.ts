export type PassType = 'OTAKU' | 'TWINFLAME' | 'STRAW_HATS'

export interface PassOption {
  id: PassType
  name: string
  shortName: string
  subtitle: string
  price: number
  admits: string
  templateFile: string
  badge: string
}

export const PASS_CATALOG: Record<PassType, PassOption> = {
  OTAKU: {
    id: 'OTAKU',
    name: 'OTAKU PASS',
    shortName: 'OTAKU PASS',
    subtitle: 'Solo General Admission · 1 Person',
    price: 549,
    admits: '1 Person',
    templateFile: 'otaku.jpg',
    badge: 'SOLO · GENERAL',
  },
  TWINFLAME: {
    id: 'TWINFLAME',
    name: 'TWINFLAME (DUO)',
    shortName: 'TWINFLAME (DUO)',
    subtitle: 'Couple / Bestie Duo Pass · 2 People',
    price: 1049,
    admits: '2 People',
    templateFile: 'twinflame.jpg',
    badge: 'DUO · SAVE ₹49',
  },
  STRAW_HATS: {
    id: 'STRAW_HATS',
    name: 'STRAW HATS (5 + 1 FREE)',
    shortName: 'STRAW HATS (5 + 1 FREE)',
    subtitle: 'Squad Pack · 6 People Total',
    price: 2799,
    admits: '6 People (5 + 1 Free)',
    templateFile: 'strawhats.jpg',
    badge: 'SQUAD · 1 FREE',
  },
}

export const PASS_LIST: PassOption[] = [
  PASS_CATALOG.OTAKU,
  PASS_CATALOG.TWINFLAME,
  PASS_CATALOG.STRAW_HATS,
]

export function getPassOption(passType?: string): PassOption {
  if (passType && passType in PASS_CATALOG) {
    return PASS_CATALOG[passType as PassType]
  }
  return PASS_CATALOG.OTAKU
}

// Promo codes mapped by normalized (trimmed, lowercase) key -> discount %
const PROMO_CODE_MAP: Record<string, { code: string; discountPercent: 5 | 10 }> = {
  'boa hancock': { code: 'BOA HANCOCK', discountPercent: 5 },
  '002': { code: '002', discountPercent: 5 },
  'mikasa': { code: 'MIKASA', discountPercent: 5 },
  'makima': { code: 'MAKIMA', discountPercent: 5 },
  'misty': { code: 'MISTY', discountPercent: 5 },
  'levi ackerman': { code: 'LEVI ACKERMAN', discountPercent: 10 },
  'vegeta': { code: 'VEGETA', discountPercent: 10 },
  'jiraiya': { code: 'JIRAIYA', discountPercent: 10 },
  'grimmjow': { code: 'GRIMMJOW', discountPercent: 10 },
  'killua': { code: 'KILLUA', discountPercent: 10 },
}

export function validatePromoCode(rawCode?: string): {
  valid: boolean
  code?: string
  discountPercent: 0 | 5 | 10
} {
  if (!rawCode) return { valid: false, discountPercent: 0 }
  const normalized = rawCode.trim().toLowerCase().replace(/\s+/g, ' ')
  const match = PROMO_CODE_MAP[normalized]
  if (!match) {
    return { valid: false, discountPercent: 0 }
  }
  return { valid: true, code: match.code, discountPercent: match.discountPercent }
}

export function calculateDiscountedTotal(
  unitPrice: number,
  quantity: number,
  discountPercent: 0 | 5 | 10
): number {
  const subtotal = unitPrice * quantity
  const discounted = subtotal * (1 - discountPercent / 100)
  return Math.round(discounted * 100) / 100
}
