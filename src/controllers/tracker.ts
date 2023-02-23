import express from 'express';
import { Tracker } from '../models/trackers';
import mongoose from 'mongoose';
import { authenticateJWT, ICustomRequest } from '../middleware/authenticate';
import { User } from '../models/users';
const trackerRoute = express.Router();

/**
 * @name get trackers
 * @route GET /trackers
 * @successStatus 200 - trackers found
 * @responseBody {_id: string, name: string, type: string, createdAt: Date, updatedAt: Date}[],
 * @failureStatus 401 - unauthorized
 * @responseBody error: string
 */

export async function getHandler(req: express.Request, res: express.Response) {
	try {
		const user = await User.findById((req as ICustomRequest).user.userId);
		if (!user) {
			console.log('user not found', {
				userId: (req as ICustomRequest).user.userId,
			});
			res.sendStatus(401);
			return;
		}

		res.json(user.trackers);
	} catch (error) {
		console.log('getting trackers', { error });
		res.sendStatus(400);
	}
}

trackerRoute.get('/', authenticateJWT, getHandler);

/**
 * @name create tracker
 * @route POST /trackers
 * @requestBody name: string, type: string
 * @successStatus 201 - tracker created
 * @responseBody _id: string, name: string, type: string, createdAt: Date, updatedAt: Date
 * @failureStatus 400 - invalid request body
 * @failureStatus 401 - unauthorized
 * @responseBody error: string
 */
export async function postHandler(req: express.Request, res: express.Response) {
	const { name, type } = req.body;
	try {
		const user = await User.findById((req as ICustomRequest).user.userId);
		if (!user) {
			console.log('user not found', {
				userId: (req as ICustomRequest).user.userId,
			});
			res.sendStatus(401);
			return;
		}
		const tracker = new Tracker({
			name,
			type,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		user.trackers.push(tracker);
		await user.save();

		res.status(201).json(tracker);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
		}
	}
}

trackerRoute.post('/', authenticateJWT, postHandler);

/**
 * @name delete tracker
 * @route DELETE /trackers/:id
 * @successStatus 204 - tracker deleted
 * @failureStatus 401 - unauthorized
 * @failureStatus 404 - tracker not found
 */
export async function deleteHandler(
	req: express.Request,
	res: express.Response
) {
	const { id } = req.params;
	try {
		const user = await User.findById((req as ICustomRequest).user.userId);
		if (!user) {
			console.log('user not found', {
				userId: (req as ICustomRequest).user.userId,
			});
			res.sendStatus(401);
			return;
		}

		const trackerCount = user.trackers.length;
		user.trackers = user.trackers.filter(
			(tracker) => tracker._id.toString() !== id
		);

		if (trackerCount === user.trackers.length) {
			console.log('tracker not found', {
				userId: user._id,
				trackerId: id,
			});
			res.sendStatus(404);
			return;
		}

		await user.save();
		res.sendStatus(204);
	} catch (error) {
		console.log('deleting tracker', { error });
		res.sendStatus(500);
	}
}

trackerRoute.delete('/:id', authenticateJWT, deleteHandler);

/**
 * @name update tracker
 * @route PUT /trackers/:id
 * @requestBody name: string, type: string
 * @successStatus 200 - tracker updated
 * @failureStatus 400 - invalid request body
 * @failureStatus 401 - unauthorized
 * @failureStatus 404 - tracker not found
 */
export async function putHandler(req: express.Request, res: express.Response) {
	const { id } = req.params;
	const { name, type } = req.body;
	try {
		const user = await User.findById((req as ICustomRequest).user.userId);
		if (!user) {
			console.log('user not found', {
				userId: (req as ICustomRequest).user.userId,
			});
			res.sendStatus(401);
			return;
		}

		const tracker = user.trackers.find(
			(tracker) => tracker._id.toString() === id
		);

		if (!tracker) {
			console.log('tracker not found', {
				userId: user._id,
				trackerId: id,
			});
			res.sendStatus(404);
			return;
		}

		tracker.name = name;
		tracker.type = type;
		tracker.updatedAt = new Date();

		await user.save();
		res.sendStatus(200);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
		}
	}
}

trackerRoute.put('/:id', authenticateJWT, putHandler);

export default trackerRoute;
