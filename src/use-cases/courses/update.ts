import { CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { InstructorStatus } from "@/database/type-orm/entities/Instructor";
import { CategoriesRepository } from "@/repositories/categories/categories-repository";
import { CoursesRepository } from "@/repositories/courses/courses-repository";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { Slug } from "@/value-objects/slug";
import { DuplicatedSlugError } from "../errors/duplicated-slug-error";

interface UpdateCourseUseCaseRequest {
    courseId: string;
    instructorId: string;
    categoryId: string;
    title: string;
    description: string;
    language: CourseLanguage;
    difficulty: CourseDifficulty;
}

export class UpdateCourseUseCase {
    constructor(private coursesRepository: CoursesRepository, private categoriesRepository: CategoriesRepository) {
        
    }

    async execute({ instructorId, courseId, categoryId, description, difficulty, language, title } : UpdateCourseUseCaseRequest) {

        const course = await this.coursesRepository.findByIdWithInstructor(courseId);
       
        if(!course) {
            throw new ResourceNotFoundError();
        }

        const instructor = course.instructor;
        
        if (!instructor || instructor.userId !== instructorId || instructor.status !== InstructorStatus.ACTIVE) {
            throw new UnauthorizedError();
        }

        const category = await this.categoriesRepository.findById(categoryId);

        if(!category) {
            throw new ResourceNotFoundError();
        }

        const newSlug = Slug.createFromText(title).value;

        const slugAlreadyExists = await this.coursesRepository.findBySlug(newSlug);

        if (slugAlreadyExists && slugAlreadyExists.id !== courseId) {
            throw new DuplicatedSlugError();
        }

        const updatedCourse = await this.coursesRepository.updateById(courseId, {
            title,
            description,
            difficulty,
            language,
            category,
            slug: Slug.createFromText(title).value
        });

        return { course: updatedCourse };
    }
}