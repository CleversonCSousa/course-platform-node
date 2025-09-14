
import { CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { TypeOrmCategoriesRepository } from "@/repositories/categories/type-orm-categories-repository";
import { TypeOrmCoursesRepository } from "@/repositories/courses/type-orm-courses-repository";
import { TypeOrmInstructorsRepository } from "@/repositories/instructors/type-orm-instructors-repository";
import { CreateCourseUseCase } from "@/use-cases/courses/create";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(CourseDifficulty),
        categoryId: z.uuid(),
        language: z.enum(CourseLanguage)
    });

    const { title, description, difficulty, categoryId, language } = createBodySchema.parse(request.body);

    try {
    
        const createCourseUseCase = new CreateCourseUseCase(new TypeOrmCoursesRepository(), new TypeOrmCategoriesRepository(), new TypeOrmInstructorsRepository());
        const { course } = await createCourseUseCase.execute({
            instructorId: request.user.sub,
            title,
            description,
            difficulty,
            categoryId,
            language
        });
        return reply.status(201).send({
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

        return reply.status(500).send();

    }
}