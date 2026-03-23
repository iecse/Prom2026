// Allow all listed events (use ids for API payloads)
export const AVAILABLE_EVENTS = [
	'creatorWS',
	'devWS',
	'modelerWS',
	'enigma',
	'techQuiz',
	'ooc',
	'nearProtocol',
	'negSpace',
	// Legacy names kept for compatibility
	'Enigma',
	'Order of Chaos',
	'Tech Quiz',
] as const;

export type AvailableEvent = (typeof AVAILABLE_EVENTS)[number];

const PAYMENT_REQUIRED_SET = new Set<string>([
	'enigma',
	'ooc',
	'order of chaos',
]);

export function isPaymentRequired(eventName: string): boolean {
	const key = eventName.trim().toLowerCase();
	return PAYMENT_REQUIRED_SET.has(key);
}
