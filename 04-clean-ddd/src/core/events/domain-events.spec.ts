import { type UniqueEntityId } from '../entities/unique-entity-id';
import { AggregateRoot } from '../entities/aggregate-root';
import { DomainEvents } from './domain-events';
import { type DomainEvent } from './domain-event';

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private readonly aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe('Domain events', () => {
	it('should be able to dispatch and listen to events', () => {
		const callbackSpy = vi.fn();

		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalledOnce();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
