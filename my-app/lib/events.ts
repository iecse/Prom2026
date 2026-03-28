export const CANONICAL_EVENTS = [
  'creatorWS',
  'devWS',
  'modelerWS',
  'enigma',
  'techQuiz',
  'ooc',
  'nearProtocol',
  'negSpace',
] as const;

export const LEGACY_EVENT_NAMES = [
  'Enigma',
  'Order of Chaos',
  'Tech Quiz',
  'SciBizTech quiz',
] as const;

export const AVAILABLE_EVENTS = [...CANONICAL_EVENTS, ...LEGACY_EVENT_NAMES] as const;

export type CanonicalEvent = (typeof CANONICAL_EVENTS)[number];
export type AvailableEvent = (typeof AVAILABLE_EVENTS)[number];

const EVENT_NAME_MAP: Record<string, CanonicalEvent> = {
  creatorws: 'creatorWS',
  devws: 'devWS',
  modelerws: 'modelerWS',
  enigma: 'enigma',
  techquiz: 'techQuiz',
  scibiztechquiz: 'techQuiz',
  ooc: 'ooc',
  orderofchaos: 'ooc',
  nearprotocol: 'nearProtocol',
  negspace: 'negSpace',
};

function normalizeEventKey(eventName: string): string {
  return eventName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function canonicalizeEventName(eventName: string): CanonicalEvent | null {
  return EVENT_NAME_MAP[normalizeEventKey(eventName)] ?? null;
}

export function isPaymentRequired(eventName: string): boolean {
  const canonicalEvent = canonicalizeEventName(eventName);
  return canonicalEvent === 'enigma' || canonicalEvent === 'ooc';
}
