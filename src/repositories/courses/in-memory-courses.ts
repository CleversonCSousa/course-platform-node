
import { randomUUID } from "crypto";
import { CoursesRepository } from "./courses-repository";
import { Course } from "@/database/type-orm/entities/Course";
import { InstructorsRepository } from "../instructors/instructors-repository";

export class InMemoryCoursesRepository implements CoursesRepository {
    private items: Course[] = [];

    constructor(private instructorsRepository: InstructorsRepository) {
        
    }

    async findById(id: string) {
        const course = this.items.find(item => item.id === id);

        if(!course) {
            return null;
        }

        return course;
    }
    

    async create(course: Course, id?: string) {

        this.items.push({
            ...course,
            id: id ? `course-${this.items.length}` : randomUUID()
        });

        return this.items[this.items.length - 1];
    }

    async updateById(id: string, data: Partial<Course>) {
    
        const courseIndex = this.items.findIndex(item => item.id === id);
    
        if (courseIndex === -1) {
            throw new Error("Course not found.");
        }


        this.items[courseIndex] = {
            ...this.items[courseIndex],
            ...data
        };

        return this.items[courseIndex];
    
    }

    async findBySlug(slug: string) {
        const course = this.items.find(item => item.slug === slug);

        if(!course) {
            return null;
        }

        return course;
    }

    async findByIdWithInstructor(id: string) {
        const course = this.items.find(item => item.id === id);

        if (!course) {
            return null;
        }

        const instructor = await this.instructorsRepository.findById(course.instructorId);

        if (!instructor) {
            return null;
        }

        return { ...course, instructor };
    }
}