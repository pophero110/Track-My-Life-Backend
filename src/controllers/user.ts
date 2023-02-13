import express from 'express';
import { User } from '../models/users';
import mongoose from 'mongoose';
const userRoute = express.Router();

/**
 * @api post /users
 * @requestBody email: string, password: string, name: string
 * @status 400 Bad Request, 201 Created
 * @response error: string
 */
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
			// TODO: format error message
			res.status(400).json({ error: error.message });
		}
	}
}

userRoute.post('/', postHandler);

export default userRoute;
