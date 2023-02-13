import { teardown } from './src/setup-teardown';
const globalTeardown = async () => {
	console.log('***globalTeardown***');
	await teardown();
};

export default globalTeardown;
