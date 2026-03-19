import { EventName } from './models/user';

// Allow all listed events (use ids for API payloads)
export const AVAILABLE_EVENTS = [
	'creatorWS',
	'devWS',
	'modelerWS',
	'enigma',
	'techQuiz',
	'ooc',
	'nearProtocol',
	// Legacy names kept for compatibility
	'Enigma',
	'Order of Chaos',
	'Tech Quiz',
];

const PAYMENT_REQUIRED_SET = new Set<string>([
	'enigma',
	'ooc',
	'order of chaos',
]);

export function isPaymentRequired(eventName: string): boolean {
	const key = eventName.trim().toLowerCase();
	return PAYMENT_REQUIRED_SET.has(key);
}
