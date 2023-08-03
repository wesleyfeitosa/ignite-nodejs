import { UniqueEntityid } from './unique-entity-id';

export class Entity<Props> {
	protected props: Props;
	private readonly _id: UniqueEntityid;

	protected constructor(entityProps: Props, id?: UniqueEntityid) {
		this.props = entityProps;
		this._id = id ?? new UniqueEntityid();
	}

	get id() {
		return this._id;
	}
}
