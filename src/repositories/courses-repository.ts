import { Course } from "@/database/type-orm/entities/Course";
import { Instructor } from "@/database/type-orm/entities/Instructor";

export interface CoursesRepository {
    create(course: Course) : Promise<Course>;
    findBySlug(slug: string) : Promise<Course | null>;
    findById(id: string) : Promise<Course | null>;
    updateById(id: string, data: Partial<Course>) : Promise<Course>;
    findByIdWithInstructor(id: string): Promise<(Course & { instructor: Instructor }) | null>;
}