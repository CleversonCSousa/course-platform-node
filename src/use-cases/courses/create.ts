import { Course, CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { InstructorStatus } from "@/database/type-orm/entities/Instructor";
import { CategoriesRepository } from "@/repositories/categories/categories-repository";
import { CoursesRepository } from "@/repositories/courses/courses-repository";
import { InstructorsRepository } from "@/repositories/instructors/instructors-repository";
import { Slug } from "@/value-objects/slug";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DuplicatedSlugError } from "../errors/duplicated-slug-error";

interface CreateCourseUseCaseRequest {
    instructorId: string;
    categoryId: string;
    title: string;
    description: string;
    language: CourseLanguage;
    difficulty: CourseDifficulty;
}

export class CreateCourseUseCase {
    constructor(private coursesRepository: CoursesRepository, private categoriesRepository: CategoriesRepository, private instructorsRepository: InstructorsRepository) {
        
    }

    async execute({ instructorId, categoryId, title, description, difficulty, language } : CreateCourseUseCaseRequest) {

        const instructor = await this.instructorsRepository.findById(instructorId);
        const category = await this.categoriesRepository.findById(categoryId);

        if(!category) {
            throw new ResourceNotFoundError();
        }

        if(!instructor) {
            throw new UnauthorizedError();
        }

        if(instructor.status !== InstructorStatus.ACTIVE) {
            throw new UnauthorizedError();
        }

        const courseAlreadyExists = await this.coursesRepository.findBySlug(Slug.createFromText(title).value);

        if(courseAlreadyExists) {
            throw new DuplicatedSlugError();
        }

        const newCourse = new Course();
        newCourse.title = title;
        newCourse.description = description;
        newCourse.difficulty = difficulty;
        newCourse.language = language;
        newCourse.slug = Slug.createFromText(title).value;
        newCourse.instructor = instructor;
        newCourse.category = category;

        const course = await this.coursesRepository.create(newCourse);

        return { course };
    }
}