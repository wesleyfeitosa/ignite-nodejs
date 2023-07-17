import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInParamSchema = z.object({
		gymId: z.string().uuid(),
	});

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { gymId } = createCheckInParamSchema.parse(request.params);
	const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

	try {
		const createCheckInUseCase = makeCheckInUseCase();

		await createCheckInUseCase.execute({
			gymId,
			userId: request.user.sub,
			userLatitude: latitude,
			userLongitude: longitude,
		});

		return await reply.status(201).send();
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({ message: error.message });
		}

		throw error;
	}
}
