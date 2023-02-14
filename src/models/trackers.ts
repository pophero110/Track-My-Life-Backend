import { Schema, model } from 'mongoose';
import { trackerLogSchema, ITrackerLog } from './trackerLogs';

// create an interface representing a document in MongoDB
export interface ITracker {
	_id: string;
	name: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
	logs: Array<ITrackerLog>;
}

// create a Schema corresponding to the document interface
export const trackerSchema = new Schema<ITracker>({
	name: { type: String, required: true },
	type: { type: String, required: true, enum: ['time', 'weight', 'count'] },
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
	logs: [trackerLogSchema],
});

// create a Model
export const Tracker = model<ITracker>('Tracker', trackerSchema);
