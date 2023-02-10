import mongoose from 'mongoose';

export async function connectDatabase() {
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));

	await mongoose.connect(
		process.env.NODE_ENV === 'test'
			? process.env.TEST_DATABASE_URL
			: process.env.DATABASE_URL
	);
}
