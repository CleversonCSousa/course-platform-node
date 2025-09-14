
import { CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { TypeOrmCategoriesRepository } from "@/repositories/categories/type-orm-categories-repository";
import { TypeOrmCoursesRepository } from "@/repositories/courses/type-orm-courses-repository";
import { UpdateCourseUseCase } from "@/use-cases/courses/update";
import { DuplicatedSlugError } from "@/use-cases/errors/duplicated-slug-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updateBodySchema = z.object({
        courseId: z.string(),
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(CourseDifficulty),
        categoryId: z.uuid(),
        language: z.enum(CourseLanguage)
    });

    const { courseId, title, description, difficulty, categoryId, language } = updateBodySchema.parse(request.body);

    try {
        const useCase = new UpdateCourseUseCase(new TypeOrmCoursesRepository(), new TypeOrmCategoriesRepository());
        const { course } = await useCase.execute({
            courseId,
            instructorId: request.user.sub,
            title,
            description,
            difficulty,
            categoryId,
            language
        });
        return reply.status(200).send({
            course
        });
    } catch(err) {

        if(err instanceof ResourceNotFoundError) {
            return reply.status(404).send();
        }

        if(err instanceof UnauthorizedError) {
            return reply.status(401).send({
                message: err.message
            });
        }

        if(err instanceof DuplicatedSlugError) {
            return reply.status(409).send({
                message: err.message
            });
        }

        return reply.status(500).send();

    }
}