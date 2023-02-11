import { setup, teardown } from '../../setup-teardown';
import { createSession } from '../createSession';

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await teardown();
});

test('createSession', async () => {
	const session = await createSession('123');

	expect(session.userId).toBe('123');
	expect(session.sessionToken).toBeDefined();
	expect(session.expires).toBeDefined();
});
