import { Course } from "@/database/type-orm/entities/Course";
import { CoursesRepository } from "./courses-repository";
import { courseRepository } from "@/database/type-orm/repositories/course-repository";
import { AppDataSource } from "@/database/type-orm/data-source";
import { UpdateResult } from "typeorm";

export class TypeOrmCoursesRepository implements CoursesRepository {
    async create(course: Course) {
        return await courseRepository.save(course);
    }
    async findById(id: string) {
        return await courseRepository.findOneBy({
            id
        });
    }
    async updateById(id: string, data: Partial<Course>) {

        const result: UpdateResult = await AppDataSource.createQueryBuilder()
            .update(Course)
            .set(data)
            .where("id = :id", { id: id })
            .returning(["title", "slug", "language", "description", "difficulty", "createdAt", "updateAt", "instructorId", "categoryId"])
            .execute();

        return result.raw[0];
    }
    async findBySlug(slug: string): Promise<Course | null> {
        return await courseRepository.findOneBy({
            slug
        });
    }

    async findByIdWithInstructor(id: string) {
        return await courseRepository.findOne({
            where: {
                id,
            },
            relations: ["instructor"]
        });
    }
}