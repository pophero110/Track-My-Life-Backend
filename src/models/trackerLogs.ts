import { Schema, model } from 'mongoose';

// create an interface representing a document in MongoDB
export interface ITrackerLog {
	_id: string;
	value: number;
	createdAt: Date;
}

// create a Schema corresponding to the document interface
export const trackerLogSchema = new Schema<ITrackerLog>({
	value: {
		type: Number,
		required: true,
		validate: {
			validator: (v: number) => v > 0,
			msg: 'Value must be > 0',
		},
	},
	createdAt: { type: Date, required: true },
});

// create a Model
export const TrackerLog = model<ITrackerLog>('TrackerLog', trackerLogSchema);
