import express from 'express';
import { checkPassword } from '../utils/bcrypt';
import { IUser, User } from '../models/users';
import { createSession } from '../services/createSession';
import { destorySession } from '../services/destorySession';
import { authenticateJWT } from '../middleware/authenticate';
import type { ICustomRequest } from '../middleware/authenticate';
const sessionRoute = express.Router();

/**
 * @name create session
 * @route post /sessions
 * @requestBody email: string, password: string
 * @response user: { name: string, email: string, trackers: string[] }, sessionToken: string
 * @successStatus 201 - session created
 * @failureStatus 400 - invalid request body
 * @responseBody error: string
 */
export async function postHandler(req: express.Request, res: express.Response) {
	const { email, password } = req.body;
	const user: IUser | null = await User.findOne({ email }).exec();
	if (user) {
		const passwordMatch = await checkPassword(password, user.password);
		if (passwordMatch) {
			const session = await createSession(user._id);
			res.status(201).json({
				user: {
					name: user.name,
					trackers: user.trackers,
				},
				sessionToken: session.sessionToken,
			});
		} else {
			console.log('Invalid password', { email });
			res.status(400).json({ error: 'Invalid password' });
		}
	} else {
		console.log('Invalid email', { email });
		res.status(400).json({ error: 'Invalid email' });
	}
}

sessionRoute.post('/', postHandler);

/**
 * @name delete session
 * @route delete /sessions
 * @requestHeader authorization: string
 * @successStatus 204 - session deleted
 * @failureStatus 400 - invalid request body
 */
export async function deleteHandler(
	req: express.Request,
	res: express.Response
) {
	try {
		await destorySession((req as ICustomRequest).token);
		res.sendStatus(204);
	} catch (error) {
		res.sendStatus(400);
	}
}

sessionRoute.delete('/', authenticateJWT, deleteHandler);

export default sessionRoute;
