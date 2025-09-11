import { Course } from "@/database/type-orm/entities/Course";
import { CoursesRepository } from "./courses-repository";
import { courseRepository } from "@/database/type-orm/repositories/course-repository";

export class TypeOrmCoursesRepository implements CoursesRepository {
    async create(course: Course) {
        return await courseRepository.save(course);
    }
}