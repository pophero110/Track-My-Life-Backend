import { setup } from './src/setup-teardown';
import * as dotenv from 'dotenv';
dotenv.config();
const globalSetup = async () => {
	console.log('\n***globalSetup***');
	await setup();
};

export default globalSetup;
