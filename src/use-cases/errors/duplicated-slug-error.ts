export class DuplicatedSlugError extends Error {
    constructor() {
        super("Slug already exists.");
    }
}