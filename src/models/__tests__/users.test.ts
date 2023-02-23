import mongoose from 'mongoose';
import { User } from '../users';
import { Tracker } from '../trackers';
import { createFakeUser } from '../fatories/users';
import { checkPassword } from '../../utils/bcrypt';
// https://mongoosejs.com/docs/api.html#error_Error-ValidationError

test('name can not be empty', async () => {
	const user = new User({
		name: '',
		email: 'test@gmail.com',
		password: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
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
		createdAt: new Date(),
		updatedAt: new Date(),
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
		createdAt: new Date(),
		updatedAt: new Date(),
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
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	await user.save();

	const duplicateUser = new User({
		name: 'test',
		email,
		password: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
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
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	await user.save();

	expect(user.password).not.toBe('test');
	expect(await checkPassword('test', user.password)).toBe(true);
});

test('email must be valid', async () => {
	const user = new User({
		name: 'test',
		email: 'test',
		password: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const error = await user.save().catch((error) => error);

	expect(error instanceof mongoose.Error.ValidationError).toBeTruthy;
	expect(error.errors.email.message).toBe(
		'Please enter a valid email address.'
	);
});

test('add a tracker', async () => {
	const user = new User({
		name: 'test',
		email: 'test5@gmail.com',
		password: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const tracker = new Tracker({
		name: 'test',
		type: 'time',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	user.trackers.push(tracker);

	await user.save();

	expect(tracker.name).toBe('test');
	expect(tracker.type).toBe('time');
	expect(user.trackers[0]._id).toBe(tracker._id);
});

test('update user name skip pre-save hook', async () => {
	const fakeUser = createFakeUser();
	const user = new User(fakeUser);
	await user.save();

	const newName = 'new name';
	user.name = 'new name';
	await user.save();

	expect(user.name).toBe(newName);
	expect(await checkPassword(fakeUser.password, user.password)).toBe(true);
});
