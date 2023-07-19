import { type CheckIn, type Gym } from '@prisma/client';

export interface GymsResponseProps {
	body: {
		gyms: Gym[];
	};
}

export interface CheckInsResponseProps {
	body: {
		checkIns: CheckIn[];
	};
}
