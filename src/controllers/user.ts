import express from 'express';
import { User } from '../models/users';
import mongoose from 'mongoose';
const userRoute = express.Router();

/* 
	@req.body	email
	@req.body	password
	@req.body	name

	@response.status 201
	@response.body {}
	
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
		res.status(201).json({});
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ error: error.message });
		}
	}
});

export default userRoute;
