import express from 'express';
import { User } from '../models/users';
import mongoose from 'mongoose';
const userRoute = express.Router();

/**
 * @name create user
 * @route POST /users
 * @requestBody email: string, password: string, name: string
 * @successStatus 201 - user created
 * @failureStatus 400 - invalid request body
 * @responseBody error: string
 */

//TODO: return session token after successful user creation
export async function postHandler(req: express.Request, res: express.Response) {
	const { email, password, name } = req.body;
	try {
		const user = new User({
			email,
			password,
			name,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		await user.save();
		res.sendStatus(201);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
			return;
		}
		// MongoServerError
		if ((error as { code: number }).code === 11000) {
			res.status(400).json({ error: 'Email already exists' });
			return;
		}
		// TODO: log error to logging service
		console.log('Error creating user', { error });
		res.status(400).json({ error: 'Something went wrong' });
	}
}

userRoute.post('/', postHandler);

export default userRoute;
