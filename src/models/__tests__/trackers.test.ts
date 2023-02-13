import { Tracker } from '../trackers';
import { ITrackerLog } from '../trackerLogs';

test('name can not be empty', async () => {
	const tracker = new Tracker({
		name: '',
		type: 'number',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const error = tracker.validateSync();

	expect(error?.errors.name.message).toBe('Path `name` is required.');
});

test('type can not be empty', async () => {
	const tracker = new Tracker({
		name: 'Test',
		type: '',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const error = tracker.validateSync();

	expect(error?.errors.type.message).toBe('Path `type` is required.');
});

test('createdAt can not be empty', async () => {
	const tracker = new Tracker({
		name: 'Test',
		type: 'number',
		createdAt: '',
		updatedAt: new Date(),
	});

	const error = tracker.validateSync();

	expect(error?.errors.createdAt.message).toBe(
		'Path `createdAt` is required.'
	);
});

test('updatedAt can not be empty', async () => {
	const tracker = new Tracker({
		name: 'Test',
		type: 'number',
		createdAt: new Date(),
		updatedAt: '',
	});

	const error = tracker.validateSync();

	expect(error?.errors.updatedAt.message).toBe(
		'Path `updatedAt` is required.'
	);
});

test('add trackeLog', async () => {
	const tracker = new Tracker({
		name: 'Test',
		type: 'number',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const trackeLog = {
		value: 1,
		createdAt: new Date(),
	};

	tracker.logs.push(trackeLog as ITrackerLog);

	expect(tracker.logs.length).toBe(1);
});

test('remove trackeLog', async () => {
	const tracker = new Tracker({
		name: 'Test',
		type: 'number',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const trackeLog = {
		value: 1,
		createdAt: new Date(),
	};

	tracker.logs.push(trackeLog as ITrackerLog);
	expect(tracker.logs.length).toBe(1);

	tracker.logs = tracker.logs.filter(
		(log) => log.createdAt !== trackeLog.createdAt
	);
	expect(tracker.logs.length).toBe(0);
});
