import { Schema, model } from 'mongoose';
// 1. Create an interface representing a document in MongoDB.
interface ISession {
	_id: string;
	userId: string;
	sessionToken: string;
	expires: Date;
	createdAt: Date;
}

const DateValidator = (value: Date) => {
	return value.getTime() > Date.now();
};

// 2. Create a Schema corresponding to the document interface.
const sessionSchema = new Schema<ISession>({
	userId: { type: String, required: true },
	sessionToken: { type: String, required: true, unique: true },
	expires: {
		type: Date,
		required: true,
		validate: [
			DateValidator,
			'Data is in the past. Please enter a valid date.',
		],
	},
	createdAt: { type: Date, required: true },
});

// 3. Create a Model.
export const Session = model<ISession>('Session', sessionSchema);

export const defaultExpiresIn = 60 * 60 * 24;
