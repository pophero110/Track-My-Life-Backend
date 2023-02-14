import request from 'supertest';
import app from '../../app';
import { User } from '../../models/users';
import { Tracker } from '../../models/trackers';
import { generateToken } from '../../utils/jwt';
import { defaultExpiresIn } from '../../models/sessions';
import { createFakeUser } from '../../models/fatories/users';
import mongoose from 'mongoose';

describe('POST /api/v1/trackers/:id/logs', () => {
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
	it('response 201', async () => {
		const response = await request(app)
			.post(`/api/v1/trackers/${trackerId}/logs`)
			.send({
				value: 1,
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			_id: expect.any(String),
			value: 1,
			createdAt: expect.any(String),
		});

		const user = await User.findById(userId);
		expect(user?.trackers[0].logs[0].value).toBe(1);
	});

	it('response 400', async () => {
		const response = await request(app)
			.post(`/api/v1/trackers/${trackerId}/logs`)
			.send({
				value: 'test',
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: 'User validation failed: trackers.0.logs.1.value: Path `value` is required.',
		});
	});

	it('response 401', async () => {
		const response = await request(app)
			.post(`/api/v1/trackers/${trackerId}/logs`)
			.send({
				value: 1,
			})
			.set('Authorization', `Bearer 123`);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			error: 'Invalid session token',
		});
	});

	it('response 404', async () => {
		const response = await request(app)
			.post(`/api/v1/trackers/${new mongoose.Types.ObjectId()}/logs`)
			.send({
				value: 1,
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(404);
	});
});

describe('Delete /api/v1/trackers/:id/logs/:logId', () => {
	let token = '';
	const trackerId = new mongoose.Types.ObjectId();
	const userId = new mongoose.Types.ObjectId();
	const logId = new mongoose.Types.ObjectId();
	beforeAll(async () => {
		const tracker = new Tracker({
			_id: trackerId,
			name: 'test',
			type: 'time',
			createdAt: new Date(),
			updatedAt: new Date(),
			logs: [
				{
					_id: logId,
					value: 1,
					createdAt: new Date(),
				},
			],
		});

		const user = await User.create({
			...createFakeUser(),
			_id: userId,
			trackers: [tracker],
		});
		token = generateToken({ userId: user._id }, defaultExpiresIn);
	});
	it('response 204', async () => {
		const response = await request(app)
			.delete(`/api/v1/trackers/${trackerId}/logs/${logId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(204);

		const user = await User.findById(userId);
		expect(user?.trackers[0].logs).toEqual([]);
	});

	it('response 401', async () => {
		const response = await request(app).delete(
			`/api/v1/trackers/${trackerId}/logs/${logId}`
		);

		expect(response.status).toBe(401);
	});

	it('response 404', async () => {
		const response = await request(app)
			.delete(
				`/api/v1/trackers/${trackerId}/logs/${new mongoose.Types.ObjectId()}`
			)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(404);
	});

	it('response 404', async () => {
		const response = await request(app)
			.delete(
				`/api/v1/trackers/${new mongoose.Types.ObjectId()}/logs/${logId}`
			)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(404);
	});
});
