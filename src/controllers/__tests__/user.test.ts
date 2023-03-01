import request from 'supertest';
import app from '../../app';
import { createFakeUser } from '../../models/fatories/users';
import { User } from '../../models/users';

describe('POST /api/v1/users', () => {
	it('response 201', async () => {
		const response = await request(app)
			.post('/api/v1/users')
			.send({ name: 'test', password: 'test', email: 'test@gmail.com' });

		const user = await User.findOne({ email: 'test@gmail.com' });

		expect(user?.name).toBe('test');
		expect(user?.password).not.toBe('test');
		expect(response.statusCode).toBe(201);
		expect(response.body).toStrictEqual({ name: 'test' });
	});

	it('response 400', async () => {
		const response = await request(app).post('/api/v1/users');

		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: 'User validation failed: name: Path `name` is required., email: Path `email` is required., password: Path `password` is required.',
		});
	});

	it('response 400', async () => {
		const user = await User.create(createFakeUser());
		const response = await request(app)
			.post('/api/v1/users')
			.send({ name: 'test', password: 'test', email: user.email });

		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({ error: 'Email already exists' });
	});
});
