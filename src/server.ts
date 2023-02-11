import app from './app';
import { connectDatabase } from './utils/db';
async function start() {
	await connectDatabase();
	app.listen(process.env.PORT, () => {
		console.log(`** App listening on port ${process.env.PORT} **`);
	});
}

start().catch((e) => console.log(e));
