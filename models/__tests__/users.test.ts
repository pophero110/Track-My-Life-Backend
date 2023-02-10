import mongoose from 'mongoose';
import { User } from '../users';

// https://mongoosejs.com/docs/api.html#error_Error-ValidationError

test('name can not be empty', async () => {
	const user = new User({
		name: '',
		email: 'test@gmail.com',
		password: 'test',
	});

	const error = await user.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.name.message).toBe('Path `name` is required.');
});

test('email can not be empty', async () => {
	const user = new User({
		name: 'test',
		email: '',
		password: 'test',
	});

	const error = await user.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.email.message).toBe('Path `email` is required.');
});

test('password can not be empty', async () => {
	const user = new User({
		name: 'test',
		email: 'test@gmail.com',
		password: '',
	});

	const error = await user.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.password.message).toBe('Path `password` is required.');
});
