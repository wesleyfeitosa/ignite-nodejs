import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
	private readonly value: string;

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}

	toString() {
		return this.value;
	}

	toValue() {
		return this.value;
	}

	public equals(id: UniqueEntityId) {
		return id.toString() === this.toString();
	}
}
