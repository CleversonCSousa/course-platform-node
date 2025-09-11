import { AppDataSource } from "../data-source";
import { Course } from "../entities/Course";

export const courseRepository = AppDataSource.getRepository(Course);