import request from 'supertest';
import app from '../../app';
import { User } from '../../models/users';
import { createFakeUser } from '../../models/fatories/users';
import { generateToken } from '../../utils/jwt';
import { defaultExpiresIn } from '../../models/sessions';
import { Tracker } from '../../models/trackers';
import mongoose from 'mongoose';
describe('POST /api/v1/trackers', () => {
	let token = '';
	beforeAll(async () => {
		const user = await User.create(createFakeUser());
		token = generateToken({ userId: user._id }, defaultExpiresIn);
	});
	it('response 201', async () => {
		const response = await request(app)
			.post('/api/v1/trackers')
			.send({
				name: 'test',
				type: 'time',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			_id: expect.any(String),
			name: 'test',
			type: 'time',
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			logs: [],
		});
	});

	it('response 400', async () => {
		const response = await request(app)
			.post('/api/v1/trackers')
			.send({
				name: 'test',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: 'User validation failed: trackers.1.type: Path `type` is required.',
		});
	});

	it('response 401', async () => {
		const response = await request(app)
			.post('/api/v1/trackers')
			.send({
				name: 'test',
				type: 'time',
			})
			.set('Accept', 'application/json');

		expect(response.status).toBe(401);
	});
});

describe('DELETE /api/v1/trackers/:id', () => {
	let token = '';
	const trackerId = new mongoose.Types.ObjectId();
	const userId = new mongoose.Types.ObjectId();
	beforeAll(async () => {
		const tracker = new Tracker({
			_id: trackerId,
			name: 'test',
			type: 'time',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const user = await User.create({
			...createFakeUser(),
			_id: userId,
			trackers: [tracker],
		});
		token = generateToken({ userId: user._id }, defaultExpiresIn);
	});

	it('response 200', async () => {
		const response = await request(app)
			.delete('/api/v1/trackers/' + trackerId)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);

		const user = await User.findById(userId);
		expect(user?.trackers.length).toBe(0);
	});

	it('response 404', async () => {
		const response = await request(app)
			.delete('/api/v1/trackers/' + 123)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(404);
	});
});

describe('PUT /api/v1/trackers/:id', () => {
	let token = '';
	const trackerId = new mongoose.Types.ObjectId();
	const userId = new mongoose.Types.ObjectId();
	beforeAll(async () => {
		const tracker = new Tracker({
			_id: trackerId,
			name: 'test',
			type: 'time',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const user = await User.create({
			...createFakeUser(),
			_id: userId,
			trackers: [tracker],
		});
		token = generateToken({ userId: user._id }, defaultExpiresIn);
	});

	it('response 200', async () => {
		const response = await request(app)
			.put('/api/v1/trackers/' + trackerId)
			.send({
				name: 'test2',
				type: 'time',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);

		const user = await User.findById(userId);
		expect(user?.trackers[0].name).toBe('test2');
		expect(user?.trackers[0].type).toBe('time');
	});

	it('response 404', async () => {
		const response = await request(app)
			.put('/api/v1/trackers/' + 123)
			.send({
				name: 'test2',
				type: 'time',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(404);
	});

	it('response 400', async () => {
		const response = await request(app)
			.put('/api/v1/trackers/' + trackerId)
			.send({
				name: 'time',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: 'User validation failed: trackers.0.type: Path `type` is required.',
		});
	});
});

describe('GET /api/v1/trackers', () => {
	let token = '';
	beforeAll(async () => {
		const tracker = new Tracker({
			_id: new mongoose.Types.ObjectId(),
			name: 'test',
			type: 'time',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const tracker2 = new Tracker({
			_id: new mongoose.Types.ObjectId(),
			name: 'test2',
			type: 'time',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const user = await User.create({
			...createFakeUser(),
			_id: new mongoose.Types.ObjectId(),
			trackers: [tracker, tracker2],
		});
		token = generateToken({ userId: user._id }, defaultExpiresIn);
	});

	it('response 200', async () => {
		const response = await request(app)
			.get('/api/v1/trackers')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual([
			{
				_id: expect.any(String),
				name: 'test',
				type: 'time',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				logs: [],
			},
			{
				_id: expect.any(String),
				name: 'test2',
				type: 'time',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				logs: [],
			},
		]);
	});

	it('response 401', async () => {
		const response = await request(app).get('/api/v1/trackers');

		expect(response.status).toBe(401);
	});
});
