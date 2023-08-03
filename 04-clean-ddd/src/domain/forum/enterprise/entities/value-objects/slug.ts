export class Slug {
	/**
	 * @description Receives a string and normalize it as a slug
	 * @example "An example title" => "an-example-title"
	 * @param text {string}
	 */
	public static createFromText(text: string) {
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

	constructor(slugValue: string) {
		this.value = slugValue;
	}
}
