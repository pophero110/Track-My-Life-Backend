import { createSession } from '../createSession';

test('createSession', async () => {
	const session = await createSession('123');

	expect(session?.userId).toBe('123');
	expect(session?.sessionToken).toBeDefined();
	expect(session?.expires).toBeDefined();
	expect(session?.createdAt).toBeDefined();
});
