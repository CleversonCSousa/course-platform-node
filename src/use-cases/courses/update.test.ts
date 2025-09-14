import { UsersRepository } from "@/repositories/users-repository";
import { CoursesRepository } from "@/repositories/courses-repository";
import { CategoriesRepository } from "@/repositories/categories-repository";
import { InMemoryCoursesRepository } from "@/repositories/in-memory-courses";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory-categories";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { InstructorsRepository } from "@/repositories/instructors-repository";
import { InMemoryInstructorsRepository } from "@/repositories/in-memory-instructors-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { makeRandomUserSlug } from "@/value-objects/factories/make-random-user-slug";
import { InstructorStatus } from "@/database/type-orm/entities/Instructor";
import { CourseDifficulty, CourseLanguage } from "@/database/type-orm/entities/Course";
import { UpdateCourseUseCase } from "./update";
import { Slug } from "@/value-objects/slug";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { DuplicatedSlugError } from "../errors/duplicated-slug-error";

let sut : UpdateCourseUseCase;
let usersRepository: UsersRepository;
let instructorsRepository: InstructorsRepository;
let coursesRepository: CoursesRepository;
let categoriesRepository: CategoriesRepository;


describe("Update Course Course Use Case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        instructorsRepository = new InMemoryInstructorsRepository();
        coursesRepository = new InMemoryCoursesRepository(instructorsRepository);
        categoriesRepository = new InMemoryCategoriesRepository();
        sut = new UpdateCourseUseCase(coursesRepository, categoriesRepository);
    });

    it("should be able to update course", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456"
        });

        const instructor = await instructorsRepository.create({
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
            id: "category-id-1"
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            category,
            instructor,
            categoryId: category.id,
            instructorId: instructor.userId
        });

        const newCategory = await categoriesRepository.create({
            name: "Web Development",
            slug: "web-development",
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
            id: "category-id-2"
        });

        const updatedCourse = await sut.execute({
            courseId: course.id,
            title: "TypeScript Course",
            difficulty: CourseDifficulty.INTERMEDIARY,
            description: "An Intermediate TypeScript Course",
            language: CourseLanguage.EN_US,
            categoryId: newCategory.id,
            instructorId: instructor.userId,
        });
        
        if (updatedCourse.course) {
            expect(updatedCourse.course.title).toEqual("TypeScript Course");
            expect(updatedCourse.course.description).toEqual("An Intermediate TypeScript Course");
            expect(updatedCourse.course.difficulty).toEqual(CourseDifficulty.INTERMEDIARY);
            expect(updatedCourse.course.language).toEqual(CourseLanguage.EN_US);
            expect(updatedCourse.course.slug).toEqual(Slug.createFromText("TypeScript Course").value);
            expect(updatedCourse.course.category.id).toEqual(newCategory.id);
        }
    });

    it("should not be able to update course if a other course have a same slug", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456"
        });

        const instructor = await instructorsRepository.create({
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
            id: "category-id-1"
        });

        await coursesRepository.create({
            title: "TypeScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            slug: Slug.createFromText("TypeScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            category,
            instructor,
            categoryId: category.id,
            instructorId: instructor.userId
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            category,
            instructor,
            categoryId: category.id,
            instructorId: instructor.userId
        });

        await expect(() => sut.execute({
            courseId: course.id,
            title: "TypeScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer TypeScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(DuplicatedSlugError);
        
    });

    it("should not be able to update course if the instructor is pending", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456"
        });

        const instructor = await instructorsRepository.create({
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
            id: "category-id-1"
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            category,
            instructor,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: category.id,
            instructorId: instructor.userId
        });

        await expect(() => sut.execute({
            courseId: course.id,
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should not be able to update course if the instructor is suspend", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456"
        });

        const instructor = await instructorsRepository.create({
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
            id: "category-id-1"
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            category,
            instructor,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: category.id,
            instructorId: instructor.userId
        });

        await expect(() => sut.execute({
            courseId: course.id,
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should not be able to update course if the instructor is banned", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456"
        });

        const instructor = await instructorsRepository.create({
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
            id: "category-id-1"
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            category,
            instructor,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: category.id,
            instructorId: instructor.userId
        });

        await expect(() => sut.execute({
            courseId: course.id,
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: user.id
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("should not be able to update course if the instructor does not own the course", async () => {

        const user = await usersRepository.create({
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            slug: makeRandomUserSlug({
                firstName: "John",
                lastName: "Doe"
            }),
            passwordHash: "123456",
        });

        const ownerInstructor = await instructorsRepository.create({
            userId: user.id,
            status: InstructorStatus.ACTIVE,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: []
        });

        const otherInstructor = await instructorsRepository.create({
            userId: "other-instructor-id",
            status: InstructorStatus.ACTIVE,
            user: user,
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
            id: "category-id-1"
        });

        const course = await coursesRepository.create({
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            category,
            instructor: ownerInstructor,
            slug: Slug.createFromText("JavaScript Course").value,
            id: "course-id-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: category.id,
            instructorId: ownerInstructor.userId,
        });

        await expect(() => sut.execute({
            courseId: course.id,
            title: "JavaScript Course",
            difficulty: CourseDifficulty.BEGINNER,
            description: "A Begginer JavaScript Course",
            language: CourseLanguage.EN_US,
            categoryId: category.id,
            instructorId: otherInstructor.userId
        })).rejects.toBeInstanceOf(UnauthorizedError);
    });

});