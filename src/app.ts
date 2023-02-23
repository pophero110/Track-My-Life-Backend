// Load env variables
import * as dotenv from 'dotenv';
dotenv.config();

// Setup app
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(
	cors({
		origin: '*',
		credentials: true,
		allowedHeaders: ['Authorization', 'Content-Type'],
	})
);

// Setup Routing
import userRoute from './controllers/user';
import sessionRoute from './controllers/session';
import trackerRoute from './controllers/tracker';
import trackerLogRoute from './controllers/trackerLog';
app.use(function (req, res, next) {
	// log incoming request
	console.log(`${req.method} ${req.url}`);
	// log outgoing response
	res.on('finish', () => {
		console.log(
			`${res.statusCode} ${res.statusMessage}; ${
				res.get('Content-Length') || 0
			}b sent`
		);
	});
	next();
});

app.use('/api/v1/sessions', sessionRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/trackers', trackerRoute);
app.use('/api/v1/trackers', trackerLogRoute);

export default app;
