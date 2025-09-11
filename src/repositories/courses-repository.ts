import { Course } from "@/database/type-orm/entities/Course";

export interface CoursesRepository {
    create(course: Course) : Promise<Course>;
}