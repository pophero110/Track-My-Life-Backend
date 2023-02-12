import { Session } from '../models/sessions';

export function destorySession(sessionToken: string) {
	return Session.deleteOne({ sessionToken });
}
