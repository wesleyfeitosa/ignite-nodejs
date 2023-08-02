import { Entity } from "../../core/entities/entity";
import { UniqueEntityid } from "../../core/entities/unique-entity-id";
import { Optional } from "../../core/types/optional";

interface AnswerProps {
  authorId: UniqueEntityid;
  questionId: UniqueEntityid;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityid) {
    const answer = new Answer({
      ...props,
      createdAt: new Date(),
    }, id);

    return answer;
  }

  get content() {
    return this.props.content;
  }
}
