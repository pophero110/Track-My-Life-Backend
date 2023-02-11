import jwt from 'jsonwebtoken';

export function generateToken(payload: object, expiresIn: number): string {
	return jwt.sign(payload, process.env.NODE_SECRET_KEY, {
		expiresIn,
	});
}
