import express from 'express';
import { User } from '../models/users';
const userRoute = express.Router();

/* 
 @req.body	email
 @req.body	password
 @req.body	name
 
 @response {}
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
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({});
	}
});

export default userRoute;
