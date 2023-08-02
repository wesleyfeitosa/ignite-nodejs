import { UniqueEntityid } from "./unique-entity-id";

export class Entity<Props> {
  private _id: UniqueEntityid;
  protected props: Props;
  
  protected constructor(props: Props, id?: UniqueEntityid) {
    this.props = props;
    this._id = id ?? new UniqueEntityid();
  }

  get id() {
    return this._id;
  }

}