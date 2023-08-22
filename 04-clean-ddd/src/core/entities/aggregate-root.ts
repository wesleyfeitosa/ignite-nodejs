import { DomainEvents } from '../events/domain-events';
import { type DomainEvent } from '../events/domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<Props> extends Entity<Props> {
	private _domainEvents: DomainEvent[] = [];

	get domainEvents(): DomainEvent[] {
		return this._domainEvents;
	}

	public clearEvents() {
		this._domainEvents = [];
	}

	protected addDomainEvent(domainEvent: DomainEvent) {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}
}
