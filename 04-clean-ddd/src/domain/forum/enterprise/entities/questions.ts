import dayjs from 'dayjs';

import { type Optional } from '@/core/types/optional';
import { type UniqueEntityid } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { Slug } from './value-objects/slug';

export interface QuestionProps {
	authorId: UniqueEntityid;
	bestAnswerId?: UniqueEntityid;
	title: string;
	slug: Slug;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {
	static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityid) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				createdAt: new Date(),
			},
			id,
		);

		return question;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	set bestAnswerId(bestAnswerId: UniqueEntityid | undefined) {
		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	get slug() {
		return this.props.slug;
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isNew() {
		return dayjs().diff(this.props.createdAt, 'days') <= 3;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}
}
