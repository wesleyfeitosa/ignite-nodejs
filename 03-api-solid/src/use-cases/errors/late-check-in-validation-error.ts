export class LateCheckInValidationError extends Error {
	constructor() {
		super('The check-in can only be created until 20 minutes after its creation.');
	}
}
