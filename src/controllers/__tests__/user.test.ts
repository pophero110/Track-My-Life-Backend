import request from 'supertest';
import app from '../../app';
import { User } from '../../models/users';
import { setup, teardown } from '../../setup-teardown';

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await teardown();
});

describe('POST /api/v1/users', () => {
	it('response 201', async () => {
		const response = await request(app)
			.post('/api/v1/users')
			.send({ name: 'test', password: 'test', email: 'test@gmail.com' });

		const user = await User.findOne({ email: 'test@gmail.com' });

		expect(user?.name).toBe('test');
		expect(user?.password).not.toBe('test');
		expect(response.statusCode).toBe(201);
	});

	it('response 400', async () => {
		const response = await request(app).post('/api/v1/users');

		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: 'User validation failed: name: Path `name` is required., email: Path `email` is required., password: Path `password` is required.',
		});
	});
});
