import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const validateCheckInParamSchema = z.object({
		checkInId: z.string().uuid(),
	});

	const { checkInId } = validateCheckInParamSchema.parse(request.params);

	try {
		const validateCheckInUseCase = makeValidateCheckInUseCase();

		await validateCheckInUseCase.execute({
			checkInId,
		});

		return await reply.status(204).send();
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({ message: error.message });
		}

		throw error;
	}
}
