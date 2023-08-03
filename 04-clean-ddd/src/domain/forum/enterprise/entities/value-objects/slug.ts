export class Slug {
	static create(slug: string) {
		return new Slug(slug);
	}

	/**
	 * @description Receives a string and normalize it as a slug
	 * @example "An example title" => "an-example-title"
	 * @param text {string}
	 */
	static createFromText(text: string) {
		const slugText = text
			.normalize('NFKD')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/_/g, '-')
			.replace(/--+/g, '-')
			.replace(/-$/g, '');

		return new Slug(slugText);
	}

	public value: string;

	private constructor(slugValue: string) {
		this.value = slugValue;
	}
}
