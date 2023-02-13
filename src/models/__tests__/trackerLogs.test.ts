import { TrackerLog } from '../trackerLogs';

test('value can not be empty', async () => {
	const trackerLog = new TrackerLog({
		value: '',
		createdAt: new Date(),
	});

	const error = trackerLog.validateSync();

	expect(error?.errors.value.message).toBe('Path `value` is required.');
});

test('createdAt can not be empty', async () => {
	const trackerLog = new TrackerLog({
		value: 1,
		createdAt: '',
	});

	const error = trackerLog.validateSync();

	expect(error?.errors.createdAt.message).toBe(
		'Path `createdAt` is required.'
	);
});

test('value can not be less than 0', async () => {
	const trackerLog = new TrackerLog({
		value: 0,
		createdAt: new Date(),
	});

	const error = trackerLog.validateSync();

	expect(error?.errors.value.message).toBe('Value must be > 0');
});

test('value can not be less than 0', async () => {
	const trackerLog = new TrackerLog({
		value: -1,
		createdAt: new Date(),
	});

	const error = trackerLog.validateSync();

	expect(error?.errors.value.message).toBe('Value must be > 0');
});
