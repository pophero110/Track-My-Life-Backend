import express from 'express';
import { User } from '../models/users';
import mongoose from 'mongoose';
const userRoute = express.Router();

/* 
	Sign up a user
	@req.content-type application/json
	@req.body	email
	@req.body	password
	@req.body	name

	Successful response:
	@response.status 201
	@response.body {}
	
	Unsuccessful response:
	@response.status 400
	@response.body.error string
*/

userRoute.post('/', async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const user = new User({
			email,
			password,
			name,
		});
		await user.save();
		res.sendStatus(201);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			// TODO: format error message
			res.status(400).json({ error: error.message });
		}
	}
});

export default userRoute;
