import bcrypt from 'bcrypt';

export const checkPassword = async (
	password: string,
	hashedPassword: string
) => {
	return bcrypt.compare(password, hashedPassword);
};
