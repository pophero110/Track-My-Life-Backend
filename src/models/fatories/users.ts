const randomEmail = () => {
	return `test${Math.floor(Math.random() * 100000000)}@gmail.com`;
};

export const createFakeUser = () => {
	return {
		name: 'test',
		email: randomEmail(),
		password: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
		trackers: [],
	};
};
