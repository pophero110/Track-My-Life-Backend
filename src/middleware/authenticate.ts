import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

interface IUserPayload {
	userId: string;
}

export interface ICustomRequest extends Request {
	user: IUserPayload;
	token: string;
}
export const authenticateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(
			token,
			process.env.NODE_SECRET_KEY,
			(error: VerifyErrors | null, user) => {
				if (error) {
					console.log('Invalid session token', { error, user });
					return res
						.status(401)
						.json({ error: 'Invalid session token' });
				}

				(req as ICustomRequest).token = token;
				(req as ICustomRequest).user = user as IUserPayload;

				next();
			}
		);
	} else {
		console.log('Missing authorization header', { authHeader });
		res.status(401).json({ error: 'Missing authorization header' });
	}
};
