import { Slug } from "../slug";

interface MakeRandomUserSlugParams {
    firstName: string;
    lastName: string;
}
export function makeRandomUserSlug({ firstName, lastName } : MakeRandomUserSlugParams) {
    const slug = Slug.createFromText(firstName + " " + lastName + Math.floor(100000 + Math.random() * 900000)).value;

    return slug;
}