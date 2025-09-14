import { UsersRepository } from "@/repositories/users/users-repository";
import { CreateCourseUseCase } from "./create";
import { CoursesRepository } from "@/repositories/courses/courses-repository";
import { CategoriesRepository } from "@/repositories/categories/categories-repository";
import { InMemoryCoursesRepository } from "@/repositories/courses/in-memory-courses";
import { InMemoryCategoriesRepository } from "@/repositories/categories/in-memory-categories-repository";
import { InMemoryUsersRepository } from "@/repositories/users/in-memory-users-repository";
import { InstructorsRepository } from "@/repositories/instructors/instructors-repository";
import { InMemoryInstructorsRepository } from "@/repositories/instructors/in-memory-instructors-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { makeRandomUserSlug } from "@/value-objects/factories/make-random-user-slug";
import { InstructorStatus } from "@/database/type-orm/entities/Instructor";
import { CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let sut : CreateCourseUseCase;
let usersRepository: UsersRepository;
let instructorsRepository: InstructorsRepository;
let coursesRepository: CoursesRepository;
let categoriesRepository: CategoriesRepository;


describe("Create Course Course Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        instructorsRepository = new InMemoryInstructorsRepository();
        coursesRepository = new InMemoryCoursesRepository(instructorsRepository);
        categoriesRepository = new InMemoryCategoriesRepository();
        sut = new CreateCourseUseCase(coursesRepository, categoriesRepository, instructorsRepository);
    });

    it("should be able to create course if the instructor is active", async () => {

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            })
        });

        await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.ACTIVE,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        const category = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id"
        });

        const { course } = await sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id,
        });

        expect(course).toBeTruthy();
        expect(course.id).toEqual(expect.any(String));
        expect(course.slug).toEqual("javascript-course");
        expect(course.instructor.user.id).toEqual(user.id);
        expect(course.category.id).toEqual(category.id);
    });

    it("should be not be able to create course if the instructor is pending", async () => {

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            })
        });

        await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.PENDING,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        const category = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id"
        });

        await expect(() => sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should be not be able to create course if the instructor is suspend", async () => {

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            })
        });

        await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.SUSPENDED,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        const category = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id"
        });
        
        await expect(() => sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should be not be able to create course if the instructor is banned", async () => {

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            })
        });

        await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.BANNED,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        const category = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id"
        });
        
        await expect(() => sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should be not be able to create course if the instructor does not exist", async () => {

        const category = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id"
        });
        
        await expect(() => sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: "instructor-id"
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should be not be able to create course if the category does not exist", async () => {

        const user = await usersRepository.create({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            passwordHash: "123456",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            })
        });

        await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.SUSPENDED,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        await expect(() => sut.execute({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: "category-id",
            instructorId: user.id
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});