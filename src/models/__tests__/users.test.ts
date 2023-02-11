import mongoose from 'mongoose';
import { setup, teardown } from '../../setup-teardown';
import { User } from '../users';
import bcrypt from 'bcrypt';

// https://mongoosejs.com/docs/api.html#error_Error-ValidationError

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await teardown();
});

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

test('email must be unique', async () => {
	const email = 'test@gmail.com';
	const user = new User({
		name: 'test',
		email,
		password: 'test',
	});

	await user.save();

	const duplicateUser = new User({
		name: 'test',
		email,
		password: 'test',
	});

	const error = await duplicateUser.save().catch((error) => error);

	expect(error.name).toBe('MongoServerError');
	expect(error.code).toBe(11000);
	expect(error.keyPattern.email).toBe(1);
});

test('password must be hashed before saved', async () => {
	const user = new User({
		name: 'test',
		email: 'test2@gmail.com',
		password: 'test',
	});

	await user.save();

	expect(user.password).not.toBe('test');
	bcrypt.compare('test', user.password, (_error, result) => {
		expect(result).toBe(true);
	});
});
