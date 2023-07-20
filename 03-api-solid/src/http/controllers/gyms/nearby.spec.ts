import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to search nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Near Gym',
				description: 'lorem ipsom',
				phone: '88999999999',
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			.set('Authorization', `Bearer ${token}`);

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Far Gym',
				description: 'lorem ipsom',
				phone: '88999999999',
				latitude: -27.0610928,
				longitude: -49.5229501,
			})
			.set('Authorization', `Bearer ${token}`);

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({ latitude: -27.2092051, longitude: -49.6401092 })
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ gyms: [expect.objectContaining({ title: 'Near Gym' })] });
		expect(response.body.gyms).toHaveLength(1);
	});
});
