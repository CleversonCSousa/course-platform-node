
import { randomUUID } from "crypto";
import { CoursesRepository } from "./courses-repository";
import { Course } from "@/database/type-orm/entities/Course";

export class InMemoryCoursesRepository implements CoursesRepository {
    private items: Course[] = [];

    async findById(id: string) {
        const course = this.items.find(item => item.id === id);

        if(!course) {
            return null;
        }

        return course;
    }
    

    async create(course: Course) {

        const newCourse: Course = {
            id: randomUUID(),
            title: course.title,
            slug: course.slug,
            description: course.description,
            difficulty: course.difficulty,
            language: course.language,
            createdAt: course.createdAt ?? new Date(),
            updatedAt: course.updatedAt ?? new Date(),
            instructor: course.instructor,
            category: course.category
        };

        this.items.push(newCourse);

        return newCourse;
    }
}