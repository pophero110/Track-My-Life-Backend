import { Session } from '../models/sessions';
import { generateToken } from '../utils/jwt';
import { defaultExpiresIn } from '../models/sessions';

export const createSession = async (userId: string) => {
	const session = new Session({
		userId,
		sessionToken: generateToken({ userId }, defaultExpiresIn),
		expires: new Date(Date.now() + defaultExpiresIn * 1000),
	});
	await session.save();
	return session;
};
