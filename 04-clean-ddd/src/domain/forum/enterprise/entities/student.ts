import { type UniqueEntityid } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

interface StudentProps {
	name: string;
}

export class Student extends Entity<StudentProps> {
	static create(props: StudentProps, id?: UniqueEntityid) {
		const student = new Student(props, id);

		return student;
	}
}
