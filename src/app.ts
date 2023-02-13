// Load env variables
import * as dotenv from 'dotenv';
dotenv.config();

// Setup app
import bodyParser from 'body-parser';
import express from 'express';
const app = express();
app.use(bodyParser.json());

// Setup Routing
import userRoute from './controllers/user';
import sessionRoute from './controllers/session';
import trackerRoute from './controllers/tracker';
import trackerLogRoute from './controllers/trackerLog';
app.use('/api/v1/sessions', sessionRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/trackers', trackerRoute);
app.use('/api/v1/trackers', trackerLogRoute);

export default app;
