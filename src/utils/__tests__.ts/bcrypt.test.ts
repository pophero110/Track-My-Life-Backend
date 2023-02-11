import { checkPassword } from '../bcrypt';
import bcrypt from 'bcrypt';

test('checkPassword', async () => {
	const salt = await bcrypt.genSalt(10);
	const password = 'password';
	const hashedPassword = await bcrypt.hash(password, salt);
	expect(await checkPassword(password, hashedPassword)).toBe(true);
});
