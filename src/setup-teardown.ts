import { clearDatabase, connectDatabase, disconnectDatabase } from './utils/db';

export const setup = async () => {
	await connectDatabase();
};

export const teardown = async () => {
	await clearDatabase();
	await disconnectDatabase();
};
