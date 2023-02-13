import { setup, teardown } from './src/setup-teardown';
import * as dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await teardown();
});
