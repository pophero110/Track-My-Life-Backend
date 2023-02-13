import request from 'supertest';
import app from '../../app';
import { Session } from '../../models/sessions';
import { User } from '../../models/users';
import { createFakeUser } from '../../models/fatories/users';

describe('POST /api/v1/sessions', () => {
	const user = createFakeUser();
	beforeAll(async () => {
		await User.create(user);
	});

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
		expect(session?.sessionToken).toBeTruthy();
	});

	it('should return 400 with an error message', async () => {
		const response = await request(app).post('/api/v1/sessions').send({
			email: user.email,
			password: 'wrong password',
		});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid password');
	});

	it('should return 401 with an error message', async () => {
		const response = await request(app).post('/api/v1/sessions').send({
			email: 'wrong email',
			password: user.password,
		});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid email');
	});
});

describe('DELETE /api/v1/sessions', () => {
	const user = createFakeUser();
	beforeAll(async () => {
		await User.create(user);
	});

	it('response 204', async () => {
		const signinResponse = await request(app)
			.post('/api/v1/sessions')
			.send({
				email: user.email,
				password: user.password,
			});

		const signoutResponse = await request(app)
			.delete('/api/v1/sessions')
			.set('Authorization', `Bearer ${signinResponse.body.sessionToken}`);

		expect(signoutResponse.status).toBe(204);
	});

	it('response 401 with error message', async () => {
		const response = await request(app).delete('/api/v1/sessions');

		expect(response.status).toBe(401);
		expect(response.body.error).toBe('Missing authorization header');
	});

	it('response 401 with error message', async () => {
		const response = await request(app)
			.delete('/api/v1/sessions')
			.set('Authorization', `Bearer wrong token`);

		expect(response.status).toBe(401);
		expect(response.body.error).toBe('Invalid session token');
	});
});
