import { Session } from '../../models/sessions';
import { setup, teardown } from '../../setup-teardown';
import { destorySession } from '../destorySession';

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await teardown();
});

const session = {
	sessionToken: '123',
	expires: new Date(Date.now() + 1000),
	userId: '123',
};

test('destorySession', async () => {
	await Session.create(session);

	await destorySession(session.sessionToken);
	const sessionCount = await Session.countDocuments();
	expect(sessionCount).toBe(0);
});
