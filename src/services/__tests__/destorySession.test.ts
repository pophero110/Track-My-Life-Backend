import { Session } from '../../models/sessions';
import { destorySession } from '../destorySession';

const session = {
	sessionToken: '123',
	expires: new Date(Date.now() + 1000),
	userId: '123',
	createdAt: new Date(),
};

test('destorySession', async () => {
	await Session.create(session);

	await destorySession(session.sessionToken);
	const sessionCount = await Session.countDocuments();
	expect(sessionCount).toBe(0);
});
