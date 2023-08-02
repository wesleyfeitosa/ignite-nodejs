import { Entity } from "../../core/entities/entity";
import { UniqueEntityid } from "../../core/entities/unique-entity-id";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityid) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}