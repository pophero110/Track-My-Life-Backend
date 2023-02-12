import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// 1. Create an interface representing a document in MongoDB.
export interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
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
		unique: true,
		validate: [EmailValidator, 'Please enter a valid email address.'],
	},
	password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
	const saltRounds = 10;
	bcrypt.hash(this.password, saltRounds, (error, hashedPassword) => {
		if (error) return next(error);
		this.password = hashedPassword;
		next();
	});
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);
