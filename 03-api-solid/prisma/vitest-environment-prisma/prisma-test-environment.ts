import { type Environment } from 'vitest';

export default {
	name: 'prisma',
	async setup() {
		console.log('Setup');

		return {
			async teardown() {
				console.log('Teardown');
			},
		};
	},
} satisfies Environment;
