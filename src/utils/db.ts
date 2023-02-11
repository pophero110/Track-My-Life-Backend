import mongoose from 'mongoose';

export async function connectDatabase() {
	const db = mongoose.connection;
	mongoose.set('strictQuery', false);
	db.on('error', console.error.bind(console, 'connection error: '));

	await mongoose.connect(
		process.env.NODE_ENV === 'test'
			? process.env.TEST_DATABASE_URL
			: process.env.DATABASE_URL
	);
}

export async function disconnectDatabase() {
	await mongoose.disconnect();
}

export async function clearDatabase() {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
}
