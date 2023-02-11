import mongoose from 'mongoose';
import { Session } from '../sessions';

// https://mongoosejs.com/docs/api.html#error_Error-ValidationError

test('userId can not be empty', async () => {
	const session = new Session({
		userId: '',
		sessionToken: 'test',
		expires: new Date(Date.now() + 1000),
	});

	const error = await session.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.userId.message).toBe('Path `userId` is required.');
});

test('expires can not be empty', async () => {
	const session = new Session({
		userId: 'test',
		sessionToken: 'test',
		expires: null,
	});

	const error = await session.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.expires.message).toBe('Path `expires` is required.');
});

test('sessionToken can not be empty', async () => {
	const session = new Session({
		userId: 'test',
		sessionToken: '',
		expires: new Date(Date.now() + 1000),
	});

	await session.save().catch((error) => error);

	const error = await session.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.sessionToken.message).toBe(
		'Path `sessionToken` is required.'
	);
});

test('expires can not be in the past', async () => {
	const session = new Session({
		userId: 'test',
		sessionToken: 'test',
		expires: new Date(Date.now() - 1000),
	});

	const error = await session.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.expires.message).toBe(
		'Data is in the past. Please enter a valid date.'
	);
});
