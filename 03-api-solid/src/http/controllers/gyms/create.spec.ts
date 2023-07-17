import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to create a Gym', async () => {
		const { token } = await createAndAuthenticateUser(app);

		const response = await request(app.server)
			.post('/gyms')
			.send({
				title: 'Javascript Gym',
				description: 'lorem ipsom',
				phone: '88993200822',
				latitude: -4.9649698,
				longitude: -39.0074127,
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(201);
	});
});
