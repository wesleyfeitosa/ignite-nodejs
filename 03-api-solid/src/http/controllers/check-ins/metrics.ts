import { type FastifyReply, type FastifyRequest } from 'fastify';

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
	const fetchUserMetricsUseCase = makeGetUserMetricsUseCase();

	const { checkInsCount } = await fetchUserMetricsUseCase.execute({ userId: request.user.sub });

	return reply.status(200).send({ checkInsCount });
}
