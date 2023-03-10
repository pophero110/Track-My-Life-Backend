import { generateToken } from '../jwt';

describe('generateToken', () => {
	it('should generate a valid token', () => {
		const expiresIn = 1;
		const token = generateToken({ id: 1 }, expiresIn);
		expect(token).toBeTruthy();
	});
});
