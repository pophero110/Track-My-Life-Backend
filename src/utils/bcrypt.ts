import bcrypt from 'bcrypt';

export const checkPassword = async (
	password: string,
	hashedPassword: string
) => {
	return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};
