import { type UniqueEntityId } from '../entities/unique-entity-id';
import { type AggregateRoot } from '../entities/aggregate-root';
import { type DomainEvent } from './domain-event';

type DomainEventCallback = (event: any) => void;

export class DomainEvents {
	// Public methods
	public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
		const aggregateFound = Boolean(this.findMarkedAggregateByID(aggregate.id));

		if (!aggregateFound) {
			this.markedAggregates.push(aggregate);

			console.log('Marked aggregate for dispatch:', aggregate.id.toString());
		}
	}

	public static dispatchEventsForAggregate(id: UniqueEntityId) {
		const aggregate = this.findMarkedAggregateByID(id);

		if (aggregate) {
			this.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			this.removeAggregateFromMarkedDispatchList(aggregate);

			console.log('Dispatched aggregate events:', id.toString());
		}
	}

	public static register(
		callback: DomainEventCallback,
		eventClassName: string,
	) {
		const wasEventRegisteredBefore = eventClassName in this.handlersMap;

		if (!wasEventRegisteredBefore) {
			this.handlersMap[eventClassName] = [];
		}

		this.handlersMap[eventClassName].push(callback);

		console.log('Registered event:', eventClassName);
	}

	public static clearHandlers() {
		this.handlersMap = {};
		console.log('Cleared event handlers');
	}

	public static clearMarkedAggregates() {
		this.markedAggregates = [];
		console.log('Cleared marked aggregates');
	}

	// Private properties
	private static handlersMap: Record<string, DomainEventCallback[]> = {};
	private static markedAggregates: Array<AggregateRoot<any>> = [];

	// Private methods
	private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
		aggregate.domainEvents.forEach((event: DomainEvent) => {
			this.dispatch(event);
		});
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<any>,
	) {
		const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

		this.markedAggregates.splice(index, 1);
	}

	private static findMarkedAggregateByID(
		id: UniqueEntityId,
	): AggregateRoot<any> | undefined {
		return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
	}

	private static dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in this.handlersMap;

		if (isEventRegistered) {
			const handlers = this.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
