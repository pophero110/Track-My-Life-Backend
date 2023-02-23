import { Schema, model } from 'mongoose';
import { trackerSchema, ITracker } from './trackers';
import { hashPassword } from '../utils/bcrypt';
// 1. Create an interface representing a document in MongoDB.
export interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
	trackers: Array<ITracker>;
	createdAt: Date;
	updatedAt: Date;
}

const EmailValidator = (email: string) => {
	return /\S+@\S+\.\S+/.test(email);
};
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		index: { unique: true },
		validate: [EmailValidator, 'Please enter a valid email address.'],
	},
	password: { type: String, required: true },
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
	trackers: [trackerSchema],
});

userSchema.pre('save', async function (next) {
	this.password = await hashPassword(this.password);
	next();
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);
