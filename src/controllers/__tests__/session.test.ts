import request from 'supertest';
import app from '../../app';
import { Session } from '../../models/sessions';
import { setup, teardown } from '../../setup-teardown';
import { User } from '../../models/users';
const user = {
	email: 'test3@gmail.com',
	password: 'password',
	name: 'Test User',
};

beforeAll(async () => {
	await setup();
	await User.create(user);
});

afterAll(async () => {
	await teardown();
});

describe('POST /api/v1/sessions', () => {
	it('should return 201 with a session token', async () => {
		const response = await request(app).post('/api/v1/sessions').send({
			email: user.email,
			password: user.password,
		});

		expect(response.status).toBe(201);
		expect(response.body.sessionToken).toBeTruthy();

		const session = await Session.findOne({
			sessionToken: response.body.sessionToken,
		});
		expect(session).toBeTruthy();
		expect(session?.sessionToken).toBeTruthy();
	});

	it('should return 401 with an error message', async () => {
		const response = await request(app).post('/api/v1/sessions').send({
			email: user.email,
			password: 'wrong password',
		});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid password');
	});
});
