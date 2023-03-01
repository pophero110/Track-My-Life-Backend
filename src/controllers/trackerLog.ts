import express from 'express';
import { authenticateJWT } from '../middleware/authenticate';
import { User } from '../models/users';
import { ITrackerLog, TrackerLog } from '../models/trackerLogs';
import mongoose from 'mongoose';
import { ICustomRequest } from '../middleware/authenticate';
import { ITracker } from '../models/trackers';
const trackerLogRoute = express.Router();

/**
 * @name create trackerLog
 * @route POST /trackers/:id/logs
 * @requestBody value: number
 * @successStatus 201 - trackerLog created
 * @responseBody _id: string, value: number, createdAt: Date
 * @failureStatus 400 - invalid request body
 * @failureStatus 401 - unauthorized
 * @failureStatus 404 - tracker not found
 */
export async function postHandler(req: express.Request, res: express.Response) {
	const { id } = req.params;
	const { value } = req.body;
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
			(tracker: ITracker) => tracker._id.toString() === id
		);

		if (!tracker) {
			console.log('tracker not found', { id });
			res.sendStatus(404);
			return;
		}

		const trackerLog = new TrackerLog({
			value,
			createdAt: new Date(),
		});

		tracker.logs.push(trackerLog);

		await user.save();

		res.status(201).json(user.trackers);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
		}
	}
}

trackerLogRoute.post('/:id/logs', authenticateJWT, postHandler);

/**
 * @name delete trackerLog
 * @route DELETE /trackers/:id/logs/:logId
 * @successStatus 200 - trackerLog deleted
 * @failureStatus 401 - unauthorized
 * @failureStatus 404 - tracker not found
 * @failureStatus 404 - trackerLog not found
 */
export async function deleteHandler(
	req: express.Request,
	res: express.Response
) {
	const { id, logId } = req.params;
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
			(tracker: ITracker) => tracker._id.toString() === id
		);

		if (!tracker) {
			console.log('tracker not found', { id });
			res.status(404).json({ error: 'tracker not found' });
			return;
		}

		const trackerLog = tracker.logs.find(
			(log: ITrackerLog) => log._id.toString() === logId
		);

		if (!trackerLog) {
			console.log('trackerLog not found', { logId });
			res.status(404).json({ error: 'trackerLog not found' });
			return;
		}

		tracker.logs = tracker.logs.filter(
			(log: ITrackerLog) => log._id.toString() !== logId
		);

		await user.save();

		res.status(200).json(user.trackers);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
		}
	}
}

trackerLogRoute.delete('/:id/logs/:logId', authenticateJWT, deleteHandler);

export default trackerLogRoute;
