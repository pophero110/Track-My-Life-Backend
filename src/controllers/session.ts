import express from 'express';
import { checkPassword } from '../utils/bcrypt';
import { IUser, User } from '../models/users';
import { createSession } from '../services/createSession';
const sessionRoute = express.Router();

/*
    @req.body	email
    @req.body	password

    @response.status 201
    @response.body {
        sessionToken: string
    }

    @response.status 400
    @response.body.error string
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

export default sessionRoute;
