import { UniqueEntityid } from "../../core/entities/unique-entity-id";
import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRquest {
  instructorId: string;
  questionId: string;
  content: string;
}

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository
  ) {}

  async execute({instructorId, questionId, content}: AnswerQuestionUseCaseRquest) {
    const answer = Answer.create({
      content, 
      authorId: new UniqueEntityid(instructorId), 
      questionId: new UniqueEntityid(questionId),
    });

    await this.answersRepository.create(answer);

    return answer;
  }
}