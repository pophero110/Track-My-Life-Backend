import express from 'express';
import { checkPassword } from '../utils/bcrypt';
import { IUser, User } from '../models/users';
import { createSession } from '../services/createSession';
import { destorySession } from '../services/destorySession';
import { authenticateJWT } from '../middleware/authenticate';
import type { ICustomRequest } from '../middleware/authenticate';
const sessionRoute = express.Router();

/*
	Sign in a user and return a session token
	@req.content-type application/json
    @req.body	email
    @req.body	password

	Successfull response:
    @response.status 201
    @response.body {
        sessionToken: string
    }
	Unsuccessful response:
	@response.status 400
	@response.body {
		error: string
	}
*/

sessionRoute.post('/', async (req, res) => {
	const { email, password } = req.body;
	const user: IUser | null = await User.findOne({ email });
	if (user) {
		const passwordMatch = await checkPassword(password, user.password);
		if (passwordMatch) {
			const session = await createSession(user._id);
			res.status(201).json({
				sessionToken: session.sessionToken,
			});
		} else {
			res.status(400).json({ error: 'Invalid password' });
		}
	} else {
		res.status(400).json({ error: 'Invalid email' });
	}
});

/* 
	Sign out a user and destroy the session token
	@req.headers.authorization Bearer <sessionToken>
	
	Successful response:
	@response.status 204

	Unsuccessful response:
	@response.status 400
*/

sessionRoute.delete('/', authenticateJWT, async (req, res) => {
	try {
		await destorySession((req as ICustomRequest).token);
		res.sendStatus(204);
	} catch (error) {
		res.status(400).json({ error: 'Invalid session token' });
	}
});

export default sessionRoute;
