import request from 'supertest';
import app from '../../app';
import { User } from '../../models/users';
import mongoose from 'mongoose';
import { connectDatabase } from '../../services/db';

beforeAll(async () => {
	await connectDatabase();
});

async function cleanUpDatabase() {
	await User.deleteMany({});
	await mongoose.disconnect();
}

afterAll(async () => {
	await cleanUpDatabase();
});

describe('POST', () => {
	test('response 201', async () => {
		const response = await request(app)
			.post('/api/v1/users')
			.send({ name: 'test', password: 'test', email: 'test@gmail.com' });

		const users = await User.find({});

		expect(users.length).toBe(1);
		expect(users[0].email).toBe('test@gmail.com');
		expect(response.statusCode).toBe(201);
	});

	// test('response 400', async () => {
	// 	const response = await request(app).post('/api/v1/users');
	// 	expect(response.statusCode).toBe(400);
	// });
});
